import { Image, StyleSheet, Platform, View, useWindowDimensions, Button } from 'react-native';

import { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview'
import * as SecureStore from 'expo-secure-store';
import { FlatList, GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import RButton from '@/components/common/RButton';
import ReactorMain from '@/components/common/deco/rrr';
import { Text } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import Constants from 'expo-constants';
import RBox from '@/components/common/RBox';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles, { GlobalStyleType, updateGlobalStyle } from '@/hooks/globalStyles';
import themeColors from './config/colors';
import RLabel from '@/components/common/RLabel';
import RTextInput from '@/components/common/RTextInput';
import RToggleSwitch from '@/components/common/RToggleSwitch';
import { CreateAccountMain } from '@/components/CreateAccount/CreateAccountMain';
import { WithBackground } from '@/components/common/CommonComponents';
import { StatusBar } from 'expo-status-bar';

export default function Login({ navigation }) {
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);
  store.subscribe(() => { });

  const [show, setShow] = useState(true);
  return (
    <View style={{ ...styles.container, backgroundColor: globalStyle.statusBarColor }}>
      <StatusBar backgroundColor={globalStyle.statusBarColor}></StatusBar>
      <LinearGradient
        colors={globalStyle.pageBackgroundColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 0.7 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      <CreateAccountMain navigation={navigation}></CreateAccountMain>
      <RButton onClick={() => {
        // navigation.navigate('alp', { name: 'alp' })
        setShow(prev => !prev)

      }} figmaImport={{ mobile: { top: 430, left: 5, width: 350, height: 40 } }} label='login'></RButton>
    </View>

  );
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