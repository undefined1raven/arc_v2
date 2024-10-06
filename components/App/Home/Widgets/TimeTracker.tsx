import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import RBox from "@/components/common/RBox";
import RLabel from "@/components/common/RLabel";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, Easing, FadeIn } from "react-native-reanimated";
import store from "@/app/store";
import {
  getVal,
  globalEnteringConfig,
} from "@/app/config/defaultTransitionConfig";
import { widgetContainerConfig } from "../widgetContainerConfig";
import { useSQLiteContext } from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import RButton from "@/components/common/RButton";
import TimeTrackingActivityMenu from "./TimeTrackerActivityMenu";
import {
  ARC_ChunksType,
  ArcTaskLogType,
  FeatureConfigArcType,
} from "@/app/config/commonTypes";
import * as jsesc from "jsesc";
import { displayTimeFromMsDuration } from "@/fn/timeUtils/displayTimeFromMsDuration";
import { timeOfDayFromUnix } from "@/fn/timeUtils/timeOfDayFromUnix";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { randomUUID } from "expo-crypto";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { MaxActivitiesInArcChunk } from "@/app/config/chunking";
import { symmetricEncrypt } from "../../encryptors/symmetricEncrypt";
import { newChunkID } from "@/fn/newChunkID";
import { symmetricDecrypt } from "../../decryptors/symmetricDecrypt";
import useEncryptionStore from "../../encryptors/encryptionStore";
import { SingleEncrypt } from "@/components/common/crypto/SingleEncrypt";
import useStatusIndicatorsStore from "@/stores/statusIndicators";
import { EditDeco } from "@/components/common/deco/EditDeco";

