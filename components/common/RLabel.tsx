import { Pressable, View, Text, Button, useWindowDimensions } from "react-native";
import { AlignType, ColorValueHex, FontSize } from "./CommonTypes";
import { useEffect, useRef, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import FigmaImporter from '../../fn/figmaImporter'
import FigmaImportConfig from '../../fn/FigmaImportConfig'
import Animated, { Easing, withSpring, withTiming } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';
import store from "@/app/store";
import globalStyles, { GlobalStyleType } from "@/hooks/globalStyles";
import { useSelector } from "react-redux";
import { fontController } from '../../fn/fontController';
import { BlurView } from "expo-blur";
type RButtonProps = {
    id?: string,
    children?: any,
    text?: string,
    figmaImport?: object,
    borderWidth?: number,
    color?: ColorValueHex,
    borderColor?: ColorValueHex,
    backgroundColor?: ColorValueHex,
    width?: number | string,
    height?: number | string,
    top?: number | string,
    left?: number | string,
    fontSize?: number | FontSize,
    align?: AlignType,
    opacity?: number,
    style?: object,
    blur?: number,
    borderRadius?: number,
    alignPadding?: number | string,
    horizontalCenter?: boolean,
    verticalCenter?: boolean,
    figmaImportConfig?: object,
    transitions?: string | object,
}



export default function RLabel(props: RButtonProps) {
    //Internal state
    const { height, width } = useWindowDimensions();
    const p50Width = 0.5 * width;
    const p50Height = 0.5 * height;
    store.subscribe(() => { });
    const globalStyle: GlobalStyleType = useSelector(store => store.globalStyle);
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
                return { ...FigmaImporter(props.figmaImport, props.figmaImportConfig === undefined ? FigmaImportConfig() : props.figmaImportConfig) }
            } else {
                return {};
            }
        } else {
            return {}
        }
    }
    const [componentWidth, setComponentWidth] = useState(0);
    const [componentHeight, setComponentHeight] = useState(0);
    useEffect(() => {
        labelRef.current.measure((width, height, px, py, fx, fy) => {
            setComponentWidth(width);
            setComponentHeight(height);
        })
    }, [labelRef])
    return (
        <Animated.View
            ref={labelRef}
            id={getVal(props.id, undefined)}
            style={{
                position: 'absolute',
                display: 'flex',
                alignSelf: 'center',
                borderRadius: getVal(props.borderRadius, 5),
                borderColor: getVal(props.borderColor, globalStyle.color),
                borderWidth: getVal(props.borderWidth, 0),
                backgroundColor: getVal(props.backgroundColor, `${globalStyle.color}00`),
                alignContent: 'center',
                justifyContent: 'center',
                width: getVal(props.width, 100),
                left: getVal(props.left, 0),
                top: getVal(props.top, 0),
                height: getVal(props.height, 44),
                opacity: getVal(props.opacity, 1),
                transform: `translateX(${props.horizontalCenter == true ? (componentWidth * -0.5).toString() + 'px' : '0px'}) translateY(${props.verticalCenter == true ? (componentHeight * -0.5).toString() + 'px' : '0px'})`,
                ...getFigmaImportValues(),
                ...props.style,
            }}
        >
            <BlurView style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} intensity={getVal(props.blur, 0)}>
                <Text style={{
                    display: 'flex',
                    color: getVal(props.color, globalStyle.textColor),
                    fontSize: fontController(getVal(props.fontSize, globalStyle.regularMobileFont)),
                    justifyContent: getVal(props.align, 'center'),
                    textAlign: getVal(props.align, 'center'),
                    alignItems: getVal(props.align, 'center'),
                    paddingLeft: getVal(props.align === 'left' || props.align === 'right' ? (props.alignPadding ? props.alignPadding : '2%') : '0%', '0%'),
                    paddingRight: getVal(props.align === 'right' || props.align === 'end' ? (props.alignPadding ? props.alignPadding : '2%') : '0%', '0%'),

                }}
                >{props.text}</Text>
                {props.children}
            </BlurView>
        </Animated.View>

    );
}

