import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import RBox from "@/components/common/RBox";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import RLabel from "@/components/common/RLabel";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, Easing } from "react-native-reanimated";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import store from "@/app/store";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { FeatureConfigArcType } from "@/app/config/commonTypes";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import LoadingScreen from "@/components/common/LoadingScreen";
import { ARCLogo } from "@/components/common/deco/ARCLogo";
import { LinearGradient } from "react-native-svg";
import { EmptyView } from "@/components/common/EmptyView";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { TimeStatsIcon } from "@/components/common/deco/TimeStatsIcon";
import { DayPlannerIcon } from "@/components/common/deco/DayPlannerIcon";
import { PersonalDiaryIcon } from "@/components/common/deco/PersonalDiaryIcon";
import { SettingdIcon } from "@/components/common/deco/SettingsIcon";
import { HomeIcon } from "@/components/common/deco/HomeIcon";
import { QuestionIcon } from "@/components/common/deco/QuestionIcon";
import RFlatList from "@/components/common/RFlatList";
import RButton from "@/components/common/RButton";

export default function SettingsMainMenu({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  type SettingsMenuButtonType = {
    id: string;
    label: string;
    icon: React.FC;
    screenName: string;
    description?: string;
  };

  const settingsMenuItems: SettingsMenuButtonType[] = [
    {
      id: "activities",
      label: "Activities and categories",
      description: "Add, remove and categorize your activities",
      icon: TimeStatsIcon,
      screenName: "timeStats",
    },
    {
      id: "dayPlanner",
      label: "Customize Day Planner",
      description: "Change colors, add task categories",
      icon: DayPlannerIcon,
      screenName: "dayPlanner",
    },
    {
      id: "diary",
      label: "Personal Diary Settings",
      description: "Enable features, access control",
      icon: PersonalDiaryIcon,
      screenName: "diaryMain",
    },
    {
      id: "account",
      label: "Account Settings",
      description: "Theme, Security, and General Settings",
      icon: SettingdIcon,
      screenName: "settingsCommonMenu",
    },
  ];

  const renderItem = ({ item, index }: { item: SettingsMenuButtonType }) => {
    return (
      <Animated.View
        entering={FadeInDown.duration(25)
          .damping(30)
          .delay(indexAnimationDelay * index)}
        style={{
          position: "relative",
          paddingBottom: "3%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 130,
        }}
      >
        <RButton
          onClick={() => {
            if (navigation !== null) {
              navigation.navigate(item.screenName, {
                name: item.screenName,
              });
            }
          }}
          width="100%"
          height="100%"
          verticalAlign="center"
        >
          <RBox width="15%" height="100%">
            {React.createElement(item.icon)}
          </RBox>
          <RLabel
            align="left"
            width="70%"
            left="15%"
            top="25%"
            height="30%"
            verticalAlign="center"
            text={item.label}
          ></RLabel>
          <RLabel
            fontSize={globalStyle.smallMobileFont}
            align="left"
            width="70%"
            left="15%"
            top="55%"
            height="30%"
            verticalAlign="top"
            text={item.description}
          ></RLabel>
        </RButton>
      </Animated.View>
    );
  };

  return (
    <EmptyView showHeader={true} showMenu={true} navigation={navigation}>
      <RLabel
        align="left"
        verticalAlign="center"
        backgroundColor={globalStyle.color + "20"}
        text="Config / Settings"
        figmaImport={{
          mobile: {
            top: 28,
            left: 5,
            width: 350,
            height: 38,
          },
        }}
      ></RLabel>
      <RFlatList
        data={settingsMenuItems}
        renderItem={renderItem}
        figmaImport={{
          mobile: {
            top: 70,
            left: 5,
            width: 350,
            height: 482,
          },
        }}
      ></RFlatList>
    </EmptyView>
  );
}
