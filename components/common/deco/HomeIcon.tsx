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
} from "react-native-svg";
const HomeIcon = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [opacityArray, setOpacityArray] = React.useState([]);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={30}
      height={37}
      viewBox="0 0 30 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path stroke={colorActual} d="M4.5 15.5H25.5V36.5H4.5z" />
      <Path d="M3.142 13.75L15 .742 26.858 13.75H3.142z" stroke={colorActual} />
      <Path stroke={colorActual} d="M7.5 18.5H10.5V21.5H7.5z" />
      <Path stroke={colorActual} d="M10.5 18.5H13.5V21.5H10.5z" />
      <Path stroke={colorActual} d="M7.5 21.5H10.5V24.5H7.5z" />
      <Path stroke={colorActual} d="M10.5 21.5H13.5V24.5H10.5z" />
      <Path d="M13 33a2 2 0 114 0v4h-4v-4z" fill={colorActual} />
    </Svg>
  );
};

export { HomeIcon };
