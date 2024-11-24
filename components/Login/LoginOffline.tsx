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
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useLoadingScreenMessageStore } from "@/stores/loadingScreenMessage";
import { useNewAccountStore } from "@/stores/newAccountStore";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { EmptyView } from "../common/EmptyView";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { AddIcon } from "../common/deco/AddIcon";
import { PadlockIcon } from "../common/deco/PadlockIcon";
import * as Updates from "expo-updates";
import { useSQLiteContext } from "expo-sqlite";
import { getInsertStringFromObject } from "@/fn/dbUtils";
import * as SecureStore from "expo-secure-store";
import { LoginOfflinePINValidator } from "./LoginOfflinePINValidator";
export default function LoginOffline({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const db = useSQLiteContext();
  useEffect(() => {
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);

  const [hasMounted, setHasMounted] = useState(false);
  const buttonContainerSize = { containerWidth: 260, containerHeight: 155 };
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileJson, setFileJson] = useState(null);
  const [hasFile, setHasFile] = useState(false);
  const [doubleKey, setDoubleKey] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showError, setShowError] = useState(false);
  const [restoreTimeTracking, setRestoreTimeTracking] = useState(true);
  const [restoreDayPlanner, setRestoreDayPlanner] = useState(true);
  const [isValidatingPIN, setIsValidatingPIN] = useState(false);
  const [restorePersonalDiary, setRestorePersonalDiary] = useState(true);
  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setHasFile(false);
        setFileJson(null);
        setFileName("");
        setIsLoadingFile(false);
        setShowError(false);
        setRestoreDayPlanner(true);
        setRestorePersonalDiary(true);
        setRestoreTimeTracking(true);
        setIsValidatingPIN(false);
      }, 1000);
    }
  }, [showError]);

  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
    }, 150);
  }, []);

  useEffect(() => {
    if (fileJson !== null) {
      setIsLoadingFile(false);
      const keys = Object.keys(fileJson);
      if (
        keys.indexOf("userData") === -1 ||
        keys.indexOf("arcData") === -1 ||
        keys.indexOf("SIDData") === -1 ||
        keys.indexOf("tessData") === -1 ||
        keys.indexOf("pk") === -1 ||
        keys.indexOf("symkey") === -1
      ) {
        setShowError(true);
        return;
      }
      const hasDoubleKeys = fileJson.userData.PIKBackup !== null;
      setDoubleKey(hasDoubleKeys);
      setHasFile(true);
    }
  }, [fileJson]);

  function writeBackupToDB(wait?: boolean) {
    const userData = fileJson.userData;
    const promiseArray = [];
    promiseArray.push(
      db.runAsync(
        `INSERT OR REPLACE INTO users ${
          getInsertStringFromObject(userData).queryString
        }`,
        getInsertStringFromObject(userData).values
      )
    );

    const arcData = fileJson.arcData;
    if (
      restoreTimeTracking === true &&
      arcData !== null &&
      typeof arcData?.length === "number"
    ) {
      arcData.forEach((chunk) => {
        promiseArray.push(
          db.runAsync(
            `INSERT OR REPLACE INTO arcChunks ${
              getInsertStringFromObject(chunk).queryString
            }`,
            getInsertStringFromObject(chunk).values
          )
        );
      });
    }
    const tessData = fileJson.tessData;
    if (
      restoreDayPlanner === true &&
      tessData !== null &&
      typeof tessData?.length === "number"
    ) {
      tessData.forEach((chunk) => {
        promiseArray.push(
          db.runAsync(
            `INSERT OR REPLACE INTO tessChunks ${
              getInsertStringFromObject(chunk).queryString
            }`,
            getInsertStringFromObject(chunk).values
          )
        );
      });
    }
    const SIDData = fileJson.SIDData;
    if (
      restorePersonalDiary === true &&
      SIDData !== null &&
      typeof SIDData?.length === "number"
    ) {
      SIDData.forEach((chunk) => {
        promiseArray.push(
          db.runAsync(
            `INSERT OR REPLACE INTO sidChunks ${
              getInsertStringFromObject(chunk).queryString
            }`,
            getInsertStringFromObject(chunk).values
          )
        );
      });
    }

    const SIDGroups = fileJson.SIDGroups;
    if (
      restorePersonalDiary === true &&
      SIDGroups !== null &&
      typeof SIDGroups?.length === "number"
    ) {
      SIDGroups.forEach((chunk) => {
        promiseArray.push(
          db.runAsync(
            `INSERT OR REPLACE INTO sidGroups ${
              getInsertStringFromObject(chunk).queryString
            }`,
            getInsertStringFromObject(chunk).values
          )
        );
      });
    }

    promiseArray.push(
      SecureStore.setItemAsync(`${userData.id}-pk`, fileJson.pk)
    );
    promiseArray.push(
      SecureStore.setItemAsync(`${userData.id}-symsk`, fileJson.symkey)
    );

    if (wait) {
      return Promise.all(promiseArray);
    } else {
      Promise.all(promiseArray)
        .then((res) => {
          Updates.reloadAsync();
        })
        .catch((e) => {
          setShowError(true);
          console.log(e);
        });
    }
  }

  return (
    <EmptyView navigation={navigation} showHeader={false} showMenu={false}>
      <RBox
        transitionDuration={0}
        figmaImport={{
          mobile: { top: 34, left: 167, width: 25, height: 25 },
        }}
      >
        <ARCLogoMini width="100%" height="100%"></ARCLogoMini>
      </RBox>

      <RLabel
        transitionIndex={1}
        figmaImport={{
          mobile: { top: 103, left: 50, width: 260, height: 38 },
        }}
        text="Pick your back-up file"
        align="left"
        alignPadding={"3%"}
        verticalAlign="center"
        fontSize={14}
        backgroundColor={globalStyle.color + "20"}
      ></RLabel>
      {showError && (
        <RLabel
          color={globalStyle.errorTextColor}
          backgroundColor={globalStyle.errorColor + "20"}
          text="Error: Invalid file"
          align="left"
          fontSize={globalStyle.mediumMobileFont}
          verticalAlign="center"
          figmaImport={{
            mobile: { top: 472, left: 57, width: 245, height: 27 },
          }}
        ></RLabel>
      )}
      {hasFile === true && isLoadingFile === false ? (
        <>
          <>
            <RLabel
              align="left"
              fontSize={globalStyle.mediumMobileFont}
              text="You can pick which parts of your account get restored"
              figmaImport={{
                mobile: {
                  left: 50,
                  width: 260,
                  top: 146,
                  height: 30,
                },
              }}
            ></RLabel>
            <RBox
              figmaImport={{
                mobile: {
                  left: 50,
                  width: 260,
                  top: 179,
                  height: 24,
                },
              }}
            >
              <RBox
                width="12%"
                height="100%"
                backgroundColor={globalStyle.successColor + "20"}
              >
                <PadlockIcon
                  width="80%"
                  height="60%"
                  color={globalStyle.successColor}
                ></PadlockIcon>
              </RBox>
              <RLabel
                left="14%"
                height="100%"
                width="86%"
                verticalAlign="center"
                align="left"
                color={globalStyle.successTextColor}
                text="Account Data"
              ></RLabel>
            </RBox>
            <RBox
              figmaImport={{
                mobile: {
                  left: 50,
                  width: 260,
                  top: 211,
                  height: 24,
                },
              }}
            >
              <RBox
                width="12%"
                height="100%"
                borderColor={
                  restoreTimeTracking
                    ? globalStyle.successColor
                    : globalStyle.color
                }
                borderWidth={1}
                backgroundColor={
                  globalStyle.successColor + (restoreTimeTracking ? "ff" : "00")
                }
              ></RBox>
              <RLabel
                left="13%"
                height="100%"
                width="86%"
                verticalAlign="center"
                align="left"
                color={
                  restoreTimeTracking
                    ? globalStyle.successTextColor
                    : globalStyle.textColor
                }
                text="Time Tracking"
              ></RLabel>
              <RButton
                width="100%"
                height="100%"
                androidRippleEnabled={false}
                onClick={() => {
                  setRestoreTimeTracking(!restoreTimeTracking);
                }}
                borderColor="#00000000"
              ></RButton>
            </RBox>
            <RBox
              figmaImport={{
                mobile: {
                  left: 50,
                  width: 260,
                  top: 243,
                  height: 24,
                },
              }}
            >
              <RBox
                width="12%"
                height="100%"
                borderColor={
                  restoreDayPlanner
                    ? globalStyle.successColor
                    : globalStyle.color
                }
                borderWidth={1}
                backgroundColor={
                  globalStyle.successColor + (restoreDayPlanner ? "ff" : "00")
                }
              ></RBox>
              <RLabel
                left="13%"
                height="100%"
                width="86%"
                verticalAlign="center"
                align="left"
                color={
                  restoreDayPlanner
                    ? globalStyle.successTextColor
                    : globalStyle.textColor
                }
                text="Day Planner"
              ></RLabel>
              <RButton
                width="100%"
                height="100%"
                androidRippleEnabled={false}
                onClick={() => {
                  setRestoreDayPlanner(!restoreDayPlanner);
                }}
                borderColor="#00000000"
              ></RButton>
            </RBox>
            <RBox
              figmaImport={{
                mobile: {
                  left: 50,
                  width: 260,
                  top: 275,
                  height: 24,
                },
              }}
            >
              <RBox
                width="12%"
                height="100%"
                borderColor={
                  restorePersonalDiary
                    ? globalStyle.successColor
                    : globalStyle.color
                }
                borderWidth={1}
                backgroundColor={
                  globalStyle.successColor +
                  (restorePersonalDiary ? "ff" : "00")
                }
              ></RBox>
              <RLabel
                left="13%"
                height="100%"
                width="86%"
                verticalAlign="center"
                align="left"
                color={
                  restorePersonalDiary
                    ? globalStyle.successTextColor
                    : globalStyle.textColor
                }
                text="Personal Diary"
              ></RLabel>
              <RButton
                width="100%"
                height="100%"
                androidRippleEnabled={false}
                onClick={() => {
                  setRestorePersonalDiary(!restorePersonalDiary);
                }}
                borderColor="#00000000"
              ></RButton>
            </RBox>
          </>

          <RLabel
            backgroundColor={globalStyle.color + "20"}
            height="100%"
            verticalAlign="center"
            fontSize={globalStyle.smallMobileFont}
            text="Encryption"
            figmaImport={{
              mobile: {
                top: 503,
                left: 57,
                width: 145,
                height: 20,
              },
            }}
          ></RLabel>
          <RLabel
            backgroundColor={globalStyle.color + "20"}
            height="100%"
            verticalAlign="center"
            fontSize={globalStyle.smallMobileFont}
            text={doubleKey ? "Enhanced" : "Standard"}
            figmaImport={{
              mobile: {
                top: 503,
                left: 206,
                width: 96,
                height: 20,
              },
            }}
          ></RLabel>
        </>
      ) : null}
      {hasFile === false && isLoadingFile === false ? (
        <RButton
          onClick={() => {
            setIsLoadingFile(true);
            DocumentPicker.getDocumentAsync()
              .then(async (file) => {
                if (file === null) return;
                if (file.assets?.length === 0) return;
                const fileContent = await FileSystem.readAsStringAsync(
                  file.assets[0].uri
                );
                setFileName(file.assets[0].name);
                try {
                  setFileJson(JSON.parse(fileContent));
                } catch (e) {
                  console.log(e);
                  setShowError(true);
                }
              })
              .catch((e) => {
                setShowError(true);
                console.log(e);
              });
          }}
          label="Select a file"
          figmaImport={{
            mobile: {
              top: 527,
              left: 57,
              width: 245,
              height: 45,
            },
          }}
        ></RButton>
      ) : (
        <RBox
          backgroundColor={globalStyle.color + "20"}
          figmaImport={{
            mobile: {
              top: 527,
              left: 57,
              width: 245,
              height: 45,
            },
          }}
        >
          {isLoadingFile ? (
            <>
              <RLabel
                text="Waiting for a file"
                left="2%"
                verticalAlign="center"
                width="80%"
                height="100%"
                align="left"
              ></RLabel>
              <RBox left="80%" height="100%" width="20%">
                <ActivityIndicator
                  color={globalStyle.color}
                ></ActivityIndicator>
              </RBox>
            </>
          ) : (
            <>
              <RLabel
                fontSize={globalStyle.mediumMobileFont}
                text={fileName.slice(0, 29) as string}
                left="2%"
                verticalAlign="center"
                align="left"
                height="100%"
                style={{ overflow: "scroll" }}
                width="75%"
              ></RLabel>
              <RBox
                width={1}
                height="100%"
                left="80%"
                backgroundColor={globalStyle.color}
              ></RBox>
              <RButton
                onClick={() => {
                  setFileJson(null);
                  setHasFile(false);
                  setIsLoadingFile(false);
                  setIsValidatingPIN(false);
                }}
                borderColor="#00000000"
                width="20%"
                left="80%"
                height="100%"
              >
                <RBox
                  style={{ transform: "rotate(45deg)" }}
                  height="70%"
                  top="15%"
                  left="30%"
                  width="40%"
                >
                  <AddIcon width="100%" height="100%"></AddIcon>
                </RBox>
              </RButton>
            </>
          )}
        </RBox>
      )}
      {!isValidatingPIN && (
        <RButton
          onClick={() => {
            if (hasFile === false) {
              navigation.goBack();
            } else {
              if (fileJson === null) return;
              const userData = fileJson.userData;
              const hasDoubleKey = userData.PIKBackup !== null;
              writeBackupToDB();
            }
          }}
          color={hasFile ? globalStyle.textColor : globalStyle.textColorAccent}
          borderColor={hasFile ? globalStyle.color : globalStyle.colorAccent}
          label={
            hasFile
              ? isValidatingPIN
                ? "Complete Restore"
                : "Restore"
              : "Cancel"
          }
          figmaImport={{
            mobile: {
              top: 583,
              left: 57,
              width: 245,
              height: 45,
            },
          }}
        ></RButton>
      )}
    </EmptyView>
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
