import { ARCLogo } from "@/components/common/deco/ARCLogo";
import RBox from "@/components/common/RBox";
import Animated from "react-native-reanimated";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import store from "@/app/store";
import { useEffect, useState } from "react";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { getVal } from "@/app/config/defaultTransitionConfig";
type HeaderProps = { show?: boolean };
const Header = (props: HeaderProps) => {
  const [showActual, setShowActual] = useState(false);

  useEffect(() => {
    console.log(props.show);
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
        figmaImport={{ mobile: { top: 21, left: 0, width: "100%", height: 1 } }}
        backgroundColor={globalStyle.color}
      ></RBox>
    </Animated.View>
  ) : (
    <RBox></RBox>
  );
};

export { Header };
