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
import { encryptData } from '@/fn/ecnryptData';
import { decryptData } from '@/fn/decryptData';



export default function Home({ navigation }) {
    const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);
    store.subscribe(() => { });
    const [hasMounted, setHasMounted] = useState(false);
    const [encryptedData, setEncryptedData] = useState('');
    const db = useSQLiteContext();
    useEffect(() => {
        setHasMounted(true);
        setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    }, [])

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <BackgroundTaskRunner messageHandler={(e) => { 
                const resJSON = JSON.parse(e.nativeEvent.data);
                console.log(resJSON.payload)
             }} code={encryptData(JSON.stringify({ hii: 'xx' }), SecureStore.getItem('e8e03dc6-3b5f-44a4-a6fa-026448116fba.local-symsk'))}></BackgroundTaskRunner>
            <BackgroundTaskRunner messageHandler={(e) => {
                console.log(encryptedData)
                console.log(e.nativeEvent.data);
            }} code={decryptData(encryptedData, SecureStore.getItem('e8e03dc6-3b5f-44a4-a6fa-026448116fba.local-symsk'))}></BackgroundTaskRunner>
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
                            onClick={async () => {
                                await SecureStore.deleteItemAsync('temp-symsk');
                                await SecureStore.deleteItemAsync('temp-pk');
                                db.runSync(`DROP TABLE users`);
                            }}></RButton>
                    </Animated.View>
                    : <RBox></RBox>}
        </View>)
}
