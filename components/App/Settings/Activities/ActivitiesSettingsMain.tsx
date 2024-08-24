import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import RBox from "@/components/common/RBox";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import RLabel from "@/components/common/RLabel";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, Easing } from "react-native-reanimated";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import store from "@/app/store";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { FeatureConfigArcType } from "@/app/config/commonTypes";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";

export default function ActivitiesSettingsMain() {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const arcFeatureConfig: FeatureConfigArcType = useArcFeatureConfigStore(
    (store) => store.arcFeatureConfig
  );

  store.subscribe(() => {});
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
      setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    }, 150);
  }, []);

  useEffect(() => {}, [arcFeatureConfig]);

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
          <RLabel text={JSON.stringify(arcFeatureConfig)}></RLabel>
        </Animated.View>
      ) : (
        <RBox></RBox>
      )}
    </View>
  );
}
