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
import { EncryptionWorker } from '@/components/common/EncryptionWorker';
import { DecryptionWorker } from '@/components/common/DecryptionWorker';

export default function Home({ navigation }) {
    store.subscribe(() => { });
    const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);
    const localUserIDsActual: localUsersType = useSelector((store) => store.localUserIDs);
    const [hasMounted, setHasMounted] = useState(false);
    const [activeUserID, setActiveUserID] = useState(SecureStore.getItem('activeUserID'));
    const [dataForEncryption, setDataForEncryption] = useState<{ iv: string, cipher: string }>({ cipher: '', iv: '' });
    const [startDecryption, setStartDecryption] = useState(false);
    const db = useSQLiteContext();
    useEffect(() => {
        const ok = db.getFirstSync(`SELECT featureConfig FROM users`);
        const fc = JSON.parse(JSON.parse(jsesc.default(ok, { json: true })).featureConfig);
        setDataForEncryption({ iv: fc.iv, cipher: fc.cipher });
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
        if (dataForEncryption.iv !== '' && dataForEncryption.cipher !== '') {
            setStartDecryption(true);
        }
    }, [dataForEncryption])

    function encode(str: string) {
        const enc = new TextEncoder().encode(str)
        return JSON.stringify(enc);
    }

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>

            {startDecryption === true ? <DecryptionWorker cipher={encode(dataForEncryption.cipher)} iv={encode(dataForEncryption.iv)} symsk={SecureStore.getItem(`${localUserIDsActual.users[0].id}-symsk`) as string}
                onDecrypted={(e) => {
                    console.log(e)
                }}
                onError={(e) => { console.log(e, ' err') }}
            ></DecryptionWorker> : <RBox></RBox>}

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
