import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
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
import { initialize } from '@/fn/initialize';
import { genenerateAccountCode } from '@/fn/generateAccountCode';
const Stack = createNativeStackNavigator();



initialize().then(r => {
  // console.log(r)
}).catch(e => {
  // console.log(e)
})


type handleAccountInfoEventReturnSig = { status: 'failed' | 'success', error: null | string | object, taskID: 'accountGen', symkey?: string }

export default function App() {

  function handleAccountInfo(e) {
    const eventResults: handleAccountInfoEventReturnSig = JSON.parse(e.nativeEvent.data);
    console.log(eventResults.error)
  }


  return (
    <Provider store={store}>
      <View>
        <BackgroundTaskRunner triggeredCode='' code={genenerateAccountCode()}
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
      </Stack.Navigator>
      <RBox id='statusBarBkg' borderRadius={0} top={-Constants.statusBarHeight} height={Constants.statusBarHeight} backgroundColor={'#000000'} width="100%"></RBox>
    </Provider>
  );
}
