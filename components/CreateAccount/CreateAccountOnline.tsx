import { Image, StyleSheet, Platform, View, useWindowDimensions, Button } from 'react-native';

import { useEffect, useState } from 'react';
import RButton from '@/components/common/RButton';
import { Provider, useDispatch, useSelector } from 'react-redux';
import RBox from '@/components/common/RBox';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles, { GlobalStyleType, updateGlobalStyle } from '@/hooks/globalStyles';
import RLabel from '@/components/common/RLabel';
import RTextInput from '@/components/common/RTextInput';
import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { ARCLogoMini } from '@/components/common/deco/ARCLogoMini';
import { ARCLogo } from '@/components/common/deco/ARCLogo';
import { CrossedOutNetworkDeco } from '@/components/common/deco/CrossedOutNetworkDeco';
import { NetworkDeco } from '@/components/common/deco/NetworkDeco';
import { ArrowDeco } from '@/components/common/deco/ArrowDeco';
import store from '@/app/store';
import { globalEnteringConfig } from '@/app/config/defaultTransitionConfig';
export default function CreateAccountOnline({ navigation }) {
    const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);
    store.subscribe(() => { });

    useEffect(() => {
        setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    })

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setHasMounted(true);
        }, 150);
    }, [])

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <StatusBar backgroundColor={globalStyle.statusBarColor}></StatusBar>
            <LinearGradient
                colors={globalStyle.pageBackgroundColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.7 }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
            {
                hasMounted ?
                    <Animated.View
                        entering={globalEnteringConfig()}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <RBox figmaImport={{ mobile: { top: 34, left: 167, width: 25, height: 25 } }}><ARCLogoMini width="100%" height="100%"></ARCLogoMini></RBox>
                        <RButton color={globalStyle.colorInactive} borderColor={globalStyle.colorInactive} backgroundColor={globalStyle.colorInactive} androidRippleColor={globalStyle.colorInactive + '00'} figmaImport={{ mobile: { top: 153, left: 50, width: 260, height: 44 } }} label='Continue with Google' align='left' mobileFontSize={15}></RButton>
                        <RButton color={globalStyle.colorInactive} borderColor={globalStyle.colorInactive} backgroundColor={globalStyle.colorInactive} androidRippleColor={globalStyle.colorInactive + '00'} figmaImport={{ mobile: { top: 217, left: 50, width: 260, height: 44 } }} label='Continue with Meta' align='left' mobileFontSize={15}></RButton>
                        <RButton onClick={() => {navigation.navigate('createAccountOnlineEmail')}} figmaImport={{ mobile: { top: 281, left: 50, width: 260, height: 44 } }} label='Continue with email' align='left' mobileFontSize={15}></RButton>
                        <RLabel figmaImport={{ mobile: { top: 347, left: 0, width: '100%', height: 15 } }} style text='or' fontSize={12}></RLabel>
                        <RLabel figmaImport={{ mobile: { top: 103, left: 50, width: 260, height: 38 } }} text='Create Account' align='left' alignPadding={'3%'} verticalAlign='center' fontSize={14} backgroundColor={globalStyle.color + '20'}></RLabel>
                        <RLabel figmaImport={{ mobile: { top: 441, left: 50, width: 260, height: 100 } }} style={{ paddingLeft: '2%', paddingRight: '2%' }} text='The key file is a secure way of logging into your account without having to remember any credentials' verticalAlign='center' fontSize={12} backgroundColor={globalStyle.color + '20'}></RLabel>
                        <RButton figmaImport={{ mobile: { top: 385, left: 50, width: 260, height: 44 } }} label='Generate key file' align='left' mobileFontSize={15}></RButton>
                    </Animated.View>
                    : <RBox></RBox>}
        </View>)
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