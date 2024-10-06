import store from "@/app/store";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import * as React from "react";
import Svg, { SvgProps, Path, Rect } from "react-native-svg";
const EditDeco = (props: SvgProps) => {
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const colorActual = props.color ? props.color : globalStyle.color;
  
  return (
    <Svg
      width={14}
      height={20}
      viewBox="0 0 14 20"
      fill="none"
      {...props}
    >
      <Path
        d="M11.602.708a.837.837 0 011.416.892L3.645 16.462l-1.416-.893L11.602.708zM.707 19.554l1.061-3.04 1.226.772-2.287 2.268z"
        fill={colorActual}
      />
    </Svg>
  );
};

export { EditDeco };
