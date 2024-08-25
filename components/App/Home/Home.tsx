import {
  Image,
  StyleSheet,
  Platform,
  View,
  useWindowDimensions,
  Button,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { BlurView } from "expo-blur";
import { reloadAppAsync } from "expo";
import * as SecureStore from "expo-secure-store";
import React, {
  Component,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
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

import { useSQLiteContext } from "expo-sqlite";
import { FeatureConfigType, UserData } from "@/app/config/commonTypes";
import { Dimensions } from "react-native";
import { Header } from "./Header";
import ActivitiesSettingsMain from "../Settings/Activities/ActivitiesSettingsMain";
import TimeTracker from "./Widgets/TimeTracker";
import MenuMain from "@/components/common/menu/MenuMain";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";

type HomeProps = { onRequestUserIDs: Function };
export default function Home({ navigation, onRequestUserIDs }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  
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
      </Animated.View>
    </View>
  );
}
