import store from "@/app/store";
import { GlobalStyleType } from "@/hooks/globalStyles";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import * as React from "react";
import { View } from "react-native";
import Svg, {
  SvgProps,
  Path,
  Stop,
  Defs,
  LinearGradient,
} from "react-native-svg";
const SvgComponent = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const colorActual = props.color ? props.color : globalStyle.color;
  return (
    <Svg
      width={41}
      height={83}
      viewBox="0 0 41 83"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M22.153 75.235a2 2 0 01-3.306 0L7.474 58.541c-.904-1.327.047-3.126 1.653-3.126h22.746c1.606 0 2.557 1.799 1.653 3.126L22.153 75.235z"
        fill="url(#paint0_linear_82_2)"
        fillOpacity={0.5}
      />
      <Path
        d="M22.153 77.862a2 2 0 01-3.306 0L7.474 61.17c-.904-1.328.047-3.127 1.653-3.127h22.746c1.606 0 2.557 1.799 1.653 3.127L22.153 77.862z"
        fill="url(#paint1_linear_82_2)"
        fillOpacity={0.5}
      />
      <Path
        d="M22.153 80.574a2 2 0 01-3.306 0L7.474 63.88c-.904-1.327.047-3.126 1.653-3.126h22.746c1.606 0 2.557 1.799 1.653 3.126L22.153 80.574z"
        fill="url(#paint2_linear_82_2)"
        fillOpacity={0.5}
      />
      <Path
        d="M.5 1A.5.5 0 011 .5h23.586a.5.5 0 01.353.146l7.662 7.662 7.662 7.662a.5.5 0 01.146.353V49a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5V1z"
        fill={colorActual}
        fillOpacity={0.2}
        stroke={colorActual}
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_82_2"
          x1={20.5}
          y1={55.534}
          x2={20.5}
          y2={76.9493}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={colorActual} />
          <Stop offset={1} stopColor={colorActual} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_82_2"
          x1={20.5}
          y1={58.1611}
          x2={20.5}
          y2={79.5763}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={colorActual} />
          <Stop offset={1} stopColor={colorActual} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_82_2"
          x1={20.5}
          y1={60.8729}
          x2={20.5}
          y2={82.2881}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={colorActual} />
          <Stop offset={1} stopColor={colorActual} stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
export { SvgComponent as DownloadDeco };
