import { Pressable, View, Text, Button, useWindowDimensions } from "react-native";
import { AlignType, ColorValueHex, FontSize } from "./CommonTypes";
import { useEffect, useRef, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import FigmaImporter from '../../fn/figmaImporter'
import FigmaImportConfig from '../../fn/FigmaImportConfig'
import Animated, { Easing, FadeIn, FadeInDown, FadeInLeft, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';
import store from "@/app/store";
import globalStyles, { GlobalStyleType } from "@/hooks/globalStyles";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { Oxanium_400Regular } from "@expo-google-fonts/oxanium";
import { IBMPlexMono_400Regular } from "@expo-google-fonts/ibm-plex-mono";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import RLabel from "./RLabel";


type RButtonProps = {
    id?: string,
    onClick?: Function,
    fontType?: 'mono' | 'regular',
    figmaImport?: object,
    label?: string,
    transitionDuration?: number,
    transitionIndex?: number,
    verticalAlign?: 'top' | 'bottom' | 'center',
    androidRippleColor: ColorValueHex,
    className?: string | string[], color?: ColorValueHex, borderColor?: ColorValueHex, backgroundColor?: ColorValueHex, width?: number | string, height?: number | string, top?: number | string, left?: number | string, mobileFontSize?: number | FontSize, align?: AlignType, opacity?: number, style?: object, blur?: number, borderRadius?: number, alignPadding?: number | string, hoverOpacityMax?: string, hoverOpacityMin?: string, horizontalCenter?: boolean, verticalCenter?: boolean, figmaImportConfig?: object, mouseEnter?: Function, mouseLeave?: Function, transitions?: string | object, isSelected?: boolean, onLongPress?: Function
}



export default function RButton(props: RButtonProps) {
    //Internal state
    let [fontsLoaded] = useFonts({
        Oxanium_400Regular,
        IBMPlexMono_400Regular
    });
    const [currentFontFamiliy, setCurrentFontFamiliy] = useState('Oxanium_400Regular');
    const verticalAlignToStyle = { top: { top: '0%', transform: 'translateY(0)' }, center: { top: '50%', transform: 'translateY(-5dp)' }, bottom: { top: '100%', transform: 'translateY(-10dp)' } }
    store.subscribe(() => { });
    const globalStyle: GlobalStyleType = useSelector(store => store.globalStyle);

    const [isMouseHovering, setIsMouseHovering] = useState(false);
    const alignToPadding = { start: 'left', end: 'right', right: 'right', left: 'left' };
    const { height, width } = useWindowDimensions();

    let align = props.align ? props.align : 'center';
    let hoverOpacityMax = props.hoverOpacityMax ? props.hoverOpacityMax : '00';
    let hoverOpacityMin = props.hoverOpacityMin ? props.hoverOpacityMin : '00';
    let backgroundColorActual = props.backgroundColor ? props.backgroundColor : globalStyle.color;
    const [backgroundOpacityActual, setBackgroundOpacityActual] = useState(hoverOpacityMin);

    function parsePresetTop() {
        if (props.figmaImport) {
            const figmaTop = props.figmaImport?.mobile?.top;
            if (figmaTop !== undefined) {
                return (parseFloat(getFigmaImportValues().top) / 100) * height;
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

    useEffect(() => {
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
    const [figmaImportActual, setFigmaImportActual] = useState(null);

    function getFigmaImportValues() {
        if (props.figmaImport) {
            if (Object.keys(props.figmaImport).length > 0) {
                return { ...FigmaImporter(props.figmaImport, props.figmaImportConfig === undefined ? FigmaImportConfig() : props.figmaImportConfig) }
            } else {
                return {};
            }
        } else {
            return {};
        }
    }

    const textColor = props.color ? props.color : globalStyle.textColor;
    const buttonRef = useRef(null);

    useEffect(() => {
        getFigmaImportValues();
    }, [])

    useEffect(() => {
        if (props.fontType) {
            if (props.fontType === 'mono') {
                setCurrentFontFamiliy('IBMPlexMono_400Regular');
            } else {
                setCurrentFontFamiliy('Oxanium_400Regular');
            }
        } else {
            setCurrentFontFamiliy('Oxanium_400Regular');
        }
    }, [fontsLoaded])

    return (
        <View
            style={{
                position: 'absolute',
                alignContent: 'center',
                backdropFilter: '',
                justifyContent: 'center',
                width: getVal(props.width, 'auto'),
                left: getVal(props.left, 'auto'),
                top: getVal(props.top, 'auto'),
                height: getVal(props.height, 'auto'),
                ...getFigmaImportValues(),
                ...props.style,
            }}
        >

            <Animated.View
                // entering={globalEnteringConfig(getVal(props.transitionDuration, 150), undefined, getVal(props.transitionIndex, 0))}
                ref={buttonRef}
                style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    borderRadius: getVal(props.borderRadius, globalStyle.borderRadius),
                    borderColor: getVal(props.borderColor, globalStyle.color),
                    borderWidth: 1,
                    padding: 0,
                    margin: 0,
                    backgroundColor: `${backgroundColorActual}${backgroundOpacityActual}`,

                }}
            >
                {props.children}
                <Pressable
                    android_ripple={{ color: props.androidRippleColor ? props.androidRippleColor : '#11111110' }}
                    style={{ width: '100%', height: '100%' }}
                    onPressIn={() => setIsMouseHovering(true)}
                    onLongPress={(e) => { props.onLongPress?.call(e); setIsMouseHovering(false); }}
                    onPressOut={(e) => { props.onClick?.call(e); setIsMouseHovering(false); }}>
                    <RLabel text={props.label} verticalAlign={getVal(props.verticalAlign, 'center')} width="100%" height="100%" left={0} top={0} style={{
                        fontSize: getVal(props.mobileFontSize, 18),
                        color: getVal(props.color, globalStyle.textColor),
                        fontFamily: currentFontFamiliy
                    }}></RLabel>
                </Pressable>
            </Animated.View>
        </View>

    )
}

