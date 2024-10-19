import { AddIcon } from "@/components/common/deco/AddIcon";
import { DayPlannerIcon } from "@/components/common/deco/DayPlannerIcon";
import { EditDeco } from "@/components/common/deco/EditDeco";
import { StatsDeco } from "@/components/common/deco/StatsDeco";
import { EmptyView } from "@/components/common/EmptyView";
import QuickNavMain from "@/components/common/QuickNav/QuickNavMain";
import RBox from "@/components/common/RBox";
import RButton from "@/components/common/RButton";
import RLabel from "@/components/common/RLabel";
import { useTessFeatureConfigStore } from "./tessFeatureConfigStore";
import { ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useDayPlannerStore } from "./daysStore";
import {
  Tess_ChunksType,
  TessDayLogType,
  TessTaskType,
} from "@/app/config/commonTypes";
import { newChunkID } from "@/fn/newChunkID";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { symmetricEncrypt } from "../encryptors/symmetricEncrypt";
import { randomUUID } from "expo-crypto";
import { useSQLiteContext } from "expo-sqlite";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";
import { useActiveDayStore } from "./activeDayStore";
import { DayPlannerLoadingScreen } from "./DayPlannerLoadingScreen";
import Animated, { FadeInDown } from "react-native-reanimated";
import RFlatList from "@/components/common/RFlatList";
import { ColorValueHex } from "@/components/common/CommonTypes";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { LinearGradient } from "expo-linear-gradient";


function DayPlannerActiveDayView({ navigation }) {
  const tessFeatureConfig = useTessFeatureConfigStore(
    (store) => store.tessFeatureConfig
  );
  const db = useSQLiteContext();
  const activeDayAPI = useActiveDayStore();
  const activeUserID = useLocalUserIDsStore((store) => store.getActiveUserID());
  const dayPlannerAPI = useDayPlannerStore();
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  useEffect(() => {
    console.log(activeDayAPI.activeDay, "AXSO");
  }, [dayPlannerAPI.lastChunk, activeDayAPI.activeDay]);

  const renderItem = ({ item, index }: { item: TessTaskType }) => {
    const currentStatus = tessFeatureConfig?.statusArray.find(
      (status) => status.statusID === item.statusID
    );
    const statusLabel = currentStatus?.name || "No Status";
    const statusColors = {
      textColor:
        currentStatus?.colors[globalStyle.theme]?.textColor ||
        globalStyle.textColor,
      color:
        currentStatus?.colors[globalStyle.theme]?.color || globalStyle.color,
    };
    return (
      <Animated.View
        entering={FadeInDown.duration(75)
          .damping(30)
          .delay(indexAnimationDelay * index)}
        style={{
          position: "relative",
          paddingBottom: "3%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 80,
        }}
      >
        <RButton
          borderColor={statusColors.color}
          onClick={() => {
            activeDayAPI.setSelectedTask(item);
            navigation.navigate("dayPlannerTaskEditor");
          }}
          width="100%"
          height="100%"
          style={{ overflow: "hidden" }}
          verticalAlign="center"
        >
          <LinearGradient
            colors={[statusColors.color + "10", statusColors.color + "40"]}
            style={{
              transform: "rotate(-90deg)",
              width: "50%",
              height: "800%",
              top: "0",
              left: 0,
            }}
          ></LinearGradient>
          <RLabel
            color={statusColors.textColor}
            align="left"
            width="70%"
            left="1%"
            fontSize={globalStyle.mediumMobileFont}
            height="100%"
            verticalAlign="center"
            text={item.name}
          ></RLabel>
          <RLabel
            width="30%"
            left="68%"
            top="25%"
            height="50%"
            color={statusColors.textColor}
            fontSize={globalStyle.mediumMobileFont}
            backgroundColor={(statusColors.color + "20") as ColorValueHex}
            verticalAlign="center"
            text={statusLabel}
          ></RLabel>
        </RButton>
      </Animated.View>
    );
  };

  return tessFeatureConfig !== null &&
    dayPlannerAPI.hasLoadedData === true &&
    dayPlannerAPI.days !== null ? (
    <EmptyView navigation={navigation} showMenu={false}>
      <RLabel
        align="left"
        figmaImport={{
          mobile: {
            left: 2,
            width: 180,
            height: 20,
            top: 32,
          },
        }}
        text="Day Planner / Today"
      ></RLabel>
      <RButton
        figmaImport={{ mobile: { left: 277, width: 81, height: 26, top: 29 } }}
      >
        <RLabel
          text="End Day"
          width="100%"
          height="100%"
          fontSize={globalStyle.mediumMobileFont}
          verticalAlign="center"
        ></RLabel>
      </RButton>
      <RButton
        onClick={() => {
          navigation.navigate("dayPlannerSettings");
        }}
        figmaImport={{ mobile: { left: 213, width: 59, height: 26, top: 29 } }}
      >
        <RBox width="100%" height="100%">
          <EditDeco width="75%"></EditDeco>
        </RBox>
      </RButton>

      <RFlatList
        renderItem={renderItem}
        data={activeDayAPI.activeDay?.tasks}
        figmaImport={{ mobile: { top: 66, left: 2, width: 356, height: 521 } }}
      ></RFlatList>

      <RBox
        figmaImport={{
          mobile: { left: 2, width: 356, height: 48, top: 589 },
        }}
      >
        <Animated.View
          entering={FadeInDown.duration(150).damping(15)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <RButton
            figmaImportConfig={{ containerHeight: 48, containerWidth: 356 }}
            figmaImport={{
              mobile: { left: 183, width: 174, height: 48, top: "0" },
            }}
          >
            <RLabel
              text="Save"
              width="80%"
              height="100%"
              left="2%"
              align="left"
              verticalAlign="center"
            ></RLabel>
            <RBox width="50%" height="100%" left="60%">
              <ArrowDeco width="50%" height="70%"></ArrowDeco>
            </RBox>
          </RButton>
          <RButton
            onClick={() => {
              const newTask: TessTaskType = {
                TTID: randomUUID(),
                statusID: "SID-000000-0000-0000-000004",
                labels: [],
                description: "",
                name: "New Task " + Date.now().toString().slice(-4),
                doRemind: false,
                start: Date.now(),
                end: Date.now(),
                deleted: false,
                version: "0.1.0",
              };
              activeDayAPI.setActiveDay({
                ...activeDayAPI.activeDay,
                tasks: activeDayAPI.activeDay.tasks.concat([newTask]),
              });
            }}
            figmaImportConfig={{ containerHeight: 48, containerWidth: 356 }}
            figmaImport={{
              mobile: { left: 2, width: 174, height: 48, top: "0" },
            }}
          >
            <RLabel
              text="Add Task"
              width="58%"
              height="100%"
              left="40%"
              align="right"
              verticalAlign="center"
            ></RLabel>
            <RBox
              width="42%"
              height="100%"
              style={{ transform: "rotate(180deg)" }}
              left="0%"
            >
              <AddIcon
                style={{ left: "25%" }}
                width="60%"
                height="40%"
              ></AddIcon>
            </RBox>
          </RButton>
        </Animated.View>
      </RBox>
    </EmptyView>
  ) : (
    <DayPlannerLoadingScreen navigation={navigation}></DayPlannerLoadingScreen>
  );
}

export { DayPlannerActiveDayView };
