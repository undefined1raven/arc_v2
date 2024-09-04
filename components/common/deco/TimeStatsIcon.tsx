import store from "@/app/store";
import { GlobalStyleType } from "@/hooks/globalStyles";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import * as React from "react";
import { View } from "react-native";
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Rect,
  Circle,
} from "react-native-svg";
const TimeStatsIcon = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [opacityArray, setOpacityArray] = React.useState([]);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={26}
      height={28}
      viewBox="0 0 26 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={12.25}
        y={2.25}
        width={0.5}
        height={12.5}
        rx={0.25}
        fill={colorActual}
        stroke={colorActual}
        strokeWidth={0.5}
      />
      <Rect
        x={20.1686}
        y={11.3271}
        width={0.5}
        height={8.67518}
        rx={0.25}
        transform="rotate(67.298 20.169 11.327)"
        fill={colorActual}
        stroke={colorActual}
        strokeWidth={0.5}
      />
      <Circle cx={13} cy={13} r={12.5} stroke={colorActual} />
      <Rect
        x={3}
        y={28}
        width={4}
        height={2}
        rx={1}
        transform="rotate(-90 3 28)"
        fill={colorActual}
      />
      <Rect
        x={6}
        y={28}
        width={11}
        height={2}
        rx={1}
        transform="rotate(-90 6 28)"
        fill={colorActual}
      />
      <Rect
        x={9}
        y={28}
        width={15}
        height={2}
        rx={1}
        transform="rotate(-90 9 28)"
        fill={colorActual}
      />
    </Svg>
  );
};

export { TimeStatsIcon };
