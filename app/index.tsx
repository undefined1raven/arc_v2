import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import RButton from '@/components/common/RButton';
import { startAuthentication } from '@simplewebauthn/browser';
import WebView from 'react-native-webview';
import HomeScreen from './explore';
import { Provider } from 'react-redux';
import store from './store';
import RBox from '@/components/common/RBox';
import Constants from 'expo-constants';
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
      <HomeScreen></HomeScreen>
      <RBox borderRadius={0} top={0} height={Constants.statusBarHeight} backgroundColor='#BEB4FF' width="100%"></RBox>
    </Provider>
  );
}
