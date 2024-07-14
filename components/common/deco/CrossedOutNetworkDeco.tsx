import * as React from "react"
import Svg, { SvgProps, Path, Rect } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={13}
    fill="none"
    {...props}
  >
    <Path
      fill={props.color}
      d="M5 12.293V.5a.5.5 0 0 0-1 0V9a.828.828 0 0 1-1.414.586L2.5 9.5a.707.707 0 0 0-1 1l2.293 2.293a.707.707 0 0 0 1.207-.5ZM7 .707V12.5a.5.5 0 0 0 1 0V4a.828.828 0 0 1 1.414-.586L9.5 3.5a.707.707 0 0 0 1-1L8.207.207A.707.707 0 0 0 7 .707Z"
    />
    <Rect
      width={1}
      height={17.282}
      y={0.707}
      fill={props.color}
      rx={0.5}
      transform="rotate(-45 0 .707)"
    />
  </Svg>
)
export { SvgComponent as CrossedOutNetworkDeco }