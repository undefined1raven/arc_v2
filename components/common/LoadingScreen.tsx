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
import { useLoadingScreenMessageStore } from "@/stores/loadingScreenMessage";
import { useNavigatorStore } from "@/hooks/navigator";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { useHasLoadedUserDataStore } from "../App/Home/hasLoadedUserData";
import { DecryptionScreen } from "../App/Home/DecryptScreen";

export default function LoadingScreen({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const loadingScreenMessage = useLoadingScreenMessageStore(
    (store) => store.loadingScreenMessage
  );
  store.subscribe(() => {});
  const hasLoadedUserDataAPI = useHasLoadedUserDataStore();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);
  const currentActivities = useArcCurrentActivitiesStore();
  const setNavigator = useNavigatorStore((store) => store.setNavigator);
  useEffect(() => {
    if (loadingScreenMessage.redirect !== undefined) {
      navigation.navigate(loadingScreenMessage.redirect);
    }
  }, [loadingScreenMessage]);

  useEffect(() => {
    setNavigator(navigation);
  }, []);

  return hasLoadedUserDataAPI.hasStartedDecryption === false ? (
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
            text={loadingScreenMessage.message}
          ></RLabel>
          <RBox
            figmaImport={{
              mobile: { left: 155, width: 50, height: 50, top: 340 },
            }}
          >
            <ActivityIndicator color={globalStyle.color}></ActivityIndicator>
          </RBox>
        </Animated.View>
      ) : (
        <RBox></RBox>
      )}
    </View>
  ) : (
    <DecryptionScreen></DecryptionScreen>
  );
}
