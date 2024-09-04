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
const QuestionIcon = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [opacityArray, setOpacityArray] = React.useState([]);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={26}
      height={26}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9.64 8.176V7.52l.72-.56h3.392c1.632 0 2.448.816 2.448 2.448V10.8c0 1.664-.8 2.496-2.4 2.496h-.736v1.344H11.72v-2.56h2.048c.725 0 1.088-.363 1.088-1.088V9.264c0-.725-.363-1.088-1.088-1.088H9.64zM11.608 18v-1.728h1.568V18h-1.568z"
        fill={colorActual}
      />
      <Circle cx={13} cy={13} r={12.5} stroke={colorActual} />
    </Svg>
  );
};

export { QuestionIcon };
