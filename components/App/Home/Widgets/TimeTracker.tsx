import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import RBox from "@/components/common/RBox";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import RLabel from "@/components/common/RLabel";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, Easing, FadeIn } from "react-native-reanimated";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import { ARCLogo } from "@/components/common/deco/ARCLogo";
import store from "@/app/store";
import {
  getVal,
  globalEnteringConfig,
} from "@/app/config/defaultTransitionConfig";
import { widgetContainerConfig } from "../widgetContainerConfig";
import { localStorageGet } from "@/fn/localStorage";
import { useSQLiteContext } from "expo-sqlite";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import RButton from "@/components/common/RButton";
import { BlurView } from "expo-blur";
import TimeTrackingActivityMenu from "./TimeTrackerActivityMenu";
import { updateArcFeatureConfig } from "@/hooks/arcFeatureConfig";
import { FeatureConfigArcType } from "@/app/config/commonTypes";
import { getCurrentActivities } from "@/fn/dbUtils/getCurrentActivities";
import { displayTimeFromMsDuration } from "@/fn/timeUtils/displayTimeFromMsDuration";
import { timeOfDayFromUnix } from "@/fn/timeUtils/timeOfDayFromUnix";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { MaxActivitiesInArcChunk } from "@/app/config/chunking";
import { useStore } from "@/stores/arcChunks";
import { newChunkID } from "@/fn/newChunkID";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { randomUUID } from "expo-crypto";
import { useCurrentArcChunkStore } from "@/stores/currentArcChunk";

export default function TimeTracker() {
  store.subscribe(() => {});

  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const activeUserID = useLocalUserIDsStore((store) => store.getActiveUserID());
  const arcFeatureConfig: FeatureConfigArcType = useArcFeatureConfigStore(
    (store) => store.arcFeatureConfig
  );
  const addChunkToArcChunks = useStore((state) => state.addChunkToArcChunks);
  const [displayDurationLabel, setDisplayDurationLabel] = useState("");
  const [displayStartedAtLabel, setDisplayStartedAtLabel] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [tickerInterval, setTickerInterval] = useState<null | any>(null);
  const currentActivities = useArcCurrentActivitiesStore(
    (store) => store.currentActivities
  );
  const arcCurrentActivities = useArcCurrentActivitiesStore(
    (store) => store.currentActivities
  );
  const arcHasIniCurrentActivities = useArcCurrentActivitiesStore(
    (store) => store.ini
  );

  const setArcCurrentActivitiesIni = useArcCurrentActivitiesStore(
    (store) => store.setIni
  );
  const [currentDisplayedActivity, setCurrentDisplayedActivity] =
    useState<null | { taskID: string; tx: number }>(null);
  const timeTrackingContainerConfig = {
    containerHeight: 163,
    containerWidth: 354,
  };
  const db = useSQLiteContext();

  const ARC_ChunksBuffer = useStore((state) => state.arcChunks);
  const addActivityToArcChunk = useStore(
    (state) => state.addActivityToArcChunk
  );
  const currentArcChunkAPI = useCurrentArcChunkStore();
  useEffect(() => {
    if (currentDisplayedActivity !== null) {
      setDisplayStartedAtLabel(timeOfDayFromUnix(currentDisplayedActivity.tx));
      if (tickerInterval !== null) {
        clearInterval(tickerInterval);
      }
      setTickerInterval(
        setInterval(() => {
          const delta = Date.now() - currentDisplayedActivity.tx;
          setDisplayDurationLabel(displayTimeFromMsDuration(delta));
        }, 150)
      );
    }
  }, [currentDisplayedActivity]);


  useEffect(() => {
    console.log(currentArcChunkAPI.chunk?.activities)
  }, [currentArcChunkAPI])

  useEffect(() => {
    if (arcHasIniCurrentActivities === false) {
      getCurrentActivities().then((activities) => {
        setArcCurrentActivitiesIni(true);
      });
    } else {
      if (arcCurrentActivities !== null && arcCurrentActivities.length > 0) {
        setCurrentDisplayedActivity(arcCurrentActivities[0]);
      }
      db.runAsync(
        `INSERT OR REPLACE INTO userData (value, userID, key, id, version) VALUES (?, ?, ?, ?, ?)`,
        [
          JSON.stringify(arcCurrentActivities),
          activeUserID,
          "currentActivities",
          randomUUID(),
          "0.1.1",
        ]
      )
        .then(() => {
          console.log("updated current activities");
        })
        .catch((e) => {});
    }
  }, [arcCurrentActivities]);

  useEffect(() => {
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);

  return (
    <RBox width="100%" height="100%" top={0} left={0}>
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
        {arcCurrentActivities === null || arcCurrentActivities.length === 0 ? (
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
              onClick={() => {

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
              {displayDurationLabel !== "" ? (
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
          figmaImportConfig={timeTrackingContainerConfig}
          figmaImport={{
            mobile: { top: 5, left: 227, width: 59, height: 26 },
          }}
        ></RButton>
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
            onTriggerRerender={() => {}}
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
