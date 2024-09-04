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
const DayPlannerIcon = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [opacityArray, setOpacityArray] = React.useState([]);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={18}
      height={34}
      viewBox="0 0 18 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect x={0.5} y={2.5} width={9} height={9} rx={1.5} stroke={colorActual} />
      <Rect x={8.5} y={13.5} width={9} height={9} rx={1.5} stroke={colorActual} />
      <Rect x={1.5} y={24.5} width={9} height={9} rx={1.5} stroke={colorActual} />
      <Rect
        x={2.37231}
        y={6.10867}
        width={1}
        height={4.88648}
        rx={0.5}
        transform="rotate(-38.815 2.372 6.109)"
        fill={colorActual}
      />
      <Rect
        x={10.5591}
        y={0.815491}
        width={1}
        height={10.2977}
        rx={0.5}
        transform="rotate(34.142 10.56 .815)"
        fill={colorActual}
      />
      <Path fill={colorActual} d="M12 17H14V19H12z" />
      <Path fill={colorActual} d="M5 28H7V30H5z" />
    </Svg>
  );
};

export { DayPlannerIcon };
