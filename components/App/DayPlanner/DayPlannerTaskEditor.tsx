import { TessStatusDeco } from "@/components/common/deco/TessStatusDeco";
import { EmptyView } from "@/components/common/EmptyView";
import RBox from "@/components/common/RBox";
import RFlatList from "@/components/common/RFlatList";
import RLabel from "@/components/common/RLabel";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useTessFeatureConfigStore } from "./tessFeatureConfigStore";
import { TessTagsDeco } from "@/components/common/deco/TessTagsDeco";
import { TessDayClassifierDeco } from "@/components/common/deco/TessDayClassifierDeco";
import RButton from "@/components/common/RButton";
import { useActiveDayStore } from "./activeDayStore";
import RTextInput from "@/components/common/RTextInput";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";

function DayPlannerTaskEditor({ navigation }) {
  const activeDayAPI = useActiveDayStore();

  const [newName, setNewName] = useState(activeDayAPI.selectedTask?.name);
  const [newDescription, setNewDescription] = useState(
    activeDayAPI.selectedTask?.description
  );

  const [statusLabel, setStatusLabel] = React.useState("No Status");
  const [statusColors, setStatusColors] = React.useState("#000000");
  const tessFeatureConfig = useTessFeatureConfigStore(
    (store) => store.tessFeatureConfig
  );
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  useEffect(() => {
    const status = tessFeatureConfig?.statusArray.find(
      (status) => status.statusID === activeDayAPI.selectedTask?.statusID
    );
    setStatusLabel(status?.name || "No Status");
    setStatusColors(
      status?.colors[globalStyle.theme]?.color || globalStyle.color
    );
  }, [activeDayAPI.selectedTask]);

  return activeDayAPI.selectedTask !== null ? (
    <EmptyView navigation={navigation} showMenu={false}>
      <RLabel
        align="left"
        text="Day Planner / Edit Task"
        figmaImport={{
          mobile: {
            left: 2,
            width: 220,
            height: 20,
            top: 32,
          },
        }}
      ></RLabel>
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
        align="left"
        borderColor={statusColors}
        color={statusColors}
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
        defaultValue={activeDayAPI.selectedTask?.name}
        figmaImport={{
          mobile: {
            left: 2,
            width: 356,
            top: 242,
            height: 93,
          },
        }}
      ></RTextInput>
      <RButton
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
