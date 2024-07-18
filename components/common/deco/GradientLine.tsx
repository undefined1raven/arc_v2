import * as React from "react"
import Svg, { SvgProps, Path, Rect, RadialGradient, Stop, Defs } from "react-native-svg"
import store from "@/app/store";
import { GlobalStyleType } from "@/hooks/globalStyles";
import { useSelector } from "react-redux";


const SvgComponent = (props: SvgProps) => {
  store.subscribe(() => { })
  const globalStyle: GlobalStyleType = useSelector(store => store.globalStyle);
  const colorActual = props.color ? props.color : globalStyle.color;

  (<Svg
    width="100%"
    height="100%"
    viewBox="0 0 360 1"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path fill="url(#paint0_radial_19_577)" d="M0 0H360V1H0z" />
    <Defs>
      <RadialGradient
        id="paint0_radial_19_577"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(-181.50024 1.00103 -.013 -2.35714 181.5 0)"
      >
        <Stop stopColor={colorActual} />
        <Stop offset={1} stopColor={colorActual} stopOpacity={0.15} />
      </RadialGradient>
    </Defs>
  </Svg>)
}

export { SvgComponent as GradientLine }