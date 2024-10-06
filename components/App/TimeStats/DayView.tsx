import MenuList from "@/components/common/menu/MenuList";
import MenuMain from "@/components/common/menu/MenuMain";
import RBox from "@/components/common/RBox";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, { FadeInRight, FadeInUp } from "react-native-reanimated";
import { ActivityIndicator, BackHandler, View } from "react-native";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useMenuConfigStore } from "@/stores/mainMenu";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { Header } from "../Home/Header";
import RLabel from "@/components/common/RLabel";
import { useTimeStatsStore } from "./selectedTimeRange";
import { itemTextToLabel } from "./fn/DayToLabel";
import RButton from "@/components/common/RButton";
import RFlatList from "@/components/common/RFlatList";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { ArcTaskLogType, FeatureConfigArcType } from "@/app/config/commonTypes";
import { timeOfDayFromUnix } from "@/fn/timeUtils/timeOfDayFromUnix";
import { durationToLabel } from "@/fn/timeUtils/durationToLabel";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { emptyRenderItem } from "@/components/common/EmptyListItem";

/**
 * DayView component renders the main view for displaying time statistics for a selected day.
 * It utilizes various hooks to manage global styles, menu configurations, and time statistics data.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - The component sets the status bar background color on mount.
 * - It conditionally renders an animated view with a label and a box if the component has mounted,
 *   the menu overlay is not visible, and a day is selected.
 * - The component includes a linear gradient background and a header.
 * - It also includes menu components for additional functionality.
 */

