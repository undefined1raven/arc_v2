import store from "@/app/store";
import { GlobalStyleType } from "@/hooks/globalStyles";
import * as React from "react"
import { View } from "react-native";
import Svg, { SvgProps, Path, Defs, LinearGradient, Stop, G } from "react-native-svg"
import { useSelector } from "react-redux";
const SearchIcon = (props: SvgProps) => {
    store.subscribe(() => { });
    const globalStyle: GlobalStyleType = useSelector(store => store.globalStyle);
    const [opacityArray, setOpacityArray] = React.useState([]);
    const colorActual = props.color ? props.color : globalStyle.color;


    return (
      <Svg
      width={19}
      height={18}
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M11.783 6.142a5.642 5.642 0 11-11.283 0 5.642 5.642 0 0111.283 0z"
        fill={colorActual}
        fillOpacity={0.5}
        stroke={colorActual}
      />
      <Path
        transform="rotate(-44.186 10.236 9.926)"
        fill={colorActual}
        d="M10.2361 9.92584H11.25971V21.185540000000003H10.2361z"
      />
    </Svg>
    )
}

export { SearchIcon }
