import {
  Image,
  StyleSheet,
  Platform,
  View,
  useWindowDimensions,
  Button,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import RButton from "@/components/common/RButton";
import RBox from "@/components/common/RBox";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import RLabel from "@/components/common/RLabel";
import RTextInput from "@/components/common/RTextInput";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, Easing } from "react-native-reanimated";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import { ARCLogo } from "@/components/common/deco/ARCLogo";
import { CrossedOutNetworkDeco } from "@/components/common/deco/CrossedOutNetworkDeco";
import { NetworkDeco } from "@/components/common/deco/NetworkDeco";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";
import store from "@/app/store";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { KeyboarDismissWrapper } from "../common/KeyboardDismissWrapper";
import * as EmailValidator from "email-validator";
import { BackgroundTaskRunner } from "../common/BackgroundTaskRunner";
import { wrapKeysWithPasswordCode } from "@/fn/getPasswordWrappedKeys";
import { useSQLiteContext } from "expo-sqlite";
import { genenerateAccountCode } from "@/fn/generateAccountCode";
import { PasswordHashingReturnType } from "@/app/config/endpointReturnTypes";
import { RadialGradient } from "react-native-svg";
import { GradientLine } from "../common/deco/GradientLine";
import { useGlobalStyleStore } from "@/stores/globalStyles";

export default function OTSOne({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  store.subscribe(() => {});
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);

  const titleHeaderContainer = { containerHeight: 36, containerWidth: 325 };

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
      <RBox
        figmaImport={{ mobile: { top: 5, left: 165, width: 30, height: 10 } }}
      >
        <ARCLogo></ARCLogo>
      </RBox>
      <RBox
        figmaImport={{ mobile: { top: 21, left: 0, width: "100%", height: 1 } }}
        backgroundColor={globalStyle.color}
      >
        {/* <GradientLine width="100%" height="100%"></GradientLine> */}
      </RBox>
      {hasMounted ? (
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
          <RBox
            figmaImport={{
              mobile: { top: 36, left: 18, width: 325, height: 36 },
            }}
            backgroundColor={globalStyle.color + "20"}
          >
            <RLabel
              figmaImportConfig={titleHeaderContainer}
              figmaImport={{
                mobile: { left: 8, top: 0, width: "50%", height: "100%" },
              }}
              alignPadding="0%"
              verticalAlign="center"
              fontSize={15}
              align="left"
              text="One-time Setup"
            ></RLabel>
            <RLabel
              figmaImportConfig={titleHeaderContainer}
              figmaImport={{
                mobile: { left: 293, top: 0, width: "50%", height: "100%" },
              }}
              alignPadding="0%"
              verticalAlign="center"
              fontSize={15}
              align="left"
              text="1/3"
            ></RLabel>
          </RBox>
          <RLabel
            figmaImport={{
              mobile: { left: 18, top: 86, width: "50%", height: 95 },
            }}
            alignPadding="0%"
            verticalAlign="top"
            fontSize={28}
            align="left"
            text="Welcome!"
          ></RLabel>
          <RLabel
            figmaImport={{
              mobile: { left: 18, top: 135, width: "90%", height: 120 },
            }}
            alignPadding="0%"
            verticalAlign="top"
            fontSize={18}
            align="left"
            text="We encrypt your data so only you can read it. Setting up recovery methods is required in the event something happens to this device so you could still recover your data."
          ></RLabel>
          <RButton
            onClick={() => {
              navigation.navigate("OTSTwo", { name: "OTSTwo" });
            }}
            figmaImport={{
              mobile: { top: 567, left: 18, width: 321, height: 53 },
            }}
            alignPadding={"3%"}
            verticalAlign="center"
            fontSize={14}
          >
            <ArrowDeco
              width="15%"
              style={{ transform: [{ rotateZ: "0deg" }], left: "82%" }}
            ></ArrowDeco>
            <RLabel text="Continue" fontSize={18} left="3%" top="33%"></RLabel>
          </RButton>
        </Animated.View>
      ) : (
        <RBox></RBox>
      )}
    </View>
  );
}
