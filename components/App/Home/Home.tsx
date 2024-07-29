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
import { encryptData } from '@/fn/encrypt';
import { decryptData } from '@/fn/decryptData';
import { defaultFeatureConfig } from '@/app/config/defaultFeatureConfig';
import { localUsersType, updateLocalUserIDs } from '@/hooks/localUserIDs';
import * as jsesc from 'jsesc';

import { randomUUID } from 'expo-crypto';
import { UserData } from '@/app/config/commonTypes';

export default function Home({ navigation }) {
    store.subscribe(() => { });
    const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);
    const localUserIDsActual: localUsersType = useSelector((store) => store.localUserIDs);
    const [hasMounted, setHasMounted] = useState(false);
    const [codeTrigger, setCodeTrigger] = useState('0');
    const [activeUserID, setActiveUserID] = useState(SecureStore.getItem('activeUserID'));
    const [encryptedData, setEncryptedData] = useState({ iv: '', cipher: '' });
    const db = useSQLiteContext();

    const featureData: UserData = db.getFirstSync(`SELECT * FROM users`);

    useEffect(() => {
        setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
        if (localUserIDsActual.users.length > 1) {
            const currentActiveUser = SecureStore.getItem('activeUserID');
            if (currentActiveUser !== undefined && currentActiveUser !== null) {
                setActiveUserID(localUserIDsActual.users[0].id);
                setHasMounted(true);
            }
            ///multi account logic
        } else if (localUserIDsActual.users.length === 1) {
            if (localUserIDsActual.users[0].authenticated === true) {
                SecureStore.setItem('activeUserID', localUserIDsActual.users[0].id);
                setActiveUserID(localUserIDsActual.users[0].id);
                setHasMounted(true);
            } else {
                navigation.navigate('landingScreen', { name: 'landingScreen' });
            }
        }
    }, [])

    useEffect(() => {
    }, [encryptedData])


    function getEncryptedStringComponents(str: string) {
        try {
            const { iv, cipher } = JSON.parse(str);
            if (iv && cipher) {
                return { iv: iv, cipher: cipher };
            } else {
                throw new Error('Failed to extract iv or cipher')
            }
        } catch (e) {
            throw new Error('Invalid string')
        }
    }

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <BackgroundTaskRunner messageHandler={(e) => {
                const res = JSON.parse(e.nativeEvent.data)
                if (res.status === 'success') {
                    const payload = JSON.parse(res.payload);
                    setEncryptedData(payload);
                }
            }} triggeredCode={encryptData(JSON.stringify({ hi: 'hiii' }), SecureStore.getItem(`${activeUserID}-symsk`))} code={encryptData(JSON.stringify(defaultFeatureConfig), SecureStore.getItem(`${activeUserID}-symsk`))}></BackgroundTaskRunner>

            <BackgroundTaskRunner tx={JSON.stringify(encryptedData)} messageHandler={(e) => { console.log(JSON.parse(e.nativeEvent.data)) }} triggeredCode={decryptData(encryptedData, SecureStore.getItem(`${activeUserID}-symsk`))} code={decryptData(encryptedData, SecureStore.getItem(`${activeUserID}-symsk`))}></BackgroundTaskRunner>

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
