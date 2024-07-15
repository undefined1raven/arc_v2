import { Easing, FadeInDown } from "react-native-reanimated";

const globalTransitionConfig = { duration: 200, easing: Easing.out(Easing.quad) }

function getVal(value: any, defaultVal: any) {
    if (value) {
        return value;
    } else {
        return defaultVal;
    }
}

function globalEnteringConfig(duration?: number, delay?: number, transitionIndex?: number) {
    return FadeInDown.delay(getVal(delay, 40) * getVal(transitionIndex, 0)).duration(getVal(duration, 150)).easing(Easing.inOut(Easing.ease)).withInitialValues({ transform: [{ translateY: -2 }] })
}

export { globalTransitionConfig, globalEnteringConfig, getVal };