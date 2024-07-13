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


type RButtonProps = {
    id?: string,
    onClick?: Function,
    figmaImport?: object,
    label?: string,
    androidRippleColor: ColorValueHex,
    className?: string | string[], color?: ColorValueHex, borderColor?: ColorValueHex, backgroundColor?: ColorValueHex, width?: number | string, height?: number | string, top?: number | string, left?: number | string, mobileFontSize?: number | FontSize, align?: AlignType, opacity?: number, style?: object, blur?: number, borderRadius?: number, alignPadding?: number | string, hoverOpacityMax?: string, hoverOpacityMin?: string, horizontalCenter?: boolean, verticalCenter?: boolean, figmaImportConfig?: object, mouseEnter?: Function, mouseLeave?: Function, transitions?: string | object, isSelected?: boolean, onLongPress?: Function
}



export default function RButton(props: RButtonProps) {
    //Internal state
    store.subscribe(() => { });
    const globalStyle: GlobalStyleType = useSelector(store => store.globalStyle);

    const [isMouseHovering, setIsMouseHovering] = useState(false);
    const alignToPadding = { start: 'left', end: 'right', right: 'right', left: 'left' };
    const { height, width } = useWindowDimensions();

    let align = props.align ? props.align : 'center';
    let hoverOpacityMax = props.hoverOpacityMax ? props.hoverOpacityMax : '20';
    let hoverOpacityMin = props.hoverOpacityMin ? props.hoverOpacityMin : '00';
    let backgroundColorActual = props.backgroundColor ? props.backgroundColor : globalStyle.color;
    const [backgroundOpacityActual, setBackgroundOpacityActual] = useState(hoverOpacityMin);

    function parsePresetTop() {
        if (props.figmaImport) {
            const figmaTop = props.figmaImport?.mobile?.top;
            if (figmaTop !== undefined) {
                const figmaTopNumber = parseFloat(figmaTop);
                const figmaTopStr = figmaTop.toString();
                if (isNaN(figmaTopNumber) === false) {
                    const strLen = figmaTopStr.length;
                    if (figmaTopStr[strLen - 1] === '%') {
                        return parseFloat((figmaTopNumber * 100 / height).toFixed(2))
                    } else {
                        return figmaTopNumber

                    }
                }
            }
        }
        const manualTop = props.top;
        if (manualTop) {
            const manualTopStr = manualTop.toString();
            const manualTopNumber = parseFloat(manualTopStr);
            if (isNaN(manualTopNumber) === false) {
                const strLen = manualTopStr.length;
                if (manualTopStr[strLen - 1] === '%') {
                    return parseFloat((manualTopNumber * 100 / height).toFixed(2))

                } else {
                    return manualTopNumber
                }
            }
        }
        return 0;
    }

    const xx = useSharedValue(parsePresetTop() - 5);
    useEffect(() => {
        // console.log(parsePresetTop())
        if (isMouseHovering) {
            setBackgroundOpacityActual(hoverOpacityMax.toString());
        } else {
            setBackgroundOpacityActual(hoverOpacityMin.toString());
        }
    }, [props.backgroundColor, isMouseHovering])

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

    const textColor = props.color ? props.color : globalStyle.textColor;
    const buttonRef = useRef(null);

    useEffect(() => {
        const buttonTop = buttonRef.current.measure((w, h, px, py, fx, fy) => {
            xx.value = withTiming(fy + 5, { easing: Easing.out(Easing.quad), duration: 200 })
        })
    }, [buttonRef])

    return (
        <Animated.View
            ref={buttonRef}
            style={{
                position: 'absolute',
                borderRadius: getVal(props.borderRadius, globalStyle.borderRadius),
                borderColor: getVal(props.borderColor, globalStyle.color),
                borderWidth: 1,
                backgroundColor: `${backgroundColorActual}${backgroundOpacityActual}`,
                alignContent: 'center',
                justifyContent: 'center',
                width: getVal(props.width, 0),
                left: getVal(props.left, 0),
                height: getVal(props.height, 44),
                top: getVal(xx, 44),
                ...getFigmaImportValues(),
                ...props.style,
            }}
        >
            {props.children}
            <Pressable
                android_ripple={{ color: props.androidRippleColor ? props.androidRippleColor : '#11111110' }}
                style={{ width: '100%', height: '100%' }}
                onPressIn={() => setIsMouseHovering(true)}
                onLongPress={(e) => { props.onLongPress?.call(e); setIsMouseHovering(false); }}
                onPressOut={(e) => { props.onClick?.call(e); setIsMouseHovering(false); }}>
                <Text style={{ textAlign: 'center', justifyContent: 'center', alignContent: 'center', top: 'auto', fontSize: 18, color: getVal(props.color, globalStyle.textColor) }}>{props.label}</Text>
            </Pressable>
        </Animated.View >

    );
}

