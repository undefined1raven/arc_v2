import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import React, { useContext, useEffect, useState } from "react";
import RButton from "@/components/common/RButton";
import RBox from "@/components/common/RBox";
import { LinearGradient } from "expo-linear-gradient";
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
import { Header } from "./Header";
import TimeTracker from "./Widgets/TimeTracker";
import MenuMain from "@/components/common/menu/MenuMain";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import QuickNavMain from "@/components/common/QuickNav/QuickNavMain";
import { ARCLogo } from "@/components/common/deco/ARCLogo";

type HomeProps = { onRequestUserIDs: Function };
export default function Home({ navigation, onRequestUserIDs }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  const x = 4;
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
          <TimeTracker></TimeTracker>
        </RBox>
        <MenuMain></MenuMain>
        <QuickNavMain
          navMenuItems={[
            {
              buttonID: "cancel",
              label: "x",
              onClick: () => {
                console.log("cancel");
              },
            },
            {
              buttonID: "remove",
              label: "Remove",
              onClick: () => {
                console.log("remove");
              },
            },
            {
              buttonID: "hide",
              label: "Hide",
              onClick: () => {
                console.log("hide");
              },
            },
            {
              buttonID: "hide2",
              label: "Hide2",
              onClick: () => {
                console.log("hide2");
              },
            },
            {
              buttonID: "hide3",
              label: "Hide3",
              onClick: () => {
                console.log("hide3");
              },
            },
          ]}
        ></QuickNavMain>
      </Animated.View>
    </View>
  );
}
