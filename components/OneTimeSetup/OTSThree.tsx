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
import { parse, RadialGradient } from "react-native-svg";
import { GradientLine } from "../common/deco/GradientLine";
import * as Crypto from "expo-crypto";
import * as Clipboard from "expo-clipboard";
import { download } from "../../fn/download";
import * as jsesc from "jsesc";
import { useGlobalStyleStore } from "@/stores/globalStyles";
type WrapKeysWithPasswordCodeReturnType = {
  status: "failed" | "success";
  error: null | string | object;
  taskID: "passwordKeyWrap";
  payload?: string;
};

export default function OTSThree({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  store.subscribe(() => {});
  const [hasMounted, setHasMounted] = useState(false);
  const [codeTrigger, setCodeTrigger] = useState("");
  const [pin, setPin] = useState("");
  const [isPinValid, setIsPinValid] = useState(false);
  const [pinConfirmation, setPinConfirmation] = useState("");
  const [isSkipBoxChecked, setIsSkipBoxChecked] = useState(false);
  const [wrappedKeysStorage, setWrappedKeysStorage] = useState(null);
  const [showSkipLoadingSpinner, setShowSkipLoadingSpinner] = useState(false);
  const [canCompleteSignUp, setCanCompleteSignUp] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);
  const titleHeaderContainer = { containerHeight: 36, containerWidth: 325 };

  const db = useSQLiteContext();

  function completeSignUp() {
    db.getFirstAsync(
      `SELECT id, PSKBackup, publicKey, RCKBackup, arcFeatureConfig, SIDFeatureConfig, tessFeatureConfig, signupTime, passwordHash, emailAddress, passkeys, PIKBackup, trustedDevices, oauthState, securityLogs, version FROM users WHERE id='temp'`
    )
      .then((res) => {
        const {
          publicKey,
          RCKBackup,
          arcFeatureConfig,
          SIDFeatureConfig,
          tessFeatureConfig,
        } = res;
        if (RCKBackup !== null && publicKey !== null) {
          const keys = Object.keys(res);
          const placeholders = keys.map((_, i) => `?`).join(",");
          const aid = Crypto.randomUUID();
          db.runAsync(
            `INSERT OR REPLACE INTO users (${keys.join(
              ","
            )}) VALUES (${placeholders})`,
            Object.values(res)
          )
            .then(async (res) => {
              const pk = await SecureStore.getItemAsync("temp-pk").catch(
                (e) => {
                  return {
                    error: "Failed to get pk from keychain",
                    errorObj: e,
                    status: "failed",
                  };
                }
              );
              const symsk = await SecureStore.getItemAsync("temp-symsk").catch(
                (e) => {
                  return {
                    error: "Failed to get symsk from keychain",
                    errorObj: e,
                    status: "failed",
                  };
                }
              );
              if (pk !== null && symsk !== null) {
                await SecureStore.setItemAsync(`${aid}-pk`, pk);
                await SecureStore.setItemAsync(`${aid}-symsk`, symsk);
                await SecureStore.deleteItemAsync("temp-symsk");
                await SecureStore.deleteItemAsync("temp-pk");
                db.runAsync(`DELETE FROM users WHERE id='temp'`)
                  .then((resx) => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Home" }],
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (wrappedKeysStorage !== null) {
      setCanCompleteSignUp(true);
    }
  }, [wrappedKeysStorage]);

  function setPINInput(e) {
    setPin(e);
  }

  useEffect(() => {
    setIsPinValid(
      pin.match(/^(|[0-9]*)$/) && pin.length >= 4 && pin.length <= 6
    );
  }, [pin]);

  function onSkipPin() {
    if (isSkipBoxChecked) {
      setShowSkipLoadingSpinner(true);
      // db.runAsync(`UPDATE users SET PIKBackup=? WHERE id='temp'`, null)
      //   .then((res) => {
      //     completeSignUp();
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
    }
  }

  function getWrappedKeysSaved() {
    if (isPinValid && pinConfirmation === pin) {
      setCodeTrigger(Date.now().toString());
    }
  }

  function handleWrappedKeys(e) {
    if (codeTrigger !== "" && isPinValid) {
      const eventResponse: WrapKeysWithPasswordCodeReturnType = JSON.parse(
        e.nativeEvent.data
      );
      if (eventResponse.status === "success" && eventResponse.payload) {
        setWrappedKeysStorage(eventResponse.payload);
      }
    }
  }

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
          {/* <BackgroundTaskRunner
            messageHandler={(e) => {
              handleWrappedKeys(e);
            }}
            tx={codeTrigger}
            triggeredCode={wrapKeysWithPasswordCode(
              pin,
              SecureStore.getItem("temp-pk"),
              SecureStore.getItem("temp-symsk")
            )}
          ></BackgroundTaskRunner> */}
          <KeyboarDismissWrapper></KeyboarDismissWrapper>
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
              text="2/3"
            ></RLabel>
          </RBox>
          <RLabel
            figmaImport={{
              mobile: { left: 18, top: 86, width: "90%", height: 95 },
            }}
            alignPadding="0%"
            verticalAlign="top"
            fontSize={28}
            align="left"
            text="Set a PIN"
          ></RLabel>
          <RLabel
            figmaImport={{
              mobile: { left: 18, top: 127, width: "90%", height: 120 },
            }}
            alignPadding="0%"
            verticalAlign="top"
            fontSize={18}
            align="left"
            text="You can use this pin to better protect your data as well as a recovery method"
          ></RLabel>
          <RLabel
            figmaImport={{
              mobile: { left: 18, top: 210, width: "90%", height: 120 },
            }}
            alignPadding="0%"
            verticalAlign="top"
            fontSize={14}
            align="left"
            text="Set a new PIN [between 4 and 6 digits]"
          ></RLabel>
          <RLabel
            figmaImport={{
              mobile: { left: 18, top: 296, width: "90%", height: 120 },
            }}
            alignPadding="0%"
            verticalAlign="top"
            fontSize={14}
            align="left"
            text="Confirm PIN"
          ></RLabel>
          <RTextInput
            keyboardType="number-pad"
            returnKeyType="next"
            backgroundColor={
              pin.length > 0
                ? isPinValid
                  ? globalStyle.successColor
                  : globalStyle.errorColor
                : globalStyle.color
            }
            borderColor={
              pin.length > 0
                ? isPinValid
                  ? globalStyle.successColor
                  : globalStyle.errorColor
                : globalStyle.color
            }
            textContentType="password"
            secureTextEntry={true}
            textAlignVertical="center"
            align="left"
            alignPadding="2%"
            onInput={(e) => {
              setPINInput(e);
            }}
            figmaImport={{
              mobile: { top: 232, left: 18, width: 321, height: 42 },
            }}
            fontSize={20}
          ></RTextInput>
          <RTextInput
            keyboardType="number-pad"
            returnKeyType="next"
            backgroundColor={
              pinConfirmation.length > 0
                ? pin === pinConfirmation
                  ? globalStyle.successColor
                  : globalStyle.errorColor
                : globalStyle.color
            }
            borderColor={
              pinConfirmation.length > 0
                ? pin === pinConfirmation
                  ? globalStyle.successColor
                  : globalStyle.errorColor
                : globalStyle.color
            }
            textContentType="password"
            secureTextEntry={true}
            textAlignVertical="center"
            align="left"
            alignPadding="2%"
            onInput={(e) => {
              setPinConfirmation(e);
            }}
            figmaImport={{
              mobile: { top: 318, left: 18, width: 321, height: 42 },
            }}
            fontSize={20}
          ></RTextInput>
          <RButton
            onClick={() => {
              getWrappedKeysSaved();
            }}
            figmaImport={{
              mobile: { top: 388, left: 18, width: 324, height: 53 },
            }}
            alignPadding={"3%"}
            verticalAlign="center"
            fontSize={14}
          >
            <ArrowDeco
              width="15%"
              style={{ transform: [{ rotateZ: "0deg" }], left: "82%" }}
            ></ArrowDeco>
            <RLabel
              text="Continue"
              align="left"
              fontSize={18}
              left="3%"
              top="33%"
            ></RLabel>
          </RButton>
          <RButton
            onClick={onSkipPin}
            label={!showSkipLoadingSpinner ? "Skip" : ""}
            isEnabled={isSkipBoxChecked}
            androidRippleColor={
              isSkipBoxChecked ? globalStyle.errorColor + "30" : undefined
            }
            backgroundColor={
              isSkipBoxChecked ? globalStyle.errorColor : undefined
            }
            borderColor={isSkipBoxChecked ? globalStyle.errorColor : undefined}
            color={isSkipBoxChecked ? globalStyle.errorTextColor : undefined}
            figmaImport={{
              mobile: { top: 537, left: 18, width: 324, height: 41 },
            }}
            verticalAlign="center"
            fontSize={14}
          >
            <RBox left="45%" width="10%" height="100%">
              <ActivityIndicator
                animating={showSkipLoadingSpinner}
                color={globalStyle.errorColor}
                size={"large"}
              ></ActivityIndicator>
            </RBox>
          </RButton>
          <RBox
            figmaImport={{
              mobile: { top: 592, height: 30, width: 324, left: 18 },
            }}
          >
            <RButton
              onClick={() => {
                setIsSkipBoxChecked((prev) => !prev);
              }}
              hoverOpacityMax={isSkipBoxChecked ? "AA" : "20"}
              hoverOpacityMin={isSkipBoxChecked ? "AA" : "00"}
              left="0%"
              width="9%"
              height="80%"
            ></RButton>
            <RLabel
              left="12%"
              width="86%"
              height="100%"
              alignPadding="0%"
              verticalAlign="center"
              fontSize={15}
              align="left"
              text="I understand that without the recovery codes I might lose access to my data"
            ></RLabel>
          </RBox>
        </Animated.View>
      ) : (
        <RBox></RBox>
      )}
    </View>
  );
}
