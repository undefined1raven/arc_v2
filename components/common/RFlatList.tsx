import {
  Pressable,
  View,
  StyleSheet,
  Text,
  Button,
  useWindowDimensions,
} from "react-native";
import { AlignType, ColorValueHex, FontSize } from "./CommonTypes";
import { ReactElement, useEffect, useRef, useState } from "react";
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
import { fontController } from "../../fn/fontController";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { Oxanium_400Regular } from "@expo-google-fonts/oxanium";
import { IBMPlexMono_400Regular } from "@expo-google-fonts/ibm-plex-mono";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
type RFlatListProps = {
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
  renderItem: ReactElement;
  emptyComponent?: ReactElement;
  data: object[];
  style?: object;
  blur?: number;
  inverted?: boolean;
  borderRadius?: number;
  alignPadding?: number | string;
  horizontalCenter?: boolean;
  keyExtractor: (item: any, index: number) => string;
  verticalCenter?: boolean;
  verticalAlign?: "top" | "bottom" | "center";
  figmaImportConfig?: object;
  transitions?: string | object;
};

export default function RFlatList(props: RFlatListProps) {
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
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
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

  return (
    <GestureHandlerRootView
      style={{
        position: "absolute",
        alignSelf: "center",
        borderRadius: getVal(props.borderRadius, 5),
        borderColor: getVal(props.borderColor, globalStyle.color),
        borderWidth: getVal(props.borderWidth, 0),
        backgroundColor: getVal(
          props.backgroundColor,
          `${globalStyle.color}00`
        ),
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
      <FlatList
        inverted={getVal(props.inverted, false)}
        showsVerticalScrollIndicator={false}
        style={{
          position: "absolute",
          overflow: "scroll",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
        }}
        renderItem={props.renderItem}
        ListEmptyComponent={props.emptyComponent}
        keyExtractor={props.keyExtractor}
        data={props.data}
      ></FlatList>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
});
