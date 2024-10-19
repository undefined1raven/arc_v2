import { getVal } from "@/app/config/defaultTransitionConfig";
import store from "@/app/store";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import * as React from "react";
import Svg, { SvgProps, Path, Rect, Mask } from "react-native-svg";
const TessStatusDeco = (
  props: SvgProps & { color1: string; color2: string; color3: string }
) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  return (
    <Svg
      width={36}
      height={33}
      viewBox="0 0 36 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M17 .577a2 2 0 012 0l5.794 3.346a2 2 0 011 1.732v6.69a2 2 0 01-1 1.732L19 17.423a2 2 0 01-2 0l-5.794-3.346a2 2 0 01-1-1.732v-6.69a2 2 0 011-1.732L17 .577z"
        fill={getVal(props.color1, globalStyle.color)}
      />
      <Path
        d="M26 15.577a2 2 0 012 0l5.794 3.346a2 2 0 011 1.732v6.69a2 2 0 01-1 1.732L28 32.423a2 2 0 01-2 0l-5.794-3.346a2 2 0 01-1-1.732v-6.69a2 2 0 011-1.732L26 15.577z"
        fill={getVal(props.color2, globalStyle.successColor)}
      />
      <Path
        d="M8 15.577a2 2 0 012 0l5.794 3.346a2 2 0 011 1.732v6.69a2 2 0 01-1 1.732L10 32.423a2 2 0 01-2 0l-5.794-3.346a2 2 0 01-1-1.732v-6.69a2 2 0 011-1.732L8 15.577z"
        fill={getVal(props.color3, globalStyle.errorColor)}
      />
    </Svg>
  );
};

export { TessStatusDeco };
