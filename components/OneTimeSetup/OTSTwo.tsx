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
export default function OTSTwo({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  store.subscribe(() => {});
  const [hasMounted, setHasMounted] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [recoveryCodeToBeProcessed, setRecoveryCodeToBeProcessed] =
    useState("");
  const [codeTrigger, setCodeTrigger] = useState("");
  const [showCopiedToClipboard, setShowCopiedToClipboard] = useState(false);
  const [wrappedKeysStorage, setWrappedKeysStorage] = useState([]);
  useEffect(() => {
    setHasMounted(true);
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    const recoveryCodesActual = [];
    for (let ix = 0; ix < 2; ix++) {
      recoveryCodesActual.push(genRecoveryCode());
    }
    setRecoveryCodes(recoveryCodesActual);
    setRecoveryCodeToBeProcessed(recoveryCodes[0]);
  }, []);

  function genRecoveryCode() {
    return reformatUUID(Crypto.randomUUID().toLocaleUpperCase())
      .replaceAll("0", "1")
      .replaceAll("O", "F");
  }

  function reformatUUID(uuid: string) {
    const split = uuid.split("-");
    return "EX" + split[0] + "-" + split[1] + "-" + split[2] + "-" + split[4];
  }

  const titleHeaderContainer = { containerHeight: 36, containerWidth: 325 };

  function triggerCopiedToClipboardLabel() {
    setShowCopiedToClipboard(true);
    setTimeout(() => {
      setShowCopiedToClipboard(false);
    }, 1500);
  }
  const db = useSQLiteContext();

  useEffect(() => {
    if (wrappedKeysStorage.length === 1) {
      setRecoveryCodeToBeProcessed(recoveryCodes[1]);
    }
    if (wrappedKeysStorage.length === 2) {
      let keyIntegrity = 0;
      wrappedKeysStorage.forEach((wrapedKey) => {
        try {
          const parsedKey = JSON.parse(wrapedKey);
          if (parsedKey.pk && parsedKey.symsk) {
            keyIntegrity++;
          }
        } catch (e) {
          console.log(e);
        }
      });
      if (keyIntegrity === 2) {
        db.runAsync(
          `UPDATE users SET RCKBackup=? WHERE id='temp'`,
          jsesc.default(JSON.stringify(wrappedKeysStorage), { json: true })
        )
          .then((res) => {
            navigation.navigate("OTSThree", { name: "OTSThree" });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, [wrappedKeysStorage]);

  useEffect(() => {
    if (
      recoveryCodeToBeProcessed === recoveryCodes[1] &&
      wrappedKeysStorage.length === 1
    ) {
      setCodeTrigger(Date.now().toString());
    }
  }, [recoveryCodeToBeProcessed]);

  function handleWrappedKeys(e) {
    if (codeTrigger !== "" && recoveryCodeToBeProcessed !== "") {
      const eventResponse: WrapKeysWithPasswordCodeReturnType = JSON.parse(
        e.nativeEvent.data
      );
      if (eventResponse.status === "success" && eventResponse.payload) {
        setWrappedKeysStorage((prev) => [...prev, eventResponse.payload]);
      }
    }
  }

  function getWrappedKeysSaved() {
    if (recoveryCodes.length === 2 && recoveryCodeToBeProcessed !== "") {
      setCodeTrigger(Date.now().toString());
    }
  }

  async function saveFile(filename) {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }

    const recoveryCodesString =
      recoveryCodes[0] +
      ", " +
      recoveryCodes[1] +
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
      <BackgroundTaskRunner
        messageHandler={(e) => {
          handleWrappedKeys(e);
        }}
        tx={codeTrigger}
        triggeredCode={wrapKeysWithPasswordCode(
          recoveryCodeToBeProcessed,
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
            text="Recovery Codes"
          ></RLabel>
          <RButton
            onClick={async () => {
              triggerCopiedToClipboardLabel();
              await Clipboard.setStringAsync(recoveryCodes[0]);
            }}
            hoverOpacityMin={"10"}
            hoverOpacityMax={"10"}
            figmaImport={{
              mobile: { left: 18, top: 135, width: 324, height: 55 },
            }}
            fontType="mono"
            alignPadding="0%"
            verticalAlign="center"
            mobileFontSize={7}
            align="center"
            label={recoveryCodes[0]}
          ></RButton>
          <RButton
            onClick={async () => {
              triggerCopiedToClipboardLabel();
              await Clipboard.setStringAsync(recoveryCodes[1]);
            }}
            hoverOpacityMin={"10"}
            hoverOpacityMax={"10"}
            figmaImport={{
              mobile: { left: 18, top: 198, width: 325, height: 55 },
            }}
            fontType="mono"
            alignPadding="0%"
            verticalAlign="center"
            mobileFontSize={7}
            align="center"
            label={recoveryCodes[1]}
          ></RButton>
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
            isEnabled={
              recoveryCodes.length === 2 && recoveryCodeToBeProcessed !== ""
            }
            onClick={() => {
              getWrappedKeysSaved();
            }}
            figmaImport={{
              mobile: { top: 567, left: 18, width: 324, height: 53 },
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
