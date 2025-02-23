import { View, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import RBox from "@/components/common/RBox";
import { LinearGradient } from "expo-linear-gradient";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, Easing } from "react-native-reanimated";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { Header } from "./Header";
import TimeTracker from "./Widgets/TimeTracker";
import MenuMain from "@/components/common/menu/MenuMain";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import QuickNavMain from "@/components/common/QuickNav/QuickNavMain";
import MenuList from "@/components/common/menu/MenuList";
import { symmetricDecrypt } from "../decryptors/symmetricDecrypt";
import { symmetricEncrypt } from "../encryptors/symmetricEncrypt";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { CryptoMain } from "../CryptoMain";
import { ActivitiesDeriver } from "../logic/ActivitiesDeriver";
import { ArcFeatureConfigWatcher } from "../stateWatchers/ArcFeatureConfigWather";
import { useHasLoadedUserDataStore } from "./hasLoadedUserData";
import DayBreakdown from "./Widgets/DayBreakdown";
import { BridgeServer } from "react-native-http-bridge-refurbished";
import { ColorPicker, TriangleColorPicker } from "react-native-color-picker";
import { randomUUID } from "expo-crypto";

type HomeProps = { onRequestUserIDs: Function };
export default function Home({ navigation, onRequestUserIDs }) {
  const currentActivitiesAPI = useArcCurrentActivitiesStore();
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const hasLoadedUserDataAPI = useHasLoadedUserDataStore();

  useEffect(() => {
    setTimeout(() => {
      hasLoadedUserDataAPI.setHasLoadedUserData(true);
    }, 2000);
  }, []);

  return (
    <View
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
      <Animated.View
        entering={globalEnteringConfig()}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Header show={true}></Header>

        <RBox
          id="widgetContainer"
          figmaImport={{
            mobile: { top: 22, left: "0", width: "100%", height: 618 },
          }}
        >
          <TimeTracker navigation={navigation}></TimeTracker>
          <DayBreakdown navigation={navigation}></DayBreakdown>
        </RBox>
        <MenuMain></MenuMain>
        <QuickNavMain
          navMenuItems={[
            {
              buttonID: "cancel",
              label: "Personal Diary",
              onClick: () => {
                navigation.navigate("diaryMain", { name: "diaryMain" });
              },
            },
            {
              buttonID: "hide2",
              label: "Day Planner",
              onClick: () => {
                navigation.navigate("dayPlanner", { name: "dayPlanner" });
              },
            },
            {
              buttonID: "timeStats",
              label: "Time Stats",
              onClick: () => {
                navigation.navigate("timeStats", { name: "timeStats" });
              },
            },
          ]}
        ></QuickNavMain>
      </Animated.View>
      <ActivitiesDeriver></ActivitiesDeriver>
      <ArcFeatureConfigWatcher></ArcFeatureConfigWatcher>
      <MenuList></MenuList>
    </View>
  );
}
