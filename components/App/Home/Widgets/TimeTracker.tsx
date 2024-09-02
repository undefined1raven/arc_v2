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
import { useGlobalStyleStore } from "@/stores/globalStyles";
import RButton from "@/components/common/RButton";
import TimeTrackingActivityMenu from "./TimeTrackerActivityMenu";
import { ArcTaskLogType, FeatureConfigArcType } from "@/app/config/commonTypes";
import { getCurrentActivities } from "@/fn/dbUtils/getCurrentActivities";
import { displayTimeFromMsDuration } from "@/fn/timeUtils/displayTimeFromMsDuration";
import { timeOfDayFromUnix } from "@/fn/timeUtils/timeOfDayFromUnix";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { useStore } from "@/stores/arcChunks";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { randomUUID } from "expo-crypto";
import { useCurrentArcChunkStore } from "@/stores/currentArcChunk";

export default function TimeTracker() {
  store.subscribe(() => {});

  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const activeUserID = useLocalUserIDsStore((store) => store.getActiveUserID());
  const arcFeatureConfig: FeatureConfigArcType = useArcFeatureConfigStore(
    (store) => store.arcFeatureConfig
  );
  const [displayDurationLabel, setDisplayDurationLabel] = useState("");
  const [displayStartedAtLabel, setDisplayStartedAtLabel] = useState("");
  const [showMenu, setShowMenu] = useState(false);
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

  const currentArcChunkAPI = useCurrentArcChunkStore();

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
    if (hasCurrentActivitiesFromUserData === false) {
      getCurrentActivities().then((retrievedActivities) => {
        setHasCurrentActivitiesFromUserData(true);
        setCurrentActivities(retrievedActivities);
      });
    }
    if (currentDisplayedActivity === null || currentActivities.length > 0) {
      setCurrentDisplayedActivity(
        currentActivities[currentActivities.length - 1]
      );
    }
    if (currentActivities.length === 0) {
      setCurrentDisplayedActivity(null);
    }
    if (hasCurrentActivitiesFromUserData === true) {
      mutateCurrentActivities(currentActivities);
    }
  }, [currentActivities, hasCurrentActivitiesFromUserData]);

  useEffect(() => {
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);

  function mutateCurrentActivities(value: ArcTaskLogType[]) {
    if (value === undefined) return;
    if (value === null) return;
    db.runAsync(
      `INSERT OR REPLACE INTO userData (value, key, userID, id, version) VALUES (?, ?, ?, ?, ?) `,
      [
        JSON.stringify(value),
        "currentActivities",
        activeUserID,
        randomUUID(),
        "0.1.1",
      ]
    ).catch((e) => {});
  }

  const currentChunkAPI = useCurrentArcChunkStore();

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
              onClick={() => {
                currentChunkAPI.appendActivity({
                  taskID: currentDisplayedActivity?.taskID as string,
                  start: Date.now(),
                  end: Date.now(),
                });
                setCurrentActivities((prev) => {
                  if (currentDisplayedActivity === null) return prev;
                  return prev.filter(
                    (elm) => elm.taskID !== currentDisplayedActivity?.taskID
                  );
                });
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
