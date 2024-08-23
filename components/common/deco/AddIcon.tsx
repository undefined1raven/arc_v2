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
} from "react-native-svg";
import { useSelector } from "react-redux";
const AddIcon = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  const [opacityArray, setOpacityArray] = React.useState([]);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect x={5.5} width={1} height={12} rx={0.5} fill={colorActual} />
      <Rect
        y={6.5}
        width={1}
        height={12}
        rx={0.5}
        transform="rotate(-90 0 6.5)"
        fill={colorActual}
      />
    </Svg>
  );
};

export { AddIcon };
