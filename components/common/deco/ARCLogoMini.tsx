import store from "@/app/store";
import { GlobalStyleType } from "@/hooks/globalStyles";
import * as React from "react"
import { View } from "react-native";
import Svg, { SvgProps, Path } from "react-native-svg"
import { useSelector } from "react-redux";
const SvgComponent = (props: SvgProps) => {
    store.subscribe(() => { });
    const globalStyle: GlobalStyleType = useSelector(store => store.globalStyle);
    const colorActual = props.color ? props.color : globalStyle.color;
    return (
        <Svg
            viewBox="0 0 25 25"
            fill="none"
            width="100%" 
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M12.089 4.748a.473.473 0 11.857.4L6.571 18.82a.831.831 0 01-.754.48.325.325 0 01-.284-.462l6.556-14.09z"
                fill={colorActual}
            />
            <Path
                d="M12.194 4.89a.401.401 0 01.363-.571h.03c.235 0 .448.135.547.348L19.771 18.9a.294.294 0 01-.275.4h-.063a.815.815 0 01-.74-.47l-6.5-13.94z"
                fill={colorActual}
            />
            <Path
                d="M20.975 4.025a.499.499 0 00-.008-.72 12.5 12.5 0 100 18.39.499.499 0 00.008-.72.533.533 0 00-.736-.008 11.471 11.471 0 110-16.934c.21.192.535.193.736-.008z"
                fill={colorActual}
            />
            <Path
                d="M12.089 4.748a.473.473 0 11.857.4L6.571 18.82a.831.831 0 01-.754.48.325.325 0 01-.284-.462l6.556-14.09z"
                fill={colorActual}
            />
            <Path
                d="M12.194 4.89a.401.401 0 01.363-.571h.03c.235 0 .448.135.547.348L19.771 18.9a.294.294 0 01-.275.4h-.063a.815.815 0 01-.74-.47l-6.5-13.94z"
                fill={colorActual}
            />
            <Path
                d="M20.975 4.025a.499.499 0 00-.008-.72 12.5 12.5 0 100 18.39.499.499 0 00.008-.72.533.533 0 00-.736-.008 11.471 11.471 0 110-16.934c.21.192.535.193.736-.008z"
                fill={colorActual}
            />
        </Svg>
    )
}
export { SvgComponent as ARCLogoMini }
