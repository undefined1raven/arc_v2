import { ARCLogo } from "@/components/common/deco/ARCLogo";
import RBox from "@/components/common/RBox";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import store from "@/app/store";
import { useEffect, useState } from "react";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { getVal } from "@/app/config/defaultTransitionConfig";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native";
import { PadlockIcon } from "@/components/common/deco/PadlockIcon";
import useStatusIndicatorsStore from "@/stores/statusIndicators";
type HeaderProps = { show?: boolean };
const Header = (props: HeaderProps) => {
  const statusIndicatorsAPI = useStatusIndicatorsStore();
  const [showActual, setShowActual] = useState(false);
  useEffect(() => {
    setShowActual(getVal(props.show, true));
  }, [props.show]);

  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  return showActual === true ? (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <RBox
        figmaImport={{ mobile: { top: 5, left: 165, width: 30, height: 10 } }}
      >
        <ARCLogo></ARCLogo>
      </RBox>
      <RBox
        figmaImport={{ mobile: { left: 320, width: 40, height: 17, top: 2 } }}
      >
        {statusIndicatorsAPI.encrypting === true && (
          <Animated.View
            entering={FadeIn.duration(350).damping(10)}
            exiting={FadeOut.duration(350).damping(10)}
            style={{ width: "100%", height: "100%" }}
          >
            <RBox
              height="100%"
              width="100%"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              backgroundColor={globalStyle.colorAlt + "20"}
            >
              <RBox width="50%" height="70%" left="-10">
                <PadlockIcon
                  style={{ position: "absolute", top: 3, left: -10 }}
                  width="100%"
                  height="100%"
                  color={globalStyle.colorAlt}
                ></PadlockIcon>
              </RBox>
              <RBox width="50%" height="100%" left="50%">
                <ActivityIndicator
                  color={globalStyle.colorAlt}
                  size="small"
                ></ActivityIndicator>
              </RBox>
            </RBox>
          </Animated.View>
        )}
      </RBox>
      {/* <Animated.View style=>
      </Animated.View> */}
      <RBox
        figmaImport={{ mobile: { top: 21, left: 0, width: "100%", height: 1 } }}
        backgroundColor={globalStyle.color}
      ></RBox>
    </Animated.View>
  ) : (
    <RBox></RBox>
  );
};

export { Header };
