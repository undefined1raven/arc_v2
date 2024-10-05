import store from "@/app/store";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { Mask } from "@shopify/react-native-skia";
import * as React from "react";
import Svg, { SvgProps, Path, Rect } from "react-native-svg";
const PadlockIcon = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg width={8} height={11} viewBox="0 0 8 11" fill="none" {...props}>
      <Path
        d="M6.602 3.6c.33 0 .603-.27.548-.596a3.6 3.6 0 00-7.1 0c-.055.326.218.596.548.596v0c.33 0 .591-.272.673-.592a2.403 2.403 0 014.658 0c.082.32.342.592.673.592v0z"
        fill={colorActual}
        stroke={colorActual}
        strokeWidth={2}
        mask="url(#a)"
      />
      <Rect
        x={0.5}
        y={4.29999}
        width={6.2}
        height={6.2}
        rx={0.5}
        stroke={colorActual}
      />
      <Rect
        x={2.69941}
        y={7.69996}
        width={1.8}
        height={0.6}
        rx={0.3}
        stroke={colorActual}
        strokeWidth={0.6}
      />
    </Svg>
  );
};

export { PadlockIcon };
