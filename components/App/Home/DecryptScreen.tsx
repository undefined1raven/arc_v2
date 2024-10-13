import { EmptyView } from "@/components/common/EmptyView";
import RBox from "@/components/common/RBox";
import RLabel from "@/components/common/RLabel";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useHasLoadedUserDataStore } from "./hasLoadedUserData";
import { FingerprintDeco } from "@/components/common/deco/FingerprintDeco";
import RButton from "@/components/common/RButton";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import { ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import RTextInput from "@/components/common/RTextInput";
import { useEffect, useState } from "react";
import { UnwrapTessSymkey } from "./UnwrapTessSymkey";
function DecryptionScreen() {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const hasLoadedUserDataAPI = useHasLoadedUserDataStore();
  const tessKeyBioFlag = SecureStore.getItem("tess_symkey_pin_no_bio");
  const [isPinValid, setIsPinValid] = useState(false);
  const [usePinInsteadMode, setUsePinInsteadMode] = useState(false);
  const [pinFromInput, setPinFromInput] = useState<string>("");
  const [finalTessPin, setFinalTessPin] = useState<string | null>(null);
  function ChunksDecryptingLoadingDeco(props: { top: number }) {
    const progress = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
      const colorInterpolation = progress.value * 2;
      const backgroundColor =
        colorInterpolation % 2 === 0
          ? globalStyle.color
          : globalStyle.colorInactive;

      return {
        backgroundColor,
      };
    });

    progress.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      true
    );

    return (
      <RBox
        figmaImport={{
          mobile: { top: props.top, left: 49, width: 262, height: 293 },
        }}
      >
        <RLabel
          left={-8}
          align="left"
          text="Decrypting"
          width="100%"
          height="15%"
          verticalAlign="center"
        ></RLabel>
        <RBox
          height={2}
          width="100%"
          top={"12%"}
          backgroundColor={globalStyle.color}
        >
          <RBox
            style={{
              height: "100%",
              top: "0%",
              width: "50%",
              ...animatedStyle,
              backgroundColor: "#fff",
            }}
          ></RBox>
        </RBox>
      </RBox>
    );
  }
  useEffect(() => {
    setIsPinValid(
      !!(
        pinFromInput.match(/^(|[0-9]*)$/) &&
        pinFromInput.length >= 4 &&
        pinFromInput.length <= 6
      )
    );
  }, [pinFromInput]);

  useEffect(() => {}, [finalTessPin]);

  function requestPinFromStorage() {
    try {
      const tessPin = SecureStore.getItem("tess_symkey_pin", {
        requireAuthentication: true,
        authenticationPrompt: "Authenticate to decrypt your data",
      });
      setFinalTessPin(tessPin);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    if (
      hasLoadedUserDataAPI.keyType === "double" &&
      tessKeyBioFlag === "false"
    ) {
      setTimeout(() => {
        requestPinFromStorage();
      }, 300);
    }
  }, []);

  return (
    <EmptyView
      showHeader={false}
      showMenu={false}
      navigation={{}}
      navBack={"LoadingScreen"}
    >
      {/* <ChunksDecryptingLoadingDeco
        top={hasLoadedUserDataAPI.keyType === "simple" ? 293 : 445}
        ></ChunksDecryptingLoadingDeco> */}
      {hasLoadedUserDataAPI.keyType === "double" ? (
        <>
          {hasLoadedUserDataAPI.hasLoadedUserData === false && (
            <UnwrapTessSymkey
              onSuccess={() => {
                hasLoadedUserDataAPI.setHasTessKey(true);
                console.log("success");
              }}
              onError={(e) => {
                console.log(e);
              }}
              pin={finalTessPin}
            ></UnwrapTessSymkey>
          )}
          {tessKeyBioFlag === "false" && usePinInsteadMode === false ? (
            <>
              <RLabel
                text="Use biometrics to decrypt your data"
                figmaImport={{
                  mobile: {
                    left: "0",
                    width: "100%",
                    height: 19,
                    top: 300,
                  },
                }}
              ></RLabel>
              <RBox
                figmaImport={{
                  mobile: {
                    left: 163,
                    width: 35,
                    height: 35,
                    top: 245,
                  },
                }}
              >
                <FingerprintDeco
                  color={globalStyle.color}
                  width="100%"
                  height="100%"
                ></FingerprintDeco>
              </RBox>
              <RButton
                onClick={() => {
                  setUsePinInsteadMode(true);
                }}
                figmaImport={{
                  mobile: { top: 358, left: 49, width: 262, height: 37 },
                }}
                label="Use your PIN instead"
              ></RButton>
            </>
          ) : (
            <>
              <RLabel
                align="left"
                text="Enter your PIN"
                figmaImport={{
                  mobile: {
                    left: 27,
                    top: 243,
                    height: 19,
                    width: 289,
                  },
                }}
              ></RLabel>
              <RTextInput
                secureTextEntry={true}
                onInput={(e) => {
                  setPinFromInput(e);
                }}
                autoFocus={true}
                borderColor={
                  pinFromInput.length === 0
                    ? globalStyle.color
                    : isPinValid
                    ? globalStyle.successColor
                    : globalStyle.errorColor
                }
                backgroundColor={
                  pinFromInput.length === 0
                    ? globalStyle.color
                    : isPinValid
                    ? globalStyle.successColor
                    : globalStyle.errorColor
                }
                fontSize={globalStyle.largeMobileFont}
                placeholderTextColor={globalStyle.textColorInactive}
                placeholder="Enter your PIN"
                alignPadding={"2%"}
                align="left"
                keyboardType="number-pad"
                figmaImport={{
                  mobile: {
                    left: 27,
                    top: 269,
                    height: 44,
                    width: 289,
                  },
                }}
              ></RTextInput>
              <RLabel
                align="left"
                fontSize={globalStyle.mediumMobileFont}
                text="Your PIN is required to decrypt your data"
                figmaImport={{
                  mobile: {
                    left: 23,
                    top: 324,
                    height: 19,
                    width: 289,
                  },
                }}
              ></RLabel>
              <RButton
                onClick={() => {
                  if (isPinValid) {
                    setFinalTessPin(pinFromInput);
                  }
                }}
                label="Enter"
                figmaImport={{
                  mobile: {
                    left: 27,
                    top: 367,
                    height: 44,
                    width: 289,
                  },
                }}
              ></RButton>
              {usePinInsteadMode === true && (
                <RButton
                  onClick={() => {
                    requestPinFromStorage();
                  }}
                  figmaImport={{
                    mobile: {
                      left: 27,
                      top: 420,
                      height: 44,
                      width: 289,
                    },
                  }}
                  label="Retry with biometrics"
                ></RButton>
              )}
            </>
          )}
        </>
      ) : (
        <>
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
                mobile: { left: 155, width: 50, height: 50, top: 264 },
              }}
            >
              <ARCLogoMini width="100%" height="100%"></ARCLogoMini>
            </RBox>
            <RLabel
              figmaImport={{
                mobile: { left: 0, width: "100%", height: 50, top: 330 },
              }}
              text="Decrypting"
            ></RLabel>
            <RBox
              figmaImport={{
                mobile: { left: 155, width: 50, height: 50, top: 340 },
              }}
            >
              <ActivityIndicator color={globalStyle.color}></ActivityIndicator>
            </RBox>
          </Animated.View>
        </>
      )}
    </EmptyView>
  );
}

export { DecryptionScreen };
