import { Image, StyleSheet, Platform, View, useWindowDimensions, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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
import { CommonComponents } from '@/components/common/CommonComponents';

export default function HomeScreen({ navigation }) {
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);
  store.subscribe(() => { });


  return (
    <View style={{ ...styles.container }}>
      <CommonComponents></CommonComponents>
      <CreateAccountMain></CreateAccountMain>
      <RButton onClick={() => {
        navigation.navigate('alp', { name: 'alp' })

      }} figmaImport={{ mobile: { top: 430, left: 5, width: 350, height: 40 } }} label='xx'></RButton>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: Constants.statusBarHeight,
    left: '0%',
    backgroundColor: '#00000000',
    width: '100%',
    height: '100.3%',
    padding: 0,
    position: 'absolute',
    alignItems: 'center',
  },
});