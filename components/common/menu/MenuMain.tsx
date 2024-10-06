import { View, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import RBox from "@/components/common/RBox";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import RLabel from "@/components/common/RLabel";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, {
  FadeInDown,
  Easing,
  FadeInUp,
} from "react-native-reanimated";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import store from "@/app/store";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { FeatureConfigArcType } from "@/app/config/commonTypes";
import RButton from "../RButton";
import { HomeIcon } from "../deco/HomeIcon";
import { ThreeDotsIcon } from "../deco/ThreeDotsIcon";
import { SettingdIcon } from "../deco/SettingsIcon";
import themeColors from "@/app/config/colors";
import getRandomInt from "@/fn/getRandomInt";
import { MenuConfigType } from "@/hooks/menuConfig";
import { useSQLiteContext } from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import { useMenuConfigStore } from "../../../stores/mainMenu";
import { useNavigation } from "@react-navigation/native";
import { useNavigatorStore } from "@/hooks/navigator";

export default function MenuMain() {
  const navigation = useNavigation();

  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const menuConfig = useMenuConfigStore((store) => store.menuConfig);
  const navigator = useNavigatorStore((store) => store.navigator);
  store.subscribe(() => {});
  const [hasMounted, setHasMounted] = useState(false);
  const containerConfig = { containerHeight: 46, containerWidth: 354 };
  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
      setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    }, 150);
  }, []);
  const { height: screenHeight } = Dimensions.get("window");
  const menuApi = useMenuConfigStore();
  const db = useSQLiteContext();
  return menuConfig.visible ? (
    <RBox
      figmaImport={{
        mobile: {
          top: 589,
          left: 3,
          width: containerConfig.containerWidth,
          height: containerConfig.containerHeight,
        },
      }}
    >
      <Animated.View
        style={styles.defaultStyle}
        entering={FadeInDown.duration(100).damping(1)}
      >
        <RButton
          onLongPress={() => {
            console.log("xx");
            db.runAsync("DROP TABLE users");
            db.runAsync("DROP TABLE userData");
            db.runAsync("DROP TABLE arcChunks");
            if (navigator !== null) {
              // navigator.navigate("SettingsMain", { name: "SettingsMain" });
            }
          }}
          figmaImportConfig={containerConfig}
          figmaImport={{
            mobile: { left: "0%", height: "100%", width: 116, top: "0%" },
          }}
        >
          <SettingdIcon width="50%" height="50%"></SettingdIcon>
        </RButton>
        <RButton
          onClick={() => {
            if (navigator !== null) {
              navigator.navigate("Home", { name: "Home" });
            }
          }}
          verticalAlign="center"
          figmaImportConfig={containerConfig}
          figmaImport={{
            mobile: { left: 119, height: "100%", width: 116, top: "0%" },
          }}
        >
          <HomeIcon width="60%" height="60%"></HomeIcon>
        </RButton>
        <RButton
          figmaImportConfig={containerConfig}
          onClick={() => {
            menuApi.setOverlayMenuVisibility(true);
          }}
          figmaImport={{
            mobile: { left: 238, height: "100%", width: 116, top: "0%" },
          }}
        >
          <ThreeDotsIcon width="22%" height="30%"></ThreeDotsIcon>
        </RButton>
      </Animated.View>
    </RBox>
  ) : (
    <RBox></RBox>
  );
}
const styles = StyleSheet.create({
  defaultStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
});
