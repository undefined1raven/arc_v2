import {
  Image,
  StyleSheet,
  Platform,
  View,
  useWindowDimensions,
  Button,
  ActivityIndicator,
} from "react-native";

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
import { DownloadDeco } from "../common/deco/DownloadDeco";
import * as SecureStore from "expo-secure-store";
import { StorageAccessFramework } from "expo-file-system";
import * as FileSystem from "expo-file-system";
import { useSQLiteContext } from "expo-sqlite";
import * as Crypto from "expo-crypto";
import { useGlobalStyleStore } from "@/stores/globalStyles";
export default function CreateAccountKeyFile({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  store.subscribe(() => {});
  const [hasDownloadKey, setHasDownloadeKey] = useState(false);
  useEffect(() => {
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  });

  const [hasMounted, setHasMounted] = useState(false);
  const db = useSQLiteContext();
  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
    }, 150);
  }, []);

  async function saveKey() {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      setHasDownloadeKey(false);
      return;
    }
    try {
      const accountData = await db.getFirstAsync(
        `SELECT * FROM users WHERE id='temp'`
      );
      const pk = await SecureStore.getItemAsync("temp-pk").catch((e) => {
        return {
          error: "Failed to set keychain pk",
          errorObj: e,
          status: "failed",
        };
      });
      const symsk = await SecureStore.getItemAsync("temp-symsk").catch((e) => {
        return {
          error: "Failed to set keychain symsk",
          errorObj: e,
          status: "failed",
        };
      });
      if (
        accountData.publicKey &&
        accountData.arcFeatureConfig !== undefined &&
        pk !== null &&
        symsk !== null
      ) {
        const keyContent = JSON.stringify({
          ...accountData,
          pk: pk,
          symsk: symsk,
          id: "local",
        });
        await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          `ARC_Account_Key-${Date.now()}.txt`,
          "text/plain"
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, keyContent, {
              encoding: FileSystem.EncodingType.UTF8,
            });
            setHasDownloadeKey(true);
          })
          .catch((e) => {
            setHasDownloadeKey(false);
            console.log(e);
          });
      } else {
        //
      }
    } catch (e) {
      setHasDownloadeKey(false);
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
          <RButton
            onClick={(e) => {
              saveKey();
            }}
            figmaImport={{
              mobile: { left: 50, width: 260, height: 135, top: 155 },
            }}
          >
            <RLabel
              fontSize={18}
              top="15%"
              width="100%"
              text="Download Key"
            ></RLabel>
            <DownloadDeco top="45%" width="100%"></DownloadDeco>
          </RButton>
          <RLabel
            figmaImport={{
              mobile: { top: 306, left: 50, width: 260, height: 49 },
            }}
            text="This file contains everything you need to log in, even when offline"
            align="center"
            alignPadding={"3%"}
            verticalAlign="center"
            fontSize={14}
            backgroundColor={globalStyle.color + "20"}
          ></RLabel>
          <RLabel
            figmaImport={{
              mobile: { top: 366, left: 50, width: 260, height: 49 },
            }}
            color={globalStyle.errorTextColor}
            text="Never share this file with anyone"
            align="center"
            alignPadding={"3%"}
            verticalAlign="center"
            fontSize={14}
            backgroundColor={globalStyle.errorColor + "20"}
          ></RLabel>
          <RButton
            androidRippleEnabled={hasDownloadKey}
            onClick={() => {
              if (hasDownloadKey === true) {
                navigation.navigate("OTSOne", { name: "OTSOne" });
              }
            }}
            isEnabled={hasDownloadKey}
            figmaImport={{
              mobile: { top: 430, left: 50, width: 260, height: 38 },
            }}
            label="Create Account"
            align="left"
            alignPadding={"3%"}
            verticalAlign="center"
            fontSize={14}
          ></RButton>
        </Animated.View>
      ) : (
        <RBox></RBox>
      )}
    </View>
  );
}
