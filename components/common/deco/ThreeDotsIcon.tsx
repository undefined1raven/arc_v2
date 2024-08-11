import store from "@/app/store";
import { GlobalStyleType } from "@/hooks/globalStyles";
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
const ThreeDotsIcon = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle: GlobalStyleType = useSelector(
    (store) => store.globalStyle
  );
  const [opacityArray, setOpacityArray] = React.useState([]);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={32}
      height={8}
      viewBox="0 0 32 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={8} height={8} rx={2} fill={colorActual} />
      <Rect x={12} width={8} height={8} rx={2} fill={colorActual} />
      <Rect x={24} width={8} height={8} rx={2} fill={colorActual} />
    </Svg>
  );
};

export { ThreeDotsIcon };
