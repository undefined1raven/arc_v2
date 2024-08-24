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
import * as jsesc from "jsesc";
import { PasswordHashingReturnType } from "@/app/config/endpointReturnTypes";
import { useGlobalStyleStore } from "@/stores/globalStyles";
export default function CreateAccountOnlineEmail({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  store.subscribe(() => {});

  useEffect(() => {
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  });

  const [hasMounted, setHasMounted] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordValidityObj, setPasswordValidityObj] = useState({
    length: false,
    symbol: false,
    number: false,
    uppercase: false,
  });
  const [hasConfirmedAccountInfo, setHasConfirmedAccountInfo] = useState(false);
  const [codeTriggeringState, setCodeTriggeringState] = useState(
    Date.now().toString()
  );
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  type WrapKeysWithPasswordCodeReturnType = {
    status: "failed" | "success";
    error: null | string | object;
    taskID: "passwordKeyWrap";
    payload?: string;
  };

  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
    }, 150);
  }, []);

  useEffect(() => {
    setPasswordValidityObj((prev) => {
      return { ...prev, length: password.length > 6 };
    });
    setPasswordValidityObj((prev) => {
      return { ...prev, symbol: !password.match(/^(|[a-zA-Z0-9]*)$/) };
    });
    setPasswordValidityObj((prev) => {
      return { ...prev, number: password.match(/[0-9]/) };
    });
    setPasswordValidityObj((prev) => {
      return { ...prev, uppercase: password.match(/[A-Z]/) };
    });
  }, [password]);

  useEffect(() => {
    setIsEmailValid(EmailValidator.validate(emailInput));
  }, [emailInput]);

  function displayThenHideErrorBanner() {
    setShowErrorBanner(true);
    setTimeout(() => {
      setShowErrorBanner(false);
      setHasConfirmedAccountInfo(false);
    }, 3000);
  }

  useEffect(() => {
    const { length, symbol, number, uppercase } = passwordValidityObj;
    if (length && symbol && number && uppercase) {
      setIsPasswordValid(true);
    } else if (password.length !== 0) {
      setIsPasswordValid(false);
    }
  }, [passwordValidityObj]);

  const db = useSQLiteContext();

  function onWrappedKeys(e) {
    if (emailInput !== "") {
      const eventData: WrapKeysWithPasswordCodeReturnType = JSON.parse(
        e.nativeEvent.data
      );
      if (eventData.status === "success" && eventData.payload) {
        try {
          const parsedPSKBackup = JSON.parse(eventData.payload);
          if (parsedPSKBackup.pk && parsedPSKBackup.symsk) {
            fetch(
              "https://arcv2-api.vercel.app/api/accountCreation/hashPassword",
              { method: "POST", body: JSON.stringify({ password: password }) }
            )
              .then(async (res) => {
                const response: PasswordHashingReturnType = await res.json();
                if (response.status === "success" && response.passwordHash) {
                  db.runAsync(
                    `UPDATE users SET PSKBackup=?, passwordHash=?, emailAddress=? WHERE id='temp'`,
                    jsesc.default(eventData.payload, { json: true }),
                    response.passwordHash,
                    emailInput
                  )
                    .then((res) => {
                      console.log(res);
                      navigation.navigate("OTSOne", { name: "OTSOne" });
                      setHasConfirmedAccountInfo(false);
                    })
                    .catch((e) => {
                      console.log(e);
                      displayThenHideErrorBanner();
                    });
                } else {
                  displayThenHideErrorBanner();
                }
              })
              .catch((e) => {
                displayThenHideErrorBanner();
              });
          } else {
            displayThenHideErrorBanner();
          }
        } catch (e) {
          displayThenHideErrorBanner();
        }
      } else {
        displayThenHideErrorBanner();
      }
    }
  }

  useEffect(() => {
    if (hasConfirmedAccountInfo === true) {
      setCodeTriggeringState(Date.now().toString());
    }
  }, [hasConfirmedAccountInfo]);

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
      <View>
        <BackgroundTaskRunner
          tx={codeTriggeringState}
          triggeredCode={wrapKeysWithPasswordCode(
            password,
            SecureStore.getItem("temp-pk"),
            SecureStore.getItem("temp-symsk")
          )}
          messageHandler={(e: WrapKeysWithPasswordCodeReturnType) => {
            onWrappedKeys(e);
          }}
        ></BackgroundTaskRunner>
      </View>
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
          <KeyboarDismissWrapper></KeyboarDismissWrapper>
          <RBox
            figmaImport={{
              mobile: { top: 34, left: 167, width: 25, height: 25 },
            }}
          >
            <ARCLogoMini width="100%" height="100%"></ARCLogoMini>
          </RBox>
          <RLabel
            figmaImport={{
              mobile: { top: 103, left: 50, width: 260, height: 38 },
            }}
            text="Create Account"
            align="left"
            alignPadding={"3%"}
            verticalAlign="center"
            fontSize={14}
            backgroundColor={globalStyle.color + "20"}
          ></RLabel>
          <RLabel
            alignPadding={"0%"}
            figmaImport={{
              mobile: { top: 153, left: 50, width: 150, height: 25 },
            }}
            align="left"
            fontSize={12}
            text="Email"
          ></RLabel>
          <RLabel
            alignPadding={"0%"}
            figmaImport={{
              mobile: { top: 222, left: 50, width: 150, height: 25 },
            }}
            align="left"
            fontSize={12}
            text="Password"
          ></RLabel>
          <RTextInput
            returnKeyType="next"
            readOnly={hasConfirmedAccountInfo}
            backgroundColor={
              emailInput.length > 0
                ? isEmailValid
                  ? globalStyle.successColor
                  : globalStyle.errorColor
                : globalStyle.color
            }
            borderColor={
              emailInput.length > 0
                ? isEmailValid
                  ? globalStyle.successColor
                  : globalStyle.errorColor
                : globalStyle.color
            }
            textContentType="emailAddress"
            textAlignVertical="center"
            align="left"
            alignPadding="2%"
            onInput={(e) => {
              setEmailInput(e);
            }}
            figmaImport={{
              mobile: { top: 174, left: 50, width: 260, height: 34 },
            }}
            fontSize={16}
          ></RTextInput>
          <RTextInput
            readOnly={hasConfirmedAccountInfo}
            backgroundColor={
              password.length > 0
                ? isPasswordValid
                  ? globalStyle.successColor
                  : globalStyle.errorColor
                : globalStyle.color
            }
            borderColor={
              password.length > 0
                ? isPasswordValid
                  ? globalStyle.successColor
                  : globalStyle.errorColor
                : globalStyle.color
            }
            textContentType="password"
            textAlignVertical="center"
            align="left"
            alignPadding="2%"
            onInput={(e) => {
              setPassword(e);
            }}
            figmaImport={{
              mobile: { top: 243, left: 50, width: 260, height: 34 },
            }}
            fontSize={16}
            secureTextEntry={true}
          ></RTextInput>
          <RButton
            androidRippleEnabled={!hasConfirmedAccountInfo}
            onClick={() => {
              if (
                isEmailValid === true &&
                isPasswordValid &&
                hasConfirmedAccountInfo === false
              ) {
                setHasConfirmedAccountInfo(true);
              }
            }}
            isEnabled={isEmailValid && isPasswordValid}
            figmaImport={{
              mobile: { top: 388, left: 50, width: 260, height: 38 },
            }}
            label="Create Account"
            align="left"
            alignPadding={"3%"}
            verticalAlign="center"
            fontSize={14}
          >
            <RBox width={50} left="83%" height={"100%"}>
              <ActivityIndicator
                animating={showErrorBanner === false && hasConfirmedAccountInfo}
                color={globalStyle.color}
                size={"large"}
              ></ActivityIndicator>
            </RBox>
          </RButton>
          <RBox
            figmaImport={{
              mobile: { left: 50, width: 120, height: 60, top: 283 },
            }}
          >
            <RLabel
              color={
                passwordValidityObj.length
                  ? globalStyle.successTextColor
                  : globalStyle.textColor
              }
              left="11%"
              width="90%"
              align="left"
              alignPadding="0%"
              text="At least 6 characters"
              top={0}
              fontSize={10}
            ></RLabel>
            <RLabel
              color={
                passwordValidityObj.symbol
                  ? globalStyle.successTextColor
                  : globalStyle.textColor
              }
              left="11%"
              width="90%"
              align="left"
              alignPadding="0%"
              text="At least a symbol"
              top={15}
              fontSize={10}
            ></RLabel>
            <RLabel
              color={
                passwordValidityObj.number
                  ? globalStyle.successTextColor
                  : globalStyle.textColor
              }
              left="11%"
              width="90%"
              align="left"
              alignPadding="0%"
              text="At least a number"
              top={30}
              fontSize={10}
            ></RLabel>
            <RLabel
              color={
                passwordValidityObj.uppercase
                  ? globalStyle.successTextColor
                  : globalStyle.textColor
              }
              left="11%"
              width="90%"
              align="left"
              alignPadding="0%"
              text="An uppercase letter"
              top={45}
              fontSize={10}
            ></RLabel>
            <RBox
              borderRadius={2}
              height={10}
              width={10}
              top={3.5 * 1}
              style={{ left: "0%" }}
              backgroundColor={
                passwordValidityObj.length
                  ? globalStyle.successColor
                  : globalStyle.textColor
              }
            ></RBox>
            <RBox
              borderRadius={2}
              height={10}
              width={10}
              top={3.5 * 5.5}
              style={{ left: "0%" }}
              backgroundColor={
                passwordValidityObj.symbol
                  ? globalStyle.successColor
                  : globalStyle.textColor
              }
            ></RBox>
            <RBox
              borderRadius={2}
              height={10}
              width={10}
              top={3.5 * 10}
              style={{ left: "0%" }}
              backgroundColor={
                passwordValidityObj.number
                  ? globalStyle.successColor
                  : globalStyle.textColor
              }
            ></RBox>
            <RBox
              borderRadius={2}
              height={10}
              width={10}
              top={3.5 * 14}
              style={{ left: "0%" }}
              backgroundColor={
                passwordValidityObj.uppercase
                  ? globalStyle.successColor
                  : globalStyle.textColor
              }
            ></RBox>
          </RBox>
          <RButton
            onClick={() => {
              navigation.navigate("createAccountOnline", {
                name: "createAccountOnline",
              });
            }}
            isEnabled={true}
            color={globalStyle.textColorAccent}
            borderColor={globalStyle.colorAccent}
            backgroundColor={globalStyle.colorAccent}
            figmaImport={{
              mobile: { top: 449, left: 50, width: 260, height: 38 },
            }}
            alignPadding={"3%"}
            verticalAlign="center"
            fontSize={14}
          >
            <ArrowDeco
              width="15%"
              style={{ transform: [{ rotateZ: "180deg" }], left: "5%" }}
            ></ArrowDeco>
            <RLabel
              text="Back"
              color={globalStyle.textColorAccent}
              left="71%"
              top="25%"
            ></RLabel>
          </RButton>
          {showErrorBanner ? (
            <RLabel
              verticalAlign="center"
              figmaImport={{
                mobile: { top: 510, left: 50, width: 260, height: 40 },
              }}
              text="Something went wrong :("
              backgroundColor={globalStyle.errorColor + "20"}
              color={globalStyle.errorTextColor}
            ></RLabel>
          ) : (
            <RBox></RBox>
          )}
        </Animated.View>
      ) : (
        <RBox></RBox>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: "0%",
    backgroundColor: "#00000000",
    width: "100%",
    height: "100.3%",
    padding: 0,
    position: "absolute",
    alignItems: "center",
  },
});
