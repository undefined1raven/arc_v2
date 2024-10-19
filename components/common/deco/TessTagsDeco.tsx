import { getVal } from "@/app/config/defaultTransitionConfig";
import store from "@/app/store";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import * as React from "react";
import Svg, { SvgProps, Path, Rect, Mask } from "react-native-svg";
const TessTagsDeco = (
  props: SvgProps & { color1: string; color2: string; color3: string }
) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  
  return (
    <Svg
      width={43}
      height={30}
      viewBox="0 0 43 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M23 1a1 1 0 011-1h13.04a1 1 0 01.579.184l4.23 3a1 1 0 010 1.632l-4.23 3A1 1 0 0137.04 8H24a1 1 0 01-1-1V1z"
        fill={getVal(props.color1, globalStyle.color)}
      />
      <Path
        d="M25 10a1 1 0 011 1v13.04a1 1 0 01-.184.579l-3 4.23a1 1 0 01-1.632 0l-3-4.23A1 1 0 0118 24.04V11a1 1 0 011-1h6z"
        fill={getVal(props.color2, globalStyle.successColor)}
      />
      <Path
        d="M21 7a1 1 0 01-1 1H6.23a1 1 0 01-.56-.171l-4.443-3a1 1 0 010-1.658l4.442-3A1 1 0 016.23 0H20a1 1 0 011 1v6z"
        fill={getVal(props.color3, globalStyle.errorTextColor)}
      />
    </Svg>
  );
};

export { TessTagsDeco };
