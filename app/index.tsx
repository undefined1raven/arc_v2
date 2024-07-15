import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import RButton from '@/components/common/RButton';
import { startAuthentication } from '@simplewebauthn/browser';
import WebView from 'react-native-webview';
import HomeScreen from './explore';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import RBox from '@/components/common/RBox';
import Constants from 'expo-constants';
import { UseSelector } from 'react-redux';
import globalStyles, { GlobalStyleType } from '@/hooks/globalStyles';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateAccountMain } from '@/components/CreateAccount/CreateAccountMain';
import { LinearGradient } from 'react-native-svg';
import Login from './Login';
import CreateOnlineAccount from './CreateOnlineAccount';
import CreateAccountMainActual from './CreateAccountMainActual';
import LandingScreen from './LandingScreen';
const Stack = createNativeStackNavigator();

async function save(key, value) {
  await SecureStore.setItemAsync(key, value, { authenticationPrompt: 'Confirm your identity to continue', requireAuthentication: true });
}
async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
}


export default function App() {
  const [key, onChangeKey] = React.useState('Your key here');
  const [value, onChangeValue] = React.useState('Your value here');

  return (
    <Provider store={store}>
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
      </Stack.Navigator>
      <RBox id='statusBarBkg' borderRadius={0} top={-Constants.statusBarHeight} height={Constants.statusBarHeight} backgroundColor={'#000000'} width="100%"></RBox>
    </Provider>
  );
}
