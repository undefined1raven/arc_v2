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
import Animated, {
  FadeInDown,
  Easing,
  FadeInRight,
} from "react-native-reanimated";
import { ARCLogo } from "@/components/common/deco/ARCLogo";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";
import store from "@/app/store";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
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

type WrapKeysWithPasswordCodeReturnType = {
  status: "failed" | "success";
  error: null | string | object;
  taskID: "passwordKeyWrap";
  payload?: string;
};
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { StorageAccessFramework } from "expo-file-system";
import { DownloadDeco } from "../common/deco/DownloadDeco";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import RFlatList from "../common/RFlatList";
import { useNewAccountStore } from "@/stores/newAccountStore";
export default function OTSTwo({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  store.subscribe(() => {});
  const [hasMounted, setHasMounted] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [codeTrigger, setCodeTrigger] = useState("");
  const [ready, setReady] = useState(false);
  const newAccountAPI = useNewAccountStore();
  const [showCopiedToClipboard, setShowCopiedToClipboard] = useState(false);
  const [wrappedKeysStorage, setWrappedKeysStorage] = useState([]);
  useEffect(() => {
    setHasMounted(true);
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    const recoveryCodesActual = [];
    for (let ix = 0; ix < 6; ix++) {
      recoveryCodesActual.push(genRecoveryCode());
    }
    setRecoveryCodes(recoveryCodesActual);
  }, []);

  useEffect(() => {
    if (recoveryCodes.length > 0) {
      setCodeTrigger(JSON.stringify(Date.now()));
    }
  }, [recoveryCodes]);

  function genRecoveryCode() {
    return reformatUUID(Crypto.randomUUID().toLocaleUpperCase())
      .replaceAll("0", "1")
      .replaceAll("O", "F");
  }

  function reformatUUID(uuid: string) {
    const split = uuid.split("-");
    return "EX" + split[0] + "-" + split[1] + "-" + split[2] + "-" + split[4];
  }

  function listRenderItem({ item, index }) {
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
        <RButton
          hoverOpacityMin={"00"}
          hoverOpacityMax={"00"}
          width="100%"
          borderColor="transparent"
          height="100%"
          top={0}
          left={0}
          fontType="mono"
          alignPadding="0%"
          verticalAlign="center"
          onClick={async () => {
            triggerCopiedToClipboardLabel();
            await Clipboard.setStringAsync(
              recoveryCodes.map((code) => `${code}\n`).join("")
            );
          }}
          align="center"
        >
          <RLabel
            width="100%"
            verticalAlign="center"
            fontSize={globalStyle.mediumMobileFont}
            height="100%"
            text={recoveryCodes[index]}
          ></RLabel>
          <RBox
            width="90%"
            height={1}
            top="99%"
            left="5%"
            backgroundColor={
              globalStyle.color +
              (index !== recoveryCodes.length - 1 ? "FF" : "00")
            }
          ></RBox>
        </RButton>
      </Animated.View>
    );
  }

  const titleHeaderContainer = { containerHeight: 36, containerWidth: 325 };

  function triggerCopiedToClipboardLabel() {
    // setShowCopiedToClipboard(true);
    // setTimeout(() => {
    //   setShowCopiedToClipboard(false);
    // }, 1500);
  }
  const db = useSQLiteContext();

  useEffect(() => {
    if (
      wrappedKeysStorage.length === recoveryCodes.length &&
      recoveryCodes.length > 0
    ) {
      let keyIntegrity = 0;
      wrappedKeysStorage.forEach((wrapedKey) => {
        if (typeof wrapedKey === "object") {
          keyIntegrity++;
        }
      });
      if (keyIntegrity === recoveryCodes.length) {
        db.runAsync(
          `UPDATE users SET RCKBackup=? WHERE id='temp'`,
          jsesc.default(JSON.stringify(wrappedKeysStorage), { json: true })
        )
          .then((res) => {
            setReady(true);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, [wrappedKeysStorage]);

  function handleWrappedKeys(e) {
    if (codeTrigger !== "") {
      const eventResponse: WrapKeysWithPasswordCodeReturnType = JSON.parse(
        e.nativeEvent.data
      );
      if (eventResponse.status === "success" && eventResponse.payload) {
        const parsedPayload = JSON.parse(eventResponse.payload);
        setWrappedKeysStorage(parsedPayload);
      } else {
        if (wrappedKeysStorage.length === 0) {
          setCodeTrigger(JSON.stringify(Date.now()));
        }
      }
    }
  }

  async function saveFile(filename) {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }

    const recoveryCodesString =
      recoveryCodes.join(" , ") +
      ", 0.1.1, [do not share these with anyone and keep them in a safe place]";

    try {
      await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        `ARCRecoveryCodes-${Date.now()}.txt`,
        "text/plain"
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, recoveryCodesString, {
            encoding: FileSystem.EncodingType.UTF8,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      throw new Error(e);
    }
  }
  return (
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
      <BackgroundTaskRunner
        messageHandler={(e) => {
          handleWrappedKeys(e);
        }}
        tx={codeTrigger}
        triggeredCode={wrapKeysWithPasswordCode(
          JSON.stringify(recoveryCodes),
          SecureStore.getItem("temp-pk"),
          SecureStore.getItem("temp-symsk")
        )}
      ></BackgroundTaskRunner>
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
              text="3/3"
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
            text="Recovery Codes"
          ></RLabel>
          <RFlatList
            borderColor={globalStyle.color}
            borderWidth={1}
            renderItem={listRenderItem}
            data={recoveryCodes}
            figmaImport={{
              mobile: {
                left: 18,
                top: 135,
                width: 324,
                height: 300,
              },
            }}
          ></RFlatList>
          <RLabel
            figmaImport={{
              mobile: { left: 18, top: 450, width: "90%", height: 120 },
            }}
            alignPadding="0%"
            verticalAlign="top"
            fontSize={18}
            align="left"
            text="Download or write down a copy of these codes. Keep these codes secret."
          ></RLabel>
          {showCopiedToClipboard ? (
            <RLabel
              figmaImport={{
                mobile: { left: 18, top: 260, width: 324, height: 53 },
              }}
              alignPadding="0%"
              color={globalStyle.successTextColor}
              backgroundColor={globalStyle.successColor + "40"}
              verticalAlign="center"
              fontSize={18}
              text="Copied to clipboard"
            ></RLabel>
          ) : (
            <RBox></RBox>
          )}

          <RButton
            onClick={() => {
              saveFile("backupcodes.txt");
            }}
            figmaImport={{
              mobile: { top: 500, left: 18, width: 324, height: 53 },
            }}
            alignPadding={"3%"}
            verticalAlign="center"
            fontSize={14}
          >
            <RBox width={"15%"} top="15%" height={"80%"} left="85%">
              <DownloadDeco width="100%" height="100%"></DownloadDeco>
            </RBox>
            <RLabel
              text="Download"
              width="80%"
              align="left"
              fontSize={18}
              left="3%"
              top="33%"
            ></RLabel>
          </RButton>

          <RButton
            borderColor={ready ? globalStyle.color : globalStyle.colorInactive}
            isEnabled={ready}
            onClick={() => {
              if (ready) {
                if (newAccountAPI.isOffline === true) {
                  navigation.navigate("createAccountOffline", {
                    name: "createAccountOffline",
                  });
                } else {
                  navigation.navigate("CreateAccountOnline", {
                    name: "CreateAccountOnline",
                  });
                }
              }
            }}
            figmaImport={{
              mobile: { top: 567, left: 18, width: 324, height: 53 },
            }}
            alignPadding={"3%"}
            verticalAlign="center"
            fontSize={14}
          >
            <RBox left="85%" height="80%" top="10%" width="15%">
              <ActivityIndicator
                animating={!ready}
                color={globalStyle.color}
                size={"large"}
              ></ActivityIndicator>
            </RBox>
            <ArrowDeco
              width="15%"
              style={{ transform: [{ rotateZ: "0deg" }], left: "82%" }}
            ></ArrowDeco>
            <RLabel
              color={
                ready ? globalStyle.textColor : globalStyle.textColorInactive
              }
              text="Continue"
              fontSize={18}
              left="3%"
              top="33%"
            ></RLabel>
          </RButton>
        </Animated.View>
      ) : (
        <RBox></RBox>
      )}
    </Animated.View>
  );
}
