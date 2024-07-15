import store from "@/app/store";
import { GlobalStyleType } from "@/hooks/globalStyles";
import * as React from "react"
import { View } from "react-native";
import Svg, { SvgProps, Path, Rect } from "react-native-svg"
import { useSelector } from "react-redux";
const SvgComponent = (props: SvgProps) => {
    store.subscribe(() => { });
    const globalStyle: GlobalStyleType = useSelector(store => store.globalStyle);
    const colorActual = props.color ? props.color : globalStyle.color;
    return (
        // <View style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, alignItems: 'center', justifyContent: 'space-around' }}>
        <Svg
            viewBox="0 0 148 50"
            fill="none"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M20.654 4.193a1.442 1.442 0 112.614 1.217L3.835 47.085a2.534 2.534 0 01-2.297 1.463.99.99 0 01-.867-1.409L20.654 4.193z"
                fill={colorActual}
            />
            <Path
                d="M20.973 4.624a1.223 1.223 0 011.108-1.74h.091a1.84 1.84 0 011.668 1.063l20.23 43.382a.897.897 0 01-.838 1.219h-.194c-.966 0-1.844-.56-2.252-1.435L20.973 4.624z"
                fill={colorActual}
            />
            <Rect
                x={58.2303}
                width={2.88462}
                height={49.0385}
                rx={1.44231}
                fill={colorActual}
            />
            <Rect
                x={58.2303}
                y={2.88464}
                width={2.88462}
                height={31.7308}
                rx={1.44231}
                transform="rotate(-90 58.23 2.885)"
                fill={colorActual}
            />
            <Path
                d="M138.779 8.26c.595-.596.598-1.565-.033-2.122a24.52 24.52 0 00-36.614 4.76A24.52 24.52 0 00138.746 42.9c.631-.557.628-1.527.033-2.122-.596-.596-1.558-.591-2.194-.04a21.47 21.47 0 110-32.44c.636.551 1.598.556 2.194-.04z"
                fill={colorActual}
            />
        </Svg>
        // </View>
    )
}
export { SvgComponent as ARCLogo }
