import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
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
import { activeUserIDType } from "@/hooks/activeUserID";
import RButton from "@/components/common/RButton";
import { BlurView } from "expo-blur";
import TimeTrackingActivityMenu from "./TimeTrackerActivityMenu";
import { updateArcFeatureConfig } from "@/hooks/arcFeatureConfig";
import { FeatureConfigArcType } from "@/app/config/commonTypes";
import { getCurrentActivities } from "@/fn/dbUtils/getCurrentActivities";
import { displayTimeFromMsDuration } from "@/fn/timeUtils/displayTimeFromMsDuration";
import { timeOfDayFromUnix } from "@/fn/timeUtils/timeOfDayFromUnix";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { updateArcChunks } from "@/hooks/arcChunks";
import { MaxActivitiesInArcChunk } from "@/app/config/chunking";
import { useStore } from "@/stores/arcChunks";
import { act } from "react-test-renderer";

export default function TimeTracker({ navigation }) {
  store.subscribe(() => {});
  const globalStyle: GlobalStyleType = useSelector(
    (store) => store.globalStyle
  );
  const activeUserID: activeUserIDType = useSelector(
    (store) => store.activeUserID
  );
  const arcFeatureConfig: FeatureConfigArcType = useSelector(
    (store) => store.arcFeatureConfig
  );
  const arcChunks: FeatureConfigArcType = useSelector(
    (store) => store.arcChunks
  );
  const [hasMounted, setHasMounted] = useState(false);
  const [displayDurationLabel, setDisplayDurationLabel] = useState("");
  const [displayStartedAtLabel, setDisplayStartedAtLabel] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [tickerInterval, setTickerInterval] = useState<null | any>(null);
  const [currentActivities, setCurrentActivities] = useState<
    | null
    | {
        taskID: string;
        tx: number;
      }[]
  >(null);
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
  useEffect(() => {
    getCurrentActivities().then((r) => {
      setCurrentActivities(r);
      if (r !== null && r.length > 0) {
        setCurrentDisplayedActivity(r[0]);
      } else {
        setCurrentDisplayedActivity(null);
      }
    });
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);

  useEffect(() => {
    if (currentDisplayedActivity !== null) {
      setDisplayStartedAtLabel(timeOfDayFromUnix(currentDisplayedActivity.tx));
    }
    if (tickerInterval !== null) {
      clearInterval(tickerInterval);
    }
    setTickerInterval(
      setInterval(() => {
        if (currentDisplayedActivity !== null) {
          setDisplayDurationLabel(
            displayTimeFromMsDuration(Date.now() - currentDisplayedActivity.tx)
          );
        }
      }, 900)
    );
  }, [currentDisplayedActivity]);

  useEffect(() => {
    // if (activeUserID === null) return;
    // console.log(currentActivities, "current activities 2");
    // db.runAsync(`UPDATE userData SET value = ? WHERE key = ? AND userID = ?`, [
    //   JSON.stringify(currentActivities),
    //   "currentActivities",
    //   activeUserID,
    // ]);
  }, [currentActivities]);

  useEffect(() => {
    // setInterval(() => {
    //   db.getFirstAsync(`SELECT * FROM userData WHERE userID = ?, key = "currentActivities"`, [activeUserID]).then((r) => {
    //     console.log(r, "current activities 4");
    //   });
    // }, 1000);
  }, []);

  function mutateCurrentActivities(value?: any) {
    db.runAsync(`UPDATE userData SET value = ? WHERE key = ? AND userID = ?`, [
      JSON.stringify(getVal(value, currentActivities)),
      "currentActivities",
      activeUserID,
    ]);
  }

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
        {currentActivities === null || currentActivities.length === 0 ? (
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
                const sortedBuffer = ARC_ChunksBuffer.sort(
                  (a, b) => b.tx - a.tx
                );
                const lastChunk = sortedBuffer[0];
                if (lastChunk.activities.length < MaxActivitiesInArcChunk) {
                  addActivityToArcChunk(
                    lastChunk.chunkID,
                    currentDisplayedActivity
                  );
                  const updatedCurrentActivities = currentActivities.filter(
                    (elm) => elm !== currentDisplayedActivity
                  );
                  setCurrentActivities(updatedCurrentActivities);
                  if (currentActivities.length > 0) {
                    setCurrentDisplayedActivity(currentActivities[0]);
                    mutateCurrentActivities(updatedCurrentActivities);
                  } else {
                    setCurrentDisplayedActivity(null);
                    setCurrentActivities(null);
                    mutateCurrentActivities(null);
                  }
                }
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
                arcFeatureConfig.tasks.find(
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
            onTriggerRerender={() => {
              getCurrentActivities().then((r) => {
                setCurrentActivities(r);
                if (r !== null) {
                  setCurrentDisplayedActivity(r[0]);
                }
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
