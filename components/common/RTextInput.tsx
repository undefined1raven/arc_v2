import {
  Pressable,
  View,
  Text,
  Button,
  useWindowDimensions,
  Keyboard,
} from "react-native";
import { AlignType, ColorValueHex, FontSize } from "./CommonTypes";
import { useEffect, useRef, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import FigmaImporter from "../../fn/figmaImporter";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { fontController } from "../../fn/fontController";
import FigmaImportConfig from "../../fn/FigmaImportConfig";
import Animated, {
  Easing,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";
import store from "@/app/store";
import globalStyles, { GlobalStyleType } from "@/hooks/globalStyles";
import {
  GestureHandlerRootView,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

type RButtonProps = {
  id?: string;
  children?: any;
  textAlignVertical: "center" | "top" | "bottom";
  readOnly?: boolean;
  onClick?: Function;
  onInput: Function;
  fontSize: number;
  figmaImport?: object;
  maxLength: number;
  textContentType?: string;
  label?: string;
  multiline?: boolean;
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "phone-pad"
    | "url";
  placeholderTextColor: ColorValueHex;
  cursorColor?: ColorValueHex;
  borderWidth?: number;
  returnKeyType: "done" | "go" | "next" | "search" | "send";
  childrenStyle?: object;
  secureTextEntry?: boolean;
  androidRippleColor?: ColorValueHex;
  className?: string | string[];
  color?: ColorValueHex;
  borderColor?: ColorValueHex;
  backgroundColor?: ColorValueHex;
  width?: number | string;
  height?: number | string;
  top?: number | string;
  placeholder?: string;
  left?: number | string;
  mobileFontSize?: number | FontSize;
  align?: AlignType;
  opacity?: number;
  style?: object;
  defaultValue?: string;
  blur?: number;
  borderRadius?: number;
  alignPadding?: number | string;
  hoverOpacityMax?: string;
  hoverOpacityMin?: string;
  horizontalCenter?: boolean;
  verticalCenter?: boolean;
  value?: string;
  figmaImportConfig?: object;
  mouseEnter?: Function;
  mouseLeave?: Function;
  transitions?: string | object;
  autoFocus?: boolean;
  isSelected?: boolean;
  onLongPress?: Function;
};

export default function RTextInput(props: RButtonProps) {
  //Internal state
  const { height, width } = useWindowDimensions();
  store.subscribe(() => {});
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  let align = props.align ? props.align : "center";
  let hoverOpacityMax = props.hoverOpacityMax ? props.hoverOpacityMax : "20";
  let hoverOpacityMin = props.hoverOpacityMin ? props.hoverOpacityMin : "00";
  let backgroundColorActual = props.backgroundColor
    ? props.backgroundColor
    : globalStyle.color;
  const [backgroundOpacityActual, setBackgroundOpacityActual] =
    useState(hoverOpacityMin);
  const [valueActual, setValueActual] = useState(props.defaultValue);

  useEffect(() => {
    setValueActual(props.value);
  }, [props.value]);

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

  const buttonRef = useRef(null);

  return (
    <Animated.View
      ref={buttonRef}
      style={{
        position: "absolute",
        borderRadius: getVal(props.borderRadius, 5),
        borderColor: getVal(props.borderColor, globalStyle.color),
        borderWidth: getVal(props.borderWidth, 1),
        backgroundColor: `${backgroundColorActual}${backgroundOpacityActual}`,
        alignContent: "center",
        justifyContent: "center",
        width: getVal(props.width, 80),
        left: getVal(props.left, 0),
        top: getVal(props.top, 0),
        height: getVal(props.height, 44),
        ...getFigmaImportValues(),
        ...props.style,
      }}
    >
      <GestureHandlerRootView
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          padding: 0,
          margin: 0,
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            placeholderTextColor={getVal(
              props.placeholderTextColor,
              globalStyle.colorInactive
            )}
            value={getVal(valueActual, "")}
            onFocus={() => {
              setBackgroundOpacityActual(hoverOpacityMax);
            }}
            onBlur={() => {
              setBackgroundOpacityActual(hoverOpacityMin);
            }}
            multiline={getVal(props.multiline, false)}
            returnKeyType={getVal(props.returnKeyType, "done")}
            maxLength={getVal(props.maxLength, 10000)}
            readOnly={getVal(props.readOnly, false)}
            textAlignVertical={getVal(props.textAlignVertical, "center")}
            cursorColor={getVal(props.cursorColor, globalStyle.textColor)}
            onChangeText={(e) => {
              setValueActual(e);
              getVal(props.onInput(e), () => {});
            }}
            autoFocus={getVal(props.autoFocus, false)}
            defaultValue={getVal(props.defaultValue, "")}
            placeholder={getVal(props.placeholder, "")}
            keyboardType={getVal(props.keyboardType, "default")}
            textContentType={getVal(props.textContentType, "none")}
            secureTextEntry={getVal(props.secureTextEntry, false)}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              left: 0,
              top: 0,
              padding: 0,
              margin: 0,
              color: getVal(props.color, globalStyle.textColor),
              display: "flex",
              fontSize: fontController(
                getVal(props.fontSize, globalStyle.regularMobileFont)
              ),
              justifyContent: getVal(props.align, "left"),
              textAlign: getVal(props.align, "left"),
              alignItems: getVal(props.align, "left"),
              paddingLeft: getVal(
                props.align === "left" || props.align === "right"
                  ? props.alignPadding
                    ? props.alignPadding
                    : "2%"
                  : "0%",
                "2%"
              ),
              paddingRight: getVal(
                props.align === "right" || props.align === "end"
                  ? props.alignPadding
                    ? props.alignPadding
                    : "2%"
                  : "0%",
                "2%"
              ),
              ...props.childrenStyle,
            }}
          ></TextInput>
        </ScrollView>
      </GestureHandlerRootView>
      {props.children}
    </Animated.View>
  );
}
