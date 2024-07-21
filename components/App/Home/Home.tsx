import { Image, StyleSheet, Platform, View, useWindowDimensions, Button, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
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
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { KeyboarDismissWrapper } from '../../common/KeyboardDismissWrapper';
import * as EmailValidator from 'email-validator';
import { BackgroundTaskRunner } from '../../common/BackgroundTaskRunner';
import { wrapKeysWithPasswordCode } from '@/fn/getPasswordWrappedKeys';
import { useSQLiteContext } from 'expo-sqlite';
import { genenerateAccountCode } from '@/fn/generateAccountCode';
import { PasswordHashingReturnType } from '@/app/config/endpointReturnTypes';
import { RadialGradient } from 'react-native-svg';
import { GradientLine } from '../../common/deco/GradientLine';



export default function Home({ navigation }) {
    const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);
    store.subscribe(() => { });
    const [hasMounted, setHasMounted] = useState(false);
    const db = useSQLiteContext();
    useEffect(() => {
        setHasMounted(true);
        console.log(db.getAllSync(`SELECT * FROM users`))
        setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    }, [])

    const titleHeaderContainer = { containerHeight: 36, containerWidth: 325 }
    return (
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <StatusBar backgroundColor={globalStyle.statusBarColor}></StatusBar>
            <LinearGradient
                colors={globalStyle.pageBackgroundColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.7 }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
            <RBox figmaImport={{ mobile: { top: 5, left: 165, width: 30, height: 10 } }}><ARCLogo></ARCLogo></RBox>
            <RBox figmaImport={{ mobile: { top: 21, left: 0, width: '100%', height: 1 } }} backgroundColor={globalStyle.color}>
                {/* <GradientLine width="100%" height="100%"></GradientLine> */}
            </RBox>
            {
                hasMounted ?
                    <Animated.View
                        entering={globalEnteringConfig()}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <RButton width="50%" height="20%" top="20%" left="25%" label='reset'
                            onClick={() => {
                                db.runSync(`DROP TABLE users`);
                            }}></RButton>
                    </Animated.View>
                    : <RBox></RBox>}
        </View>)
}
