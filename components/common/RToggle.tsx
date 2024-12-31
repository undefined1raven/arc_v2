import FigmaImporter from "../../fn/figmaImporter";
import FigmaImportConfig from "../../fn/FigmaImportConfig";
import RBox from "./RBox";
import { ColorValueHex } from "./CommonTypes";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getVal } from "@/app/config/defaultTransitionConfig";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import RButton from "./RButton";
import React, { useEffect, useState } from "react";
import { getWithTimingConfig } from "@/constants/animationConfig";

type RToggleProps = {
  id?: string;
  children?: any;
  entering?: object;
  figmaImport?: object;
  borderWidth?: number;
  color?: ColorValueHex;
  borderColor?: ColorValueHex;
  backgroundColor?: ColorValueHex;
  width?: number | string;
  height?: number | string;
  top?: number | string;
  left?: number | string;
  transitionIndex?: number;
  opacity?: number;
  style?: object;
  blur?: number;
  borderRadius?: number;
  figmaImportConfig?: object;
  transitions?: string | object;
  defaultToggled?: boolean;
  value?: boolean;
  thumbColor?: ColorValueHex;
  thumbColorInactive?: ColorValueHex;
  onToggle?: (value: boolean) => void;
};

function RToggle(props: RToggleProps) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [toggled, setToggled] = useState(getVal(props.defaultToggled, false));
  const AnimatedBox = Animated.createAnimatedComponent(React.forwardRef(RBox));
  const animatedLeft = useSharedValue<number>(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: animatedLeft.value + "%",
    };
  });
  useEffect(() => {
    if (props.value !== undefined) {
      setToggled(props.value);
    }
  }, [props.value]);

  function getFigmaImportValues() {
    if (props.figmaImport) {
      if (Object.keys(props.figmaImport).length > 0) {
        return {
          ...FigmaImporter(
            props.figmaImport,
            props.figmaImportConfig === undefined
              ? FigmaImportConfig()
              : props.figmaImportConfig
          ),
        };
      } else {
        return {};
      }
    } else {
      return {};
    }
  }
  return (
    <Animated.View
      id={getVal(props.id, undefined)}
      style={{
        flex: 1,
        position: "absolute",
        display: "flex",
        alignSelf: "center",
        borderRadius: getVal(props.borderRadius, 5),
        borderColor: getVal(props.borderColor, globalStyle.color),
        borderWidth: getVal(props.borderWidth, 0),
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "",
        width: getVal(props.width, 100),
        left: getVal(props.left, 0),
        top: getVal(props.top, 0),
        height: getVal(props.height, 44),
        opacity: getVal(props.opacity, 1),
        ...getFigmaImportValues(),
        ...props.style,
      }}
    >
      <>
        <RBox
          backgroundColor={globalStyle.color + (toggled ? "50" : "10")}
          width="100%"
          height="100%"
        ></RBox>
        <RButton
          onClick={() => {
            setToggled(!toggled);
            if (!toggled) {
              animatedLeft.value = withTiming(70, getWithTimingConfig());
            } else {
              animatedLeft.value = withTiming(0, getWithTimingConfig());
            }

            if (props.onToggle) {
              props.onToggle(!toggled);
            }
          }}
          backgroundColor={getVal(
            props.backgroundColor,
            `${globalStyle.color}20`
          )}
          androidRippleColor={getVal(
            props.backgroundColor,
            `${globalStyle.color}20`
          )}
          width="100%"
          height="100%"
        >
          <Animated.View
            style={[
              {
                width: "30%",
                height: "100%",
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: toggled
                  ? getVal(props.thumbColor, globalStyle.color)
                  : getVal(props.thumbColorInactive, globalStyle.color + "60"),
              },
              animatedStyle,
            ]}
          ></Animated.View>
        </RButton>
      </>
    </Animated.View>
  );
}

export { RToggle };
