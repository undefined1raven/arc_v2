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
const PersonalDiaryIcon = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [opacityArray, setOpacityArray] = React.useState([]);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={21}
      height={25}
      viewBox="0 0 21 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.5 1A.5.5 0 011 .5h10.634a.5.5 0 01.354.146l3.54 3.541 3.54 3.54a.5.5 0 01.147.354v15.015a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5V1z"
        stroke={colorActual}
      />
      <Rect x={3} y={9} width={11} height={1} rx={0.5} fill={colorActual} />
      <Rect x={3} y={11} width={11} height={1} rx={0.5} fill={colorActual} />
      <Rect x={3} y={13} width={7} height={1} rx={0.5} fill={colorActual} />
      <Rect x={3} y={3} width={4} height={1} rx={0.5} fill={colorActual} />
      <Rect x={3} y={21} width={2} height={1} rx={0.5} fill={colorActual} />
      <Rect x={6} y={21} width={2} height={1} rx={0.5} fill={colorActual} />
      <Path
        d="M19.122 4.495a.586.586 0 11.99.625l-6.56 10.403-.991-.625 6.56-10.403zM11.495 17.688l.743-2.129.858.542-1.6 1.587z"
        fill={colorActual}
      />
    </Svg>
  );
};

export { PersonalDiaryIcon };
