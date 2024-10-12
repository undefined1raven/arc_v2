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
const FingerprintDeco = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={26}
      height={29}
      viewBox="0 0 26 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.469 3.188a10.937 10.937 0 0116.969 9.124c0 4.259-.811 8.326-2.287 12.058M4.374 6.28a10.886 10.886 0 00-1.811 6.032c.003 2.061-.578 4.08-1.677 5.824m2.9 5.19a16.346 16.346 0 004.246-11.014 5.469 5.469 0 0110.937 0c0 .769-.03 1.53-.093 2.283M13.5 12.312a21.787 21.787 0 01-5.25 14.22m9.674-6.703a27.222 27.222 0 01-3.624 7.773"
        stroke={colorActual}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export { FingerprintDeco };
