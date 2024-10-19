import { getVal } from "@/app/config/defaultTransitionConfig";
import store from "@/app/store";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import * as React from "react";
import Svg, { SvgProps, Path, Rect, Mask } from "react-native-svg";
const TessDayClassifierDeco = (
  props: SvgProps & { color1: string; color2: string; color3: string }
) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  return (
    <Svg
      width={18}
      height={34}
      viewBox="0 0 18 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        y={34}
        width={34}
        height={3}
        rx={1.5}
        transform="rotate(-90 0 34)"
        fill={getVal(props.color1, globalStyle.color)}
        fillOpacity={0.2}
      />
      <Rect
        y={34}
        width={31}
        height={3}
        rx={1.5}
        transform="rotate(-90 0 34)"
        fill={getVal(props.color1, globalStyle.color)}
      />
      <Rect
        x={5}
        y={34}
        width={34}
        height={3}
        rx={1.5}
        transform="rotate(-90 5 34)"
        fill={getVal(props.color1, globalStyle.color)}
        fillOpacity={0.2}
      />
      <Rect
        x={5}
        y={34}
        width={29}
        height={3}
        rx={1.5}
        transform="rotate(-90 5 34)"
        fill={getVal(props.color1, globalStyle.color)}
      />
      <Rect
        x={10}
        y={34}
        width={34}
        height={3}
        rx={1.5}
        transform="rotate(-90 10 34)"
        fill={getVal(props.color2, globalStyle.colorAccent)}
        fillOpacity={0.2}
      />
      <Rect
        x={10}
        y={34}
        width={22}
        height={3}
        rx={1.5}
        transform="rotate(-90 10 34)"
        fill={getVal(props.color2, globalStyle.colorAccent)}
      />
      <Rect
        x={15}
        y={34}
        width={34}
        height={3}
        rx={1.5}
        transform="rotate(-90 15 34)"
        fill={getVal(props.color3, globalStyle.errorColor)}
        fillOpacity={0.2}
      />
      <Rect
        x={15}
        y={34}
        width={10}
        height={3}
        rx={1.5}
        transform="rotate(-90 15 34)"
        fill={getVal(props.color3, globalStyle.errorColor)}
      />
    </Svg>
  );
};

export { TessDayClassifierDeco };
