import { Image, StyleSheet, Platform, View, useWindowDimensions, Button, ActivityIndicator } from 'react-native';

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
import { DownloadDeco } from '../common/deco/DownloadDeco';
import * as SecureStore from 'expo-secure-store';
import { StorageAccessFramework } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import { BackupFileDeco } from '../common/deco/BackupFileDeco';
export default function CreateAccountOffline({ navigation }) {
    const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);
    store.subscribe(() => { });
    const [hasDownloadKey, setHasDownloadeKey] = useState(false);
    useEffect(() => {
        setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    })

    const [hasMounted, setHasMounted] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const db = useSQLiteContext();
    useEffect(() => {
        setTimeout(() => {
            setHasMounted(true);
        }, 150);
    }, [])

    async function saveKey() {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
            setHasDownloadeKey(false);
            return;
        }
        try {
            const pk = await SecureStore.getItemAsync('temp-pk').catch(e => { return { error: 'Failed to set keychain pk', errorObj: e, status: 'failed' }; });
            const symsk = await SecureStore.getItemAsync('temp-symsk').catch(e => { return { error: 'Failed to set keychain symsk', errorObj: e, status: 'failed' }; });
            console.log(accountData.publicKey)
            if (accountData.publicKey && accountData.featureConfig !== undefined && pk !== null && symsk !== null) {
                const keyContent = JSON.stringify({ ...accountData, pk: pk, symsk: symsk, id: 'local' });
                await StorageAccessFramework.createFileAsync(permissions.directoryUri, `ARC_Account_Key-${Date.now()}.txt`, 'text/plain')
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, keyContent, { encoding: FileSystem.EncodingType.UTF8 });
                        setHasDownloadeKey(true);
                    })
                    .catch((e) => {
                        setHasDownloadeKey(false);
                        console.log(e);
                    });
            } else {
                //
            }
        } catch (e) {
            setHasDownloadeKey(false);
        }
    }


    async function createAccount() {
        setShowLoading(true);
        if (showLoading === false) {
            await db.getFirstAsync(`SELECT * FROM users WHERE id='temp'`).then(res => {
                if (res.publicKey && res.signupTime && res.featureConfig !== undefined) {
                    const aid = Crypto.randomUUID();
                    res = { ...res, id: aid };
                    const keys = Object.keys(res);
                    const placeholders = keys.map((_, i) => `?`).join(',');
                    db.runAsync(`INSERT INTO users (${keys.join(',')}) VALUES (${placeholders})`, Object.values(res)).then(() => {
                        db.runAsync(`DELETE FROM users WHERE id='temp'`).then(() => {
                            navigation.navigate('Home', { name: 'Home' });
                        }).catch(e => {
                            console.log(e)
                            setShowLoading(false);
                        })
                    }).catch(e => {
                        console.log(e)
                        setShowLoading(false);
                    })
                } else {
                    setShowLoading(false);
                    console.log('oup')
                }
            }).catch(e => {
                console.log(e)
                setShowLoading(false);
            })
        }
    }

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
                        <RLabel figmaImport={{ mobile: { top: 103, left: 50, width: 260, height: 38 } }} text='Create Offline Account' align='left' alignPadding={'3%'} verticalAlign='center' fontSize={14} backgroundColor={globalStyle.color + '20'}></RLabel>
                        <RBox figmaImport={{ mobile: { left: 50, width: 260, height: 119, top: 290 } }} backgroundColor={globalStyle.color + '20'}>
                            <RLabel fontSize={14} top="15%" width="100%" text='You can create full account back-up files at any time'></RLabel>
                            <BackupFileDeco top="23%" height="40%" width="100%"></BackupFileDeco>
                        </RBox>
                        <RLabel figmaImport={{ mobile: { top: 151, left: 50, width: 260, height: 120 } }} text='No data will leave your device. Note that since everything is stored locally, losing this device means you permanently lose access to your data unless you have a local back-up file saved elsewhere.' align='left' alignPadding={'0%'} verticalAlign='top' fontSize={16}></RLabel>
                        <RButton onClick={() => {
                            createAccount();
                        }} figmaImport={{ mobile: { top: 430, left: 50, width: 260, height: 38 } }} label='Create Account' align='left' alignPadding={'3%'} verticalAlign='center' fontSize={14}>
                            <RBox width={50} left='83%' height={'100%'}>
                                <ActivityIndicator animating={showLoading} color={globalStyle.color} size={'large'}></ActivityIndicator>
                            </RBox></RButton>
                    </Animated.View>
                    : <RBox></RBox>}
        </View>)
}