function DayView({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const currentActivities = useArcCurrentActivitiesStore();
  const arcFeatureConfig: FeatureConfigArcType = useArcFeatureConfigStore()
    .arcFeatureConfig as FeatureConfigArcType;
  const menuOverlayStatus = useMenuConfigStore();
  const timeStatsAPI = useTimeStatsStore();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.navigate("timeStats", { name: "timeStats" });
      return true;
    });
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);
  const [selectedView, setSelectedView] = useState("activities");
  const taskIDToName = (taskID: string) => {
    return (
      arcFeatureConfig.tasks.find((task) => task.taskID === taskID)?.name ||
      "Unknown"
    );
  };
  const taskIDToCatName = (taskID: string) => {
    const catID = arcFeatureConfig.tasks.find(
      (task) => task.taskID === taskID
    )?.categoryID;
    return (
      arcFeatureConfig.taskCategories.find((cat) => cat.categoryID === catID)
        ?.name || "Unknown"
    );
  };

  const activitiesRenderItem = ({
    item,
    index,
  }: {
    item: ArcTaskLogType;
    index: number;
  }) => {
    return (
      <Animated.View
        entering={FadeInRight.duration(75)
          .damping(30)
          .delay(25 * index)}
        style={{
          position: "relative",
          paddingBottom: "3%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 80,
        }}
      >
        <RBox
          backgroundColor={globalStyle.color + "20"}
          width="100%"
          height="100%"
        >
          <RBox width="60%" height="100%">
            <RLabel
              align="left"
              width="70%"
              left="2%"
              top="10%"
              height="50%"
              verticalAlign="center"
              fontSize={globalStyle.mediumMobileFont}
              text={taskIDToName(item.taskID)}
            ></RLabel>
            <RLabel
              align="left"
              width="70%"
              top="40%"
              left="2%"
              height="50%"
              verticalAlign="center"
              fontSize={globalStyle.smallMobileFont}
              text={taskIDToCatName(item.taskID)}
            ></RLabel>
          </RBox>
          <RBox width="40%" height="100%" left="60%">
            <RLabel
              align="right"
              width="98%"
              left="0%"
              top="10%"
              height="50%"
              verticalAlign="center"
              fontSize={globalStyle.mediumMobileFont}
              text={
                timeOfDayFromUnix(item.start) +
                " - " +
                timeOfDayFromUnix(item.end as number)
              }
            ></RLabel>
            <RLabel
              align="right"
              width="98%"
              top="40%"
              left="0%"
              height="50%"
              verticalAlign="center"
              fontSize={globalStyle.smallMobileFont}
              text={durationToLabel(
                currentActivities.derivedActivities.durationMap[
                  `${item.start}-${item.taskID}`
                ]
              )}
            ></RLabel>
          </RBox>
        </RBox>
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <StatusBar backgroundColor={globalStyle.statusBarColor}></StatusBar>
      <LinearGradient
        colors={globalStyle.pageBackgroundColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 0.7 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <Header show={true}></Header>

      {hasMounted &&
      menuOverlayStatus.menuOverlayConfig.visible === false &&
      timeStatsAPI.selectedDay !== null ? (
        <Animated.View
          entering={globalEnteringConfig(150, 20)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <RLabel
            figmaImport={{
              mobile: { top: 28, left: 3, width: 96, height: 20 },
            }}
            text={itemTextToLabel(timeStatsAPI.selectedDay)}
          ></RLabel>
          <RBox
            backgroundColor={globalStyle.color}
            figmaImport={{
              mobile: { top: 37, left: 107, width: 250, height: 1 },
            }}
          ></RBox>

          <RButton
            borderColor={
              selectedView === "activities"
                ? globalStyle.color
                : globalStyle.colorAccent
            }
            onClick={() => setSelectedView("activities")}
            figmaImport={{
              mobile: { top: 53, left: 3, width: 114, height: 37 },
            }}
          >
            <RLabel
              fontSize={globalStyle.mediumMobileFont}
              color={
                selectedView === "activities"
                  ? globalStyle.textColor
                  : globalStyle.textColorAccent
              }
              top="20%"
              width="100%"
              text="Activities"
            ></RLabel>
            <RBox
              top="75%"
              width="40%"
              left="30%"
              horizontalCenter={true}
              height={2}
              backgroundColor={
                selectedView === "activities"
                  ? globalStyle.color
                  : globalStyle.colorAccent
              }
            ></RBox>
          </RButton>
          <RButton
            borderColor={
              selectedView === "dayBreakdown"
                ? globalStyle.color
                : globalStyle.colorAccent
            }
            onClick={() => setSelectedView("dayBreakdown")}
            figmaImport={{
              mobile: { top: 53, left: 123, width: 114, height: 37 },
            }}
          >
            <RLabel
              fontSize={globalStyle.mediumMobileFont}
              color={
                selectedView === "dayBreakdown"
                  ? globalStyle.textColor
                  : globalStyle.textColorAccent
              }
              top="20%"
              width="100%"
              text="Day Breakdown"
            ></RLabel>
            <RBox
              top="75%"
              width="40%"
              left="30%"
              horizontalCenter={true}
              height={2}
              backgroundColor={
                selectedView === "dayBreakdown"
                  ? globalStyle.color
                  : globalStyle.colorAccent
              }
            ></RBox>
          </RButton>
          <RButton
            borderColor={
              selectedView === "compare"
                ? globalStyle.color
                : globalStyle.colorAccent
            }
            onClick={() => setSelectedView("compare")}
            figmaImport={{
              mobile: { top: 53, left: 243, width: 114, height: 37 },
            }}
          >
            <RLabel
              fontSize={globalStyle.mediumMobileFont}
              color={
                selectedView === "compare"
                  ? globalStyle.textColor
                  : globalStyle.textColorAccent
              }
              top="20%"
              width="100%"
              text="Compare"
            ></RLabel>
            <RBox
              top="75%"
              width="40%"
              left="30%"
              horizontalCenter={true}
              height={2}
              backgroundColor={
                selectedView === "compare"
                  ? globalStyle.color
                  : globalStyle.colorAccent
              }
            ></RBox>
          </RButton>
          <RBox
            figmaImport={{
              mobile: { top: 97, left: 3, width: 354, height: 449 },
            }}
          >
            <RFlatList
              emptyComponent={emptyRenderItem(globalStyle, "No activities")}
              inverted={false}
              data={
                currentActivities.derivedActivities.byDay[
                  timeStatsAPI.selectedDay
                ]
              }
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              width="100%"
              height="100%"
              renderItem={activitiesRenderItem}
              top="0%"
              left="0%"
            ></RFlatList>
          </RBox>
        </Animated.View>
      ) : (
        <RBox></RBox>
      )}
      <MenuMain></MenuMain>
      <MenuList></MenuList>
    </Animated.View>
  );
}

export { DayView };
