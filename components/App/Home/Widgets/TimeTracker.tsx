import { Platform, View } from "react-native";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
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
import { widgetContainerConfig } from "../widgetContainerConfig";

export default function TimeTracker({ navigation }) {
  store.subscribe(() => {});
  const globalStyle: GlobalStyleType = useSelector(
    (store) => store.globalStyle
  );
  const [hasMounted, setHasMounted] = useState(false);
  const timeTrackingContainerConfig = {
    containerHeight: 163,
    containerWidth: 354,
  };
  useEffect(() => {
    setHasMounted(true);
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);

  return (
    <RBox
      backgroundColor={globalStyle.color + "20"}
      figmaImportConfig={widgetContainerConfig}
      figmaImport={{
        mobile: {
          width: timeTrackingContainerConfig.containerWidth,
          height: timeTrackingContainerConfig.containerHeight,
          top: 398,
          left: 3,
        },
      }}
    >
      <RLabel
        align="left"
        text="Current Activity"
        figmaImportConfig={timeTrackingContainerConfig}
        figmaImport={{
          mobile: { top: 10, left: 5, width: "100%", height: 16 },
        }}
        fontSize={12}
        color={globalStyle.textColorAccent}
      ></RLabel>
    </RBox>
  );
}
