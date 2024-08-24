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
const BackupFileDeco = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [opacityArray, setOpacityArray] = React.useState([]);
  const colorActual = props.color ? props.color : globalStyle.color;

  return (
    <Svg
      width={25}
      height={50}
      viewBox="0 0 25 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G fillOpacity={0.5}>
        <Path
          d="M12.35 46.784L3.22 33.383h18.26l-9.13 13.4z"
          fill="url(#paint0_linear_78_150)"
        />
        <Path
          d="M12.35 48.366l-9.13-13.4h18.26l-9.13 13.4z"
          fill="url(#paint1_linear_78_150)"
        />
        <Path
          d="M12.35 50L3.22 36.599h18.26L12.35 50z"
          fill="url(#paint2_linear_78_150)"
        />
      </G>
      <Path
        d="M.5.5h14.353L19.5 5.145l4.645 4.646v19.83H.5V.5z"
        fill={colorActual}
        fillOpacity={0.2}
        stroke={colorActual}
      />
      <G fill={colorActual}>
        <Path d="M10.466 11.145a1 1 0 01-1-1V7.626a1 1 0 011-1h2.519a1 1 0 011 1v2.519a1 1 0 01-1 1h-2.519zM11.446 12.306v1.506h-2.26a.753.753 0 110-1.506h2.26zM12.048 13.812v-1.506h2.26a.753.753 0 010 1.506h-2.26zM11.446 14.716v1.506h-2.26a.753.753 0 110-1.506h2.26zM12.048 16.222v-1.506h2.26a.753.753 0 110 1.506h-2.26zM11.446 17.125v1.506h-2.26a.753.753 0 110-1.506h2.26zM12.048 18.632v-1.506h2.26a.753.753 0 110 1.506h-2.26zM11.446 19.535v1.506h-2.26a.753.753 0 010-1.506h2.26zM12.048 21.041v-1.506h2.26a.753.753 0 010 1.506h-2.26zM11.446 21.945v1.506h-2.26a.753.753 0 110-1.506h2.26zM12.048 23.45v-1.505h2.26a.753.753 0 110 1.506h-2.26z" />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_78_150"
          x1={12.3494}
          y1={33.4543}
          x2={12.3494}
          y2={46.3551}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={colorActual} />
          <Stop offset={1} stopColor={colorActual} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_78_150"
          x1={12.3494}
          y1={35.0366}
          x2={12.3494}
          y2={47.9374}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={colorActual} />
          <Stop offset={1} stopColor={colorActual} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_78_150"
          x1={12.3494}
          y1={36.6704}
          x2={12.3494}
          y2={49.5712}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={colorActual} />
          <Stop offset={1} stopColor={colorActual} stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export { BackupFileDeco };
