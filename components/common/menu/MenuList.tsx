import {
  Image,
  StyleSheet,
  Platform,
  View,
  useWindowDimensions,
  Button,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { ARCLogo } from "@/components/common/deco/ARCLogo";
import store from "@/app/store";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import {
  MenuOverlayButtons,
  MenuOverlayButtonType,
  useMenuConfigStore,
} from "@/stores/mainMenu";
import { BlurView } from "expo-blur";
import { ColorValueHex } from "../CommonTypes";
import RFlatList from "../RFlatList";
import RButton from "../RButton";
import { TimeStatsIcon } from "../deco/TimeStatsIcon";
import { useNavigatorStore } from "@/hooks/navigator";
export default function MenuList({}) {
  const menuApi = useMenuConfigStore();
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    BackHandler.addEventListener("hardwareBackPress", () => {
      menuApi.setOverlayMenuVisibility(false);
      return true;
    });
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);
  const navigation = useNavigatorStore();
  const renderItem = ({ item, index }: { item: MenuOverlayButtonType }) => {
    return (
      <Animated.View
        entering={FadeInDown.duration(25)
          .damping(30)
          .delay(15 * index)}
        style={{
          position: "relative",
          paddingBottom: "3%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 75,
        }}
      >
        <RButton
          onClick={() => {
            if (navigation !== null) {
              navigation.navigator?.navigate(item.screenName, {
                name: item.screenName,
              });
              menuApi.setOverlayMenuVisibility(false);
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
            height="100%"
            verticalAlign="center"
            text={item.label}
          ></RLabel>
        </RButton>
      </Animated.View>
    );
  };

  return menuApi.menuOverlayConfig.visible === true ? (
    <View
      style={{
        position: "absolute",
        top: 0,
        opacity: 0.98,
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
          top: 35,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {hasMounted ? (
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
          <RBox
            figmaImport={{
              mobile: { top: 230, left: 15, width: 329, height: 339 },
            }}
          >
            <RFlatList
              inverted={true}
              data={menuApi.menuOverlayConfig.buttons}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              width="100%"
              height="100%"
              renderItem={renderItem}
              top="0%"
              left="0%"
            ></RFlatList>
          </RBox>
          <RButton
            onClick={() => {
              menuApi.setOverlayMenuVisibility(false);
            }}
            label="Back"
            figmaImport={{
              mobile: { top: 578, left: 15, width: 329, height: 48 },
            }}
          ></RButton>
        </Animated.View>
      ) : (
        <RBox></RBox>
      )}
    </View>
  ) : (
    <></>
  );
}
