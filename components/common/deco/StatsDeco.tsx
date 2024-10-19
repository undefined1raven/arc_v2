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
const StatsDeco = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [opacityArray, setOpacityArray] = React.useState([]);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={8}
      height={15}
      viewBox="0 0 8 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        y={15}
        width={4}
        height={2}
        rx={1}
        transform="rotate(-90 0 15)"
        fill={colorActual}
      />
      <Rect
        x={3}
        y={15}
        width={11}
        height={2}
        rx={1}
        transform="rotate(-90 3 15)"
        fill={colorActual}
      />
      <Rect
        x={6}
        y={15}
        width={15}
        height={2}
        rx={1}
        transform="rotate(-90 6 15)"
        fill={colorActual}
      />
    </Svg>
  );
};

export { StatsDeco };
