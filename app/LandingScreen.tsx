import { Image, StyleSheet, Platform, View, useWindowDimensions, Button } from 'react-native';

import { useEffect, useState } from 'react';
import RButton from '@/components/common/RButton';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import RBox from '@/components/common/RBox';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles, { GlobalStyleType, updateGlobalStyle } from '@/hooks/globalStyles';
import RLabel from '@/components/common/RLabel';
import RTextInput from '@/components/common/RTextInput';
import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { globalEnteringConfig } from './config/defaultTransitionConfig';
import { ARCLogoMini } from '@/components/common/deco/ARCLogoMini';
import { ARCLogo } from '@/components/common/deco/ARCLogo';

export default function LandingScreen({ navigation }) {
    const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);
    const loadingScreenMessage: string = useSelector((store) => store.loadingScreenMessage);
    store.subscribe(() => { });

    useEffect(() => {
        setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    }, [])


    function onCreateAccount() {
        if (loadingScreenMessage === 'Ready') {
            navigation.navigate('createAccountMain', { name: 'createAccountMain' })
        } else {
            navigation.navigate('keysLoadingScreen', { name: 'keysLoadingScreen' })
        }
    }

    return (
        <View style={{ ...styles.container, backgroundColor: globalStyle.statusBarColor }}>
            <StatusBar backgroundColor={globalStyle.statusBarColor}></StatusBar>
            <LinearGradient
                colors={globalStyle.pageBackgroundColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.7 }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
            <Animated.View
                entering={globalEnteringConfig()}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <RBox transitionDuration={0} figmaImport={{ mobile: { top: 134, left: 106, width: 147, height: 50 } }}><ARCLogo></ARCLogo></RBox>
                <RBox transitionDuration={0} figmaImport={{ mobile: { top: 205, left: 155, width: 50, height: 50 } }}><ARCLogoMini width="100%" height="100%"></ARCLogoMini></RBox>
                <RButton transitionDuration={0} mobileFontSize={22} figmaImport={{ mobile: { top: 366, left: 50, width: 260, height: 44 } }} label='Log In'></RButton>
                <RLabel text='or' figmaImport={{ mobile: { top: 428, left: '0', width: '100%', height: 44 } }}></RLabel>
                <RButton onClick={() => { onCreateAccount() }} mobileFontSize={22} transitionDuration={0} figmaImport={{ mobile: { top: 463, left: 50, width: 260, height: 44 } }} label='Create Account'></RButton>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        top: 0,
        left: '0%',
        backgroundColor: '#00000000',
        width: '100%',
        height: '100.3%',
        padding: 0,
        position: 'absolute',
        alignItems: 'center',
    },
});