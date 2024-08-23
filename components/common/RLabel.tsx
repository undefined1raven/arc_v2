import {
  Pressable,
  View,
  Text,
  Button,
  useWindowDimensions,
} from "react-native";
import { AlignType, ColorValueHex, FontSize } from "./CommonTypes";
import { useEffect, useRef, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import FigmaImporter from "../../fn/figmaImporter";
import FigmaImportConfig from "../../fn/FigmaImportConfig";
import Animated, {
  Easing,
  FadeInDown,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";
import store from "@/app/store";
import globalStyles, { GlobalStyleType } from "@/hooks/globalStyles";
import { useSelector } from "react-redux";
import { fontController } from "../../fn/fontController";
import { BlurView } from "expo-blur";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useFonts } from "expo-font";
import { Oxanium_400Regular } from "@expo-google-fonts/oxanium";
import { IBMPlexMono_400Regular } from "@expo-google-fonts/ibm-plex-mono";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
type RButtonProps = {
  id?: string;
  fontType?: "regular" | "mono";
  children?: any;
  text?: string;
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
  fontSize?: number | FontSize;
  align?: AlignType;
  opacity?: number;
  style?: object;
  blur?: number;
  borderRadius?: number;
  alignPadding?: number | string;
  horizontalCenter?: boolean;
  verticalCenter?: boolean;
  verticalAlign?: "top" | "bottom" | "center";
  figmaImportConfig?: object;
  transitions?: string | object;
};

export default function RLabel(props: RButtonProps) {
  //Internal state
  let [fontsLoaded] = useFonts({
    Oxanium_400Regular,
    IBMPlexMono_400Regular,
  });
  const [currentFontFamiliy, setCurrentFontFamiliy] =
    useState("Oxanium_400Regular");
  const { height, width } = useWindowDimensions();
  const p50Width = 0.5 * width;
  const p50Height = 0.5 * height;
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  const labelRef = useRef(null);
  function getVal(value: any, defaultVal: any) {
    if (value !== undefined) {
      return value;
    } else {
      return defaultVal;
    }
  }

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
  const [componentWidth, setComponentWidth] = useState(0);
  const [componentHeight, setComponentHeight] = useState(0);
  useEffect(() => {
    if (props.fontType) {
      if (props.fontType === "mono") {
        setCurrentFontFamiliy("IBMPlexMono_400Regular");
      } else {
        setCurrentFontFamiliy("Oxanium_400Regular");
      }
    } else {
      setCurrentFontFamiliy("Oxanium_400Regular");
    }
  }, [fontsLoaded]);
  useEffect(() => {
    labelRef.current.measure((width, height, px, py, fx, fy) => {
      setComponentWidth(width);
      setComponentHeight(height);
    });
  }, [labelRef]);
  return (
    <Animated.View
      // entering={getVal(props.entering, globalEnteringConfig())}
      ref={labelRef}
      id={getVal(props.id, undefined)}
      style={{
        flex: 1,
        position: "absolute",
        display: "flex",
        alignSelf: "center",
        borderRadius: getVal(props.borderRadius, 5),
        borderColor: getVal(props.borderColor, globalStyle.color),
        borderWidth: getVal(props.borderWidth, 0),
        backgroundColor: getVal(
          props.backgroundColor,
          `${globalStyle.color}00`
        ),
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "",
        width: getVal(props.width, 100),
        left: getVal(props.left, 0),
        top: getVal(props.top, 0),
        height: getVal(props.height, 44),
        opacity: getVal(props.opacity, 1),
        transform: `translateX(${
          props.horizontalCenter == true
            ? (componentWidth * -0.5).toString() + "px"
            : "0px"
        }) translateY(${
          props.verticalCenter == true
            ? (componentHeight * -0.5).toString() + "px"
            : "0px"
        })`,
        ...getFigmaImportValues(),
        ...props.style,
      }}
    >
      {/* <BlurView style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', ...styles.b }} intensity={getVal(props.blur, 0)}> */}
      <Text
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: "auto",
          width: "100%",
          height: "100%",
          textAlignVertical: getVal(props.verticalAlign, "top"),
          alignItems: "center",
          color: getVal(props.color, globalStyle.textColor),
          fontSize: fontController(
            getVal(props.fontSize, globalStyle.regularMobileFont)
          ),
          justifyContent: getVal(props.align, "center"),
          textAlign: getVal(props.align, "center"),
          fontFamily: currentFontFamiliy,
          paddingLeft: getVal(
            props.align === "left" || props.align === "right"
              ? props.alignPadding
                ? props.alignPadding
                : "2%"
              : "0%",
            "0%"
          ),
          paddingRight: getVal(
            props.align === "right" || props.align === "end"
              ? props.alignPadding
                ? props.alignPadding
                : "2%"
              : "0%",
            "0%"
          ),
        }}
      >
        {props.text}
      </Text>
      {props.children}
      {/* </BlurView> */}
    </Animated.View>
  );
}

const styles = {
  b: { backdropFilter: "" },
};
