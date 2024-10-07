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
const TrashIcon = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [opacityArray, setOpacityArray] = React.useState([]);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={16}
      height={18}
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.158 6.625l-.288 7.5m-3.99 0l-.288-7.5m8.306-2.675c.285.044.569.09.852.139m-.852-.139l-.89 11.57a1.875 1.875 0 01-1.87 1.73H4.612a1.875 1.875 0 01-1.87-1.73l-.89-11.57m12.046 0A40.086 40.086 0 0011 3.62m-9.148.33c-.285.043-.569.089-.852.138m.852-.138a40.091 40.091 0 012.898-.33m6.25 0v-.764c0-.983-.758-1.803-1.742-1.834-.922-.03-1.844-.03-2.766 0-.984.03-1.742.852-1.742 1.834v.764m6.25 0c-2.08-.161-4.17-.161-6.25 0"
        stroke={colorActual}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export { TrashIcon };
