import { EmptyView } from "@/components/common/EmptyView";
import RFlatList from "@/components/common/RFlatList";
import RLabel from "@/components/common/RLabel";
import { useTessFeatureConfigStore } from "../../DayPlanner/tessFeatureConfigStore";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import RButton from "@/components/common/RButton";
import { TessStatusType } from "@/app/config/commonTypes";
import { LinearGradient } from "react-native-svg";
import { useEffect, useState } from "react";
import { BackHandler } from "react-native";

function DayPlannerStatusSettings({ navigation }) {
  const tessFeatureConfig = useTessFeatureConfigStore().tessFeatureConfig;
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", () => {
  //     if (isEditingStatus) {
  //       setIsEditingStatus(false);
  //       return true;
  //     }
  //     return false;
  //   });
  // }, []);

  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
  const [statusToEdit, setStatusToEdit] = useState<TessStatusType | null>(null);
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
          onClick={() => {
            setIsEditingStatus(true);
            setStatusToEdit(item);
          }}
          androidRippleColor={color + "30"}
          borderColor={color}
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
              left: "0",
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

  return (
    <EmptyView navigation={navigation}>
      <RLabel
        align="left"
        text={`Day Planner / ${
          !isEditingStatus ? "Pick a status to edit" : "Edit Status"
        }`}
        figmaImport={{
          mobile: {
            left: 2,
            width: 280,
            height: 20,
            top: 32,
          },
        }}
      ></RLabel>
      {!isEditingStatus ? (
        <RFlatList
          renderItem={renderItem}
          data={tessFeatureConfig?.statusArray}
          figmaImport={{
            mobile: {
              left: 2,
              width: 356,
              height: 524,
              top: 62,
            },
          }}
        ></RFlatList>
      ) : (
        <></>
      )}
    </EmptyView>
  );
}

export { DayPlannerStatusSettings };
