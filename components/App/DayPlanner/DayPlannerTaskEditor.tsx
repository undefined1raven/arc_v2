import { TessStatusDeco } from "@/components/common/deco/TessStatusDeco";
import { EmptyView } from "@/components/common/EmptyView";
import RBox from "@/components/common/RBox";
import RFlatList from "@/components/common/RFlatList";
import RLabel from "@/components/common/RLabel";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useTessFeatureConfigStore } from "./tessFeatureConfigStore";
import { TessTagsDeco } from "@/components/common/deco/TessTagsDeco";
import { TessDayClassifierDeco } from "@/components/common/deco/TessDayClassifierDeco";
import RButton from "@/components/common/RButton";
import { useActiveDayStore } from "./activeDayStore";
import RTextInput from "@/components/common/RTextInput";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";
import { TessStatusType, TessTaskType } from "@/app/config/commonTypes";
import { TriangleColorPicker } from "react-native-color-picker";

function DayPlannerTaskEditor({ navigation }) {
  const activeDayAPI = useActiveDayStore();

  const [newName, setNewName] = useState(activeDayAPI.selectedTask?.name);
  const [newDescription, setNewDescription] = useState(
    activeDayAPI.selectedTask?.description
  );

  const [isPickingStatus, setIsPickingStatus] = useState<boolean>(false);
  const [statusLabel, setStatusLabel] = React.useState("No Status");
  const [newTask, setNewTask] = useState<TessTaskType>(
    activeDayAPI.selectedTask as TessTaskType
  );
  const [statusColors, setStatusColors] = React.useState("#000000");
  const [statusTextColor, setStatusTextColor] = React.useState("#000000");
  const availableStatuses =
    useTessFeatureConfigStore().tessFeatureConfig?.statusArray || [];
  const tessFeatureConfig = useTessFeatureConfigStore(
    (store) => store.tessFeatureConfig
  );
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  useEffect(() => {
    const status = tessFeatureConfig?.statusArray.find(
      (status) => status.statusID === newTask.statusID
    );
    setStatusLabel(status?.name || "No Status");
    setStatusTextColor(
      status?.colors[globalStyle.theme]?.textColor || globalStyle.textColor
    );
    setStatusColors(
      status?.colors[globalStyle.theme]?.color || globalStyle.color
    );
  }, [newTask, activeDayAPI]);

  const renderItem = ({ item, index }: { item: TessStatusType }) => {
    const color = item.colors[globalStyle.theme].color;
    const textColor = item.colors[globalStyle.theme].textColor;
    const statusName = item.name;
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
          androidRippleColor={color + "30"}
          borderColor={color}
          onClick={() => {
            const newStatusID = item.statusID;
            const newTask = activeDayAPI.selectedTask as TessTaskType;
            newTask.statusID = newStatusID;
            const taskIndex = activeDayAPI.activeDay?.tasks.findIndex(
              (task) => task.TTID === newTask.TTID
            );
            if (taskIndex !== -1) {
              const newTasks = activeDayAPI.activeDay?.tasks;
              newTasks[taskIndex] = newTask;
              const newActiveDay = activeDayAPI.activeDay;
              newActiveDay.tasks = newTasks;
              activeDayAPI.setActiveDay(newActiveDay);
              setNewTask(newTask);
              setTimeout(() => {
                setIsPickingStatus(false);
              }, 50);
            }
          }}
          width="100%"
          height="100%"
          style={{ overflow: "hidden" }}
          verticalAlign="center"
        >
          <LinearGradient
            colors={[color + "10", color + "80"]}
            style={{
              transform: "rotate(-90deg)",
              width: "50%",
              height: "800%",
              top: "0",
              left: 0,
            }}
          ></LinearGradient>
          <RLabel
            align="left"
            width="100%"
            left="1%"
            top="0%"
            height="100%"
            color={textColor}
            fontSize={globalStyle.mediumMobileFont}
            verticalAlign="center"
            text={statusName}
          ></RLabel>
        </RButton>
      </Animated.View>
    );
  };

  return activeDayAPI.selectedTask !== null ? (
    <EmptyView navigation={navigation} showMenu={false}>
      <RLabel
        align="left"
        text={`Day Planner / Edit Task ${
          isPickingStatus ? " / Pick Status" : ""
        }`}
        figmaImport={{
          mobile: {
            left: 2,
            width: 350,
            height: 20,
            top: 32,
          },
        }}
      ></RLabel>

      {!isPickingStatus && (
        <>
          <RLabel
            backgroundColor={globalStyle.color + "20"}
            figmaImport={{
              mobile: {
                left: 2,
                width: 105,
                height: 39,
                top: 55,
              },
            }}
            align="left"
            fontSize={globalStyle.regularMobileFont}
            alignPadding={8}
            verticalAlign="center"
            text="Name"
          ></RLabel>
          <RTextInput
            align="left"
            fontSize={globalStyle.regularMobileFont}
            alignPadding={"2%"}
            onInput={(e) => {
              setNewName(e);
            }}
            defaultValue={activeDayAPI.selectedTask?.name}
            figmaImport={{
              mobile: {
                left: 112,
                width: 246,
                top: 55,
                height: 39,
              },
            }}
          ></RTextInput>
          <RLabel
            backgroundColor={globalStyle.color + "20"}
            figmaImport={{
              mobile: {
                left: 2,
                width: 105,
                height: 39,
                top: 99,
              },
            }}
            align="left"
            fontSize={globalStyle.regularMobileFont}
            alignPadding={8}
            verticalAlign="center"
            text="Status"
          ></RLabel>
          <RButton
            androidRippleColor={statusColors + "30"}
            style={{ overflow: "hidden" }}
            figmaImport={{
              mobile: {
                left: 112,
                width: 246,
                top: 99,
                height: 39,
              },
            }}
            onClick={() => {
              setIsPickingStatus(true);
            }}
            align="left"
            borderColor={statusColors}
            color={statusTextColor}
            label={statusLabel}
          >
            <LinearGradient
              style={{
                width: "100%",
                height: "550%",
                position: "absolute",
                top: -50,
                left: 0,
                transform: "rotate(-90deg)",
              }}
              colors={[statusColors + "10", statusColors + "60"]}
            ></LinearGradient>
          </RButton>
          <RLabel
            backgroundColor={globalStyle.color + "20"}
            figmaImport={{
              mobile: {
                left: 2,
                width: 356,
                height: 39,
                top: 199,
              },
            }}
            align="left"
            fontSize={globalStyle.regularMobileFont}
            alignPadding={8}
            verticalAlign="center"
            text="Description"
          ></RLabel>
          <RTextInput
            align="left"
            multiline={true}
            textAlignVertical="top"
            fontSize={globalStyle.regularMobileFont}
            alignPadding={"2%"}
            onInput={(e) => {
              setNewDescription(e);
            }}
            defaultValue={activeDayAPI.selectedTask?.description}
            figmaImport={{
              mobile: {
                left: 2,
                width: 356,
                top: 242,
                height: 93,
              },
            }}
          ></RTextInput>
          {/* <RBox top="20%" width="50%" height="20%">
            <Animated.View
              style={{
                top: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <TriangleColorPicker
                oldColor="#000"
                onColorChange={(color) => {
                  console.log(color, "color");
                }}
                style={{ flex: 1 }}
              ></TriangleColorPicker>
            </Animated.View>
          </RBox> */}
          <RButton
            onClick={() => {
              if (
                newName !== activeDayAPI.selectedTask?.name ||
                newDescription !== activeDayAPI.selectedTask?.description
              ) {
                const newTask = activeDayAPI.selectedTask as TessTaskType;
                newTask.name = newName;
                // newTask.description = newDescription;
                const taskIndex = activeDayAPI.activeDay?.tasks.findIndex(
                  (task) => task.TTID === newTask.TTID
                );
                if (taskIndex !== -1) {
                  const newTasks = activeDayAPI.activeDay?.tasks;
                  newTasks[taskIndex] = newTask;
                  const newActiveDay = activeDayAPI.activeDay;
                  newActiveDay.tasks = newTasks;
                  console.log("newActiveDay", newActiveDay);
                  activeDayAPI.setActiveDay(newActiveDay);
                  navigation.goBack();
                }
              } else {
                navigation.goBack();
              }
            }}
            label="Save"
            align="right"
            figmaImport={{
              mobile: {
                left: 2,
                width: 356,
                height: 48,
                top: 589,
              },
            }}
          >
            <RBox
              style={{ transform: "rotate(180deg)" }}
              left="-10%"
              width="40%"
              height="100%"
            >
              <ArrowDeco height="60%"></ArrowDeco>
            </RBox>
          </RButton>
        </>
      )}
      {isPickingStatus && (
        <>
          <RFlatList
            renderItem={renderItem}
            data={availableStatuses}
            figmaImport={{
              mobile: {
                left: 2,
                width: 356,
                height: 528,
                top: 53,
              },
            }}
          ></RFlatList>

          <RButton
            onClick={() => {
              setIsPickingStatus(false);
            }}
            label="Back"
            figmaImport={{
              mobile: {
                top: 589,
                left: 2,
                width: 356,
                height: 48,
              },
            }}
          ></RButton>
        </>
      )}
    </EmptyView>
  ) : (
    <EmptyView navigation={navigation}>
      <RBox width="100%" height="100%">
        <ActivityIndicator color={globalStyle.color}></ActivityIndicator>
      </RBox>
    </EmptyView>
  );
}

export { DayPlannerTaskEditor };