export default function TimeTracker({ navigation }) {
  store.subscribe(() => {});
  const encryptionAPI = useEncryptionStore();
  const statusIndicatorsAPI = useStatusIndicatorsStore();
  const currentArcActivitiesAPI = useArcCurrentActivitiesStore();
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const activeUserID = useLocalUserIDsStore().getActiveUserID();
  const arcFeatureConfig: FeatureConfigArcType = useArcFeatureConfigStore(
    (store) => store.arcFeatureConfig
  );
  const [displayDurationLabel, setDisplayDurationLabel] = useState("");
  const [displayStartedAtLabel, setDisplayStartedAtLabel] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [dataToEncrypt, setDataToEncrypt] = useState<null | string>(null);
  const [encryptedData, setEncryptedData] = useState<null | string>(null);
  const [tickerInterval, setTickerInterval] = useState<null | any>(null);
  const [currentActivities, setCurrentActivities] = useState<ArcTaskLogType[]>(
    []
  );
  const [
    hasCurrentActivitiesFromUserData,
    setHasCurrentActivitiesFromUserData,
  ] = useState<boolean>(false);

  const [currentDisplayedActivity, setCurrentDisplayedActivity] =
    useState<null | ArcTaskLogType>(null);
  const timeTrackingContainerConfig = {
    containerHeight: 163,
    containerWidth: 354,
  };
  const db = useSQLiteContext();

  useEffect(() => {
    if (currentActivities.length > 0) {
      setCurrentDisplayedActivity(currentActivities[0]);
    } else {
      setCurrentDisplayedActivity(null);
    }
    mutateCurrentActivities(currentActivities);
  }, [currentActivities]);

  useEffect(() => {
    if (currentDisplayedActivity !== null) {
      setDisplayStartedAtLabel(
        timeOfDayFromUnix(currentDisplayedActivity.start)
      );
      if (tickerInterval !== null) {
        clearInterval(tickerInterval);
      }
      setTickerInterval(
        setInterval(() => {
          const delta = Date.now() - currentDisplayedActivity.start;
          setDisplayDurationLabel(displayTimeFromMsDuration(delta));
        }, 150)
      );
    }
  }, [currentDisplayedActivity]);

  useEffect(() => {
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    getActivitiesFromUserData();
  }, []);

  function getActivitiesFromUserData() {
    if (hasCurrentActivitiesFromUserData === true) return;
    db.getFirstAsync(
      `SELECT value, userID FROM userData WHERE key=? AND userID=?`,
      ["ongoingActivities", activeUserID]
    )
      .then((res) => {
        if (res === undefined || res === null) {
          setHasCurrentActivitiesFromUserData(true);
          setCurrentActivities([]);
        } else {
          const parsed = JSON.parse(res.value);
          setCurrentActivities(parsed);
          setHasCurrentActivitiesFromUserData(true);
        }
      })
      .catch((e) => {
        setHasCurrentActivitiesFromUserData(true);
        setCurrentActivities([]);
      });
  }

  function mutateCurrentActivities(value: ArcTaskLogType[]) {
    if (hasCurrentActivitiesFromUserData === false) return;
    if (value === undefined) return;
    if (value === null) return;
    db.runAsync(
      `INSERT OR REPLACE INTO userData (value, key, userID, version) VALUES (?, ?, ?, ?)`,
      [JSON.stringify(value), "ongoingActivities", activeUserID, "0.1.1"]
    )
      .then((r) => {
        // console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (encryptedData === null) return;
    if (dataToEncrypt === null) return;
    console.log("saving chunk started");
    const encryptedPayload = encryptedData;
    const newChunk = {
      ...currentArcActivitiesAPI.lastChunk,
      encryptedContent: encryptedPayload,
    };
    db.runAsync(
      `INSERT OR REPLACE INTO arcChunks (id, userID, encryptedContent, tx, version) VALUES (?, ?, ?, ?, ?)`,
      [
        newChunk.id,
        newChunk.userID,
        newChunk.encryptedContent,
        newChunk.tx,
        newChunk.version,
      ]
    )
      .then((r) => {
        console.log(r, "saved chunk");
      })
      .catch((e) => {
        console.log(e, "error while saving");
      });
    setEncryptedData(null);
    setDataToEncrypt(null);
    statusIndicatorsAPI.setEncrypting(false);
  }, [encryptedData, currentArcActivitiesAPI.lastChunk, dataToEncrypt]);

  async function updateLocalCache(newActivity: ArcTaskLogType) {
    statusIndicatorsAPI.setEncrypting(true);
    try {
      if (currentArcActivitiesAPI.lastChunk !== null) {
        const previousActivitiesTask = JSON.parse(
          currentArcActivitiesAPI.lastChunk.encryptedContent
        );
        const prevActivities: ArcTaskLogType[] = previousActivitiesTask.tasks;
        if (prevActivities.length + 1 > MaxActivitiesInArcChunk) {
          console.log("make new chunk");
          const newPlainPayload = JSON.stringify({ tasks: [newActivity] });
          currentArcActivitiesAPI.setLastChunk({
            id: newChunkID(),
            userID: activeUserID as string,
            tx: Date.now(),
            version: "0.1.1",
            encryptedContent: newPlainPayload,
          });
          setDataToEncrypt(newPlainPayload);
        } else {
          const newPlainPayload = JSON.stringify({
            tasks: [...prevActivities, newActivity],
          });
          currentArcActivitiesAPI.setLastChunk({
            ...currentArcActivitiesAPI.lastChunk,
            encryptedContent: newPlainPayload,
          });
          setDataToEncrypt(newPlainPayload);
          console.log("update existing chunk");
        }
      } else {
        console.log("make new chunk [null case]");
        const newPlainPayload = JSON.stringify({ tasks: [newActivity] });
        currentArcActivitiesAPI.setLastChunk({
          id: newChunkID(),
          userID: activeUserID as string,
          tx: Date.now(),
          version: "0.1.1",
          encryptedContent: newPlainPayload,
        });
        setDataToEncrypt(newPlainPayload);
      }
    } catch (e) {
      console.log(e, "error");
    }
  }

  return (
    <RBox width="100%" height="100%" top={0} left={0}>
      {dataToEncrypt !== null && (
        <SingleEncrypt
          plainText={dataToEncrypt}
          onEncrypted={(e) => {
            setEncryptedData(e);
          }}
          onError={(e) => {
            console.log(e);
          }}
          symsk={SecureStore.getItem(`${activeUserID}-symsk`)}
        ></SingleEncrypt>
      )}
      <RBox
        backgroundColor={globalStyle.color + "10"}
        figmaImportConfig={widgetContainerConfig}
        figmaImport={{
          mobile: {
            width: timeTrackingContainerConfig.containerWidth,
            height: timeTrackingContainerConfig.containerHeight,
            top: 398,
            left: 3,
          },
        }}
      >
        <RLabel
          align="left"
          text="Current Activity"
          figmaImportConfig={timeTrackingContainerConfig}
          figmaImport={{
            mobile: { top: 10, left: 5, width: "40%", height: 16 },
          }}
          fontSize={12}
          color={globalStyle.textColorAccent}
        ></RLabel>
        {currentActivities.length === 0 || currentDisplayedActivity === null ? (
          <Animated.View
            style={styles.defaultStyle}
            entering={FadeInDown.duration(50).damping(15)}
          >
            <RButton
              figmaImportConfig={timeTrackingContainerConfig}
              figmaImport={{
                mobile: { top: 60, left: 5, width: 344, height: 48 },
              }}
              onClick={() => {
                setShowMenu(true);
              }}
              mobileFontSize={20}
              label="Pick an activity"
            ></RButton>

            <RLabel
              width="100%"
              top="69%"
              fontSize={15}
              text="Pick an activity to keep track of time"
              horizontalCenter={true}
            ></RLabel>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(35).damping(10)}
            style={styles.defaultStyle}
          >
            <RButton
              figmaImportConfig={timeTrackingContainerConfig}
              figmaImport={{
                mobile: { top: 109, left: 5, width: 344, height: 48 },
              }}
              onClick={async () => {
                const newActivity = {
                  taskID: currentDisplayedActivity?.taskID as string,
                  start: currentDisplayedActivity.start,
                  end: Date.now(),
                };
                setCurrentActivities((prev) => {
                  if (currentDisplayedActivity === null) return prev;
                  return prev.filter(
                    (elm) => elm.taskID !== currentDisplayedActivity?.taskID
                  );
                });
                currentArcActivitiesAPI.appendCurrentActivities(newActivity);
                updateLocalCache(newActivity);
              }}
              mobileFontSize={20}
              label="Done"
            ></RButton>
            <RLabel
              figmaImport={{
                mobile: { top: 50, left: 191, width: 72, height: 35 },
              }}
              align="right"
              fontSize={globalStyle.mediumMobileFont}
              text="Duration"
              figmaImportConfig={timeTrackingContainerConfig}
            ></RLabel>
            <RBox
              figmaImport={{
                mobile: { top: 70, left: 191, width: 72, height: 35 },
              }}
              figmaImportConfig={timeTrackingContainerConfig}
            >
              {displayDurationLabel !== "" ||
              hasCurrentActivitiesFromUserData === false ? (
                <RLabel
                  width="100%"
                  height="100%"
                  align="right"
                  fontSize={globalStyle.regularMobileFont}
                  text={displayDurationLabel}
                ></RLabel>
              ) : (
                <RBox left="90%" width="10%" top="3%" height="10%">
                  <ActivityIndicator
                    size={"small"}
                    color={globalStyle.color}
                  ></ActivityIndicator>
                </RBox>
              )}
            </RBox>
            <RBox
              figmaImport={{
                mobile: { left: 272, top: 48, height: 39, width: 1 },
              }}
              backgroundColor={globalStyle.color}
              figmaImportConfig={timeTrackingContainerConfig}
            ></RBox>
            <RLabel
              figmaImport={{
                mobile: { top: 50, left: 281, width: 72, height: 35 },
              }}
              align="left"
              fontSize={globalStyle.mediumMobileFont}
              text="Started at"
              figmaImportConfig={timeTrackingContainerConfig}
            ></RLabel>
            <RLabel
              figmaImport={{
                mobile: { top: 70, left: 281, width: 72, height: 35 },
              }}
              align="left"
              fontSize={globalStyle.regularMobileFont}
              text={displayStartedAtLabel}
              figmaImportConfig={timeTrackingContainerConfig}
            ></RLabel>
            <RLabel
              figmaImport={{
                mobile: { top: 54, left: 5, width: 197, height: 35 },
              }}
              align="left"
              fontSize={21}
              text={
                arcFeatureConfig?.tasks?.find(
                  (elm) => currentDisplayedActivity?.taskID === elm.taskID
                )?.name
              }
              figmaImportConfig={timeTrackingContainerConfig}
            ></RLabel>
          </Animated.View>
        )}
        <RButton
          onClick={() => {
            navigation.navigate("activitiesSettingsMain", { name: "activitiesSettingsMain" });
          }}
          figmaImportConfig={timeTrackingContainerConfig}
          figmaImport={{
            mobile: { top: 5, left: 227, width: 59, height: 26 },
          }}
        >
          <EditDeco
            color={globalStyle.color}
            width="100%"
            height="70%"
          ></EditDeco>
        </RButton>
        <RButton
          onClick={() => {
            setShowMenu(true);
          }}
          figmaImportConfig={timeTrackingContainerConfig}
          figmaImport={{
            mobile: { top: 5, left: 290, width: 59, height: 26 },
          }}
        >
          <AddIcon width="60%" height="50%"></AddIcon>
        </RButton>
      </RBox>
      {showMenu ? (
        <RBox style={styles.defaultStyle}>
          <TimeTrackingActivityMenu
            onTaskSelected={(taskID: string) => {
              setCurrentActivities((prev) => {
                return [
                  ...prev,
                  {
                    taskID: taskID,
                    start: Date.now(),
                    end: null,
                  },
                ];
              });
            }}
            onBackButton={() => setShowMenu(false)}
          ></TimeTrackingActivityMenu>
        </RBox>
      ) : (
        <RBox></RBox>
      )}
    </RBox>
  );
}
const styles = StyleSheet.create({
  defaultStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
});
