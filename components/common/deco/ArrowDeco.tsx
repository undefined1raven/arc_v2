import store from "@/app/store";
import { GlobalStyleType } from "@/hooks/globalStyles";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import * as React from "react";
import { View } from "react-native";
import Svg, { SvgProps, Path, Rect } from "react-native-svg";
const SvgComponent = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const colorActual = props.color ? props.color : globalStyle.color;
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 47 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={0.25}
        y={13.95}
        width={45.5}
        height={0.5}
        rx={0.25}
        fill={colorActual}
        stroke={colorActual}
        strokeWidth={0.5}
      />
      <Rect
        x={32.3907}
        y={0.707092}
        width={0.5}
        height={19.5}
        rx={0.25}
        transform="rotate(-45 32.39 .707)"
        fill={colorActual}
        stroke={colorActual}
        strokeWidth={0.5}
      />
      <Rect
        x={46.1785}
        y={13.7811}
        width={0.501328}
        height={19.5501}
        rx={0.250664}
        transform="rotate(45 46.178 13.781)"
        fill={colorActual}
        stroke={colorActual}
        strokeWidth={0.501328}
      />
    </Svg>
  );
};
export { SvgComponent as ArrowDeco };
