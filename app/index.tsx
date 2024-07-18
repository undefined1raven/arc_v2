import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, StatusBar, Keyboard } from 'react-native';
import RButton from '@/components/common/RButton';
import WebView from 'react-native-webview';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import RBox from '@/components/common/RBox';
import Constants from 'expo-constants';
import { UseSelector } from 'react-redux';
import globalStyles, { GlobalStyleType } from '@/hooks/globalStyles';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'react-native-svg';
import CreateAccountMainActual from './CreateAccountMainActual';
import LandingScreen from './LandingScreen';
import CreateAccountOnline from '@/components/CreateAccount/CreateAccountOnline';
import { BackgroundTaskRunner } from '@/components/common/BackgroundTaskRunner';
import { openDB } from '@/fn/dbOps';

import { initialize, InitializeReturnType } from '@/fn/initialize';
import { genenerateAccountCode } from '@/fn/generateAccountCode';
import { setTempCredentials } from '@/fn/setTempCredentials';
import CreateAccountOnlineEmail from '@/components/CreateAccount/CreateAccountOnlineEmail';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SQLiteProvider } from 'expo-sqlite';
const Stack = createNativeStackNavigator();





type handleAccountInfoEventReturnSig = { status: 'failed' | 'success', error: null | string | object, taskID: 'accountGen', symkey?: string, pk?: string }

export default function App() {
  const [accountCreds, setAccountCreds] = React.useState(null);
  const [triggerCode, setCodeTrigger] = React.useState(null);
  const [hasInitialized, setHasInitialized] = React.useState(false);
  // initialize().then((res: InitializeReturnType) => {
  //   if (res.status === 'success') {
  //     if (res.mustCreateNewAccountCreds === true) {
  //       if (accountCreds !== null) {
  //         setTempCredentials({ RCKBackup: '', PIKBackup: '', pk: accountCreds.pk, publicKey: accountCreds.publicKey, symsk: accountCreds.symkey, featureConfig: '' }).then(r => {
  //           console.log('yeey')
  //         }).catch(e => {
  //           console.log(e);
  //         })
  //       } else {
  //         console.log('miss')
  //         setCodeTrigger(Date.now().toString());
  //       }
  //     } else {
  //       console.log('stx')
  //     }
  //   }
  // }).catch(e => {
  //   console.log(e)
  // })

  React.useEffect(() => {
    if (accountCreds !== null && hasInitialized === false) {
      if (accountCreds.publicKey && accountCreds.pk && accountCreds.symkey) {
        setHasInitialized(true);
        initialize().then((res: InitializeReturnType) => {
          console.log(res)
          if (res.status === 'success') {
            if (res.mustCreateNewAccountCreds === true) {
              setTempCredentials({ pk: accountCreds.pk, publicKey: accountCreds.publicKey, symsk: accountCreds.symkey, featureConfig: '' }).then(r => {
                console.log('yeey')
              }).catch(e => {
                console.log(e);
              })
            } else {
              console.log('sops')
            }
          }
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }, [accountCreds])

  function handleAccountInfo(e) {
    const eventResults: handleAccountInfoEventReturnSig = JSON.parse(e.nativeEvent.data);
    setAccountCreds(eventResults);
  }


  return (
    <SQLiteProvider databaseName='localCache'>
      <Provider store={store}>
        <View>
          <BackgroundTaskRunner tx={triggerCode} triggeredCode={genenerateAccountCode()} code={genenerateAccountCode()}
            messageHandler={(e) => { handleAccountInfo(e); }}
          ></BackgroundTaskRunner>
        </View>
        <StatusBar backgroundColor={'#ffffff'}></StatusBar>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="landingScreen"
            component={LandingScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="createAccountMain"
            component={CreateAccountMainActual}
          ></Stack.Screen>
          <Stack.Screen
            name="createAccountOnline"
            component={CreateAccountOnline}
          ></Stack.Screen>
          <Stack.Screen
            name="createAccountOnlineEmail"
            component={CreateAccountOnlineEmail}
          ></Stack.Screen>
        </Stack.Navigator>
        <RBox id='statusBarBkg' borderRadius={0} top={-Constants.statusBarHeight} height={Constants.statusBarHeight} backgroundColor={'#000000'} width="100%"></RBox>
      </Provider>
    </SQLiteProvider>
  );
}
