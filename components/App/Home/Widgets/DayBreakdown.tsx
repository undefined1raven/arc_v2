import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import RBox from "@/components/common/RBox";
import RLabel from "@/components/common/RLabel";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, {
  FadeInDown,
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInUp,
} from "react-native-reanimated";
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
import { useRequestFullSpace } from "./requestFullSpace";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { MaxActivitiesInArcChunk } from "@/app/config/chunking";
import { symmetricEncrypt } from "../../encryptors/symmetricEncrypt";
import { newChunkID } from "@/fn/newChunkID";
import { symmetricDecrypt } from "../../decryptors/symmetricDecrypt";
import useEncryptionStore from "../../encryptors/encryptionStore";
import { SingleEncrypt } from "@/components/common/crypto/SingleEncrypt";
import useStatusIndicatorsStore from "@/stores/statusIndicators";
import { EditDeco } from "@/components/common/deco/EditDeco";
import { useHasLoadedUserDataStore } from "../hasLoadedUserData";
import RFlatList from "@/components/common/RFlatList";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { transform } from "@babel/core";

export default function DayBreakdown({ navigation }) {
  store.subscribe(() => {});
  const encryptionAPI = useEncryptionStore();
  const statusIndicatorsAPI = useStatusIndicatorsStore();
  const currentArcActivitiesAPI = useArcCurrentActivitiesStore();
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const activeUserID = useLocalUserIDsStore().getActiveUserID();
  const requestFullSpaceAPI = useRequestFullSpace();
  const arcFeatureConfig: FeatureConfigArcType = useArcFeatureConfigStore(
    (store) => store.arcFeatureConfig
  );
  const timeTrackingContainerConfig = {
    containerHeight: 163,
    containerWidth: 354,
  };

  const renderItem = ({ item, index }: { item: { name: string } }) => {
    return (
      <Animated.View
        key={item.label}
        entering={FadeInDown.duration(75)
          .damping(30)
          .delay(indexAnimationDelay * index)}
        style={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 50,
        }}
      >
        <RBox width="100%" height="100%">
          <RLabel
            text={item.label}
            fontSize={globalStyle.mediumMobileFont}
            align="left"
            width="50%"
            height="100%"
            verticalAlign="center"
          ></RLabel>
          <RLabel
            text={item.percentage + "%"}
            fontSize={globalStyle.mediumMobileFont}
            align="right"
            width="15%"
            left="50%"
            height="100%"
            verticalAlign="center"
          ></RLabel>
          <RBox
            width={"34.5%"}
            height={3}
            top="49.5%"
            backgroundColor={globalStyle.colorInactive}
            left="65.5%"
          >
            <Animated.View
              entering={FadeInLeft.withInitialValues({
                scaleX: 0,
                left: -10,
              })
                .duration(150)
                .delay(index * 50)}
              style={{ width: "100%", height: "100%", top: 0, left: 0 }}
            >
              <RBox
                width={`${item.percentage}%`}
                left="0%"
                height="100%"
                top={0}
                backgroundColor={globalStyle.color}
              ></RBox>
            </Animated.View>
          </RBox>
          <RBox
            height={1}
            width="100%"
            top="99%"
            backgroundColor={globalStyle.color}
          ></RBox>
        </RBox>
      </Animated.View>
    );
  };

  const db = useSQLiteContext();
  const [data, setData] = useState<{ label: string; percentage: number }[]>([]);
  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 1);
    const milliesInADay = 86400000;
    const dayMidnightUnix = now.getTime();
    const categoriesDurationMap: { [key: string]: number } = {};
    let relevantActivities = currentArcActivitiesAPI.currentActivities.filter(
      (activity) => {
        return (
          activity.start > dayMidnightUnix ||
          ((activity.end as number) > dayMidnightUnix &&
            activity.start < dayMidnightUnix)
        );
      }
    );

    relevantActivities.sort((a, b) => a.start - b.start);

    const activitiesGoingThroughMidnight = relevantActivities.filter(
      (activity) => {
        return (
          activity.start < dayMidnightUnix &&
          (activity.end as number) > dayMidnightUnix
        );
      }
    );

    for (let ix = 0; ix < activitiesGoingThroughMidnight.length; ix++) {
      const activity = activitiesGoingThroughMidnight[ix];
      const activityID = activity.taskID;
      const timeAfterMidnight = (activity.end as number) - dayMidnightUnix;
      const categoryID =
        arcFeatureConfig.tasks.find((task) => task.taskID === activityID)
          ?.categoryID || "Uncategorized";

      if (!categoriesDurationMap[categoryID]) {
        categoriesDurationMap[categoryID] = 0;
      }

      categoriesDurationMap[categoryID] += timeAfterMidnight;
    }

    relevantActivities = relevantActivities.filter((activities) => {
      return !activitiesGoingThroughMidnight.includes(activities);
    });

    for (let ix = 0; ix < relevantActivities.length; ix++) {
      const activity = relevantActivities[ix];
      const activityID = activity.taskID;
      const categoryID =
        arcFeatureConfig.tasks.find((task) => task.taskID === activityID)
          ?.categoryID || "Uncategorized";

      if (!categoriesDurationMap[categoryID]) {
        categoriesDurationMap[categoryID] = 0;
      }

      categoriesDurationMap[categoryID] +=
        (activity.end as number) - activity.start;
    }

    const data = [];
    for (const key in categoriesDurationMap) {
      const catName =
        arcFeatureConfig.taskCategories.find((cat) => cat.categoryID === key)
          ?.name || "Uncategorized";
      const percantageOfDay = parseFloat(
        ((categoriesDurationMap[key] / milliesInADay) * 100).toFixed(2)
      );
      data.push({ label: catName, percentage: percantageOfDay });
    }
    data.push({
      label: "Time left today",
      percentage: parseInt(
        (100 - data.reduce((acc, val) => acc + val.percentage, 0)).toFixed(0)
      ),
    });

    setData(data.sort((a, b) => b.percentage - a.percentage));
  }, [currentArcActivitiesAPI.currentActivities, arcFeatureConfig]);

  return (
    requestFullSpaceAPI.requestFullSpace === false && (
      <RBox
        backgroundColor={globalStyle.color + "10"}
        figmaImport={{
          mobile: {
            top: 245,
            left: 3,
            width: 354,
            height: 163,
          },
        }}
      >
        <RLabel
          color={globalStyle.textColorAccent}
          width="100%"
          fontSize={globalStyle.smallMobileFont}
          align="left"
          alignPadding="2%"
          text="Day Breakdown"
        ></RLabel>
        <RFlatList
          renderItem={renderItem}
          data={data}
          width={"98%"}
          height={"91%"}
          top={"7%"}
          left={"1%"}
        ></RFlatList>
      </RBox>
    )
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
