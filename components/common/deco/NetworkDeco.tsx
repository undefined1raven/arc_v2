import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const NetworkDeco = (props: SvgProps) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={10}
        height={13}
        fill="none"
        {...props}
    >
        <Path
            fill={props.color}
            d="M4 12.293V.5a.5.5 0 0 0-1 0V9a.828.828 0 0 1-1.414.586L1.5 9.5a.707.707 0 0 0-1 1l2.293 2.293a.707.707 0 0 0 1.207-.5ZM6 .707V12.5a.5.5 0 0 0 1 0V4a.828.828 0 0 1 1.414-.586L8.5 3.5a.707.707 0 0 0 1-1L7.207.207A.707.707 0 0 0 6 .707Z"
        />
    </Svg>
)
export { NetworkDeco }
