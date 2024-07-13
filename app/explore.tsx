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

export default function HomeScreen() {
  const [isRed, setIsRed] = useState(true);
  const [color, setColor] = useState(isRed ? '#ff0000' : '#ffffff');

  function x() {
    if (isRed) {
      setIsRed(false);

    } else {
      setIsRed(true);
    }
  }

  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);

  store.subscribe(() => { });

  function r() {
    return Math.random() > 0.4 ? themeColors.dark : themeColors.light
  }

  const [show, setShow] = useState(true);
  return (
    <View style={{ ...styles.container }}>
      <LinearGradient
        colors={globalStyle.pageBackgroundColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 0.7 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      {/* <RBox figmaImport={{ mobile: { width: 354, height: 163, top: 420, left: 3 } }} backgroundColor='#ff000020'>
        <RButton label='y' androidRippleColor='#ff005590' hoverOpacityMin='00' borderColor='#ff0000' backgroundColor='#ff0000' hoverOpacityMax='00' color='#fff' figmaImport={{ mobile: { top: 5, left: 227, width: 59, height: 26 } }} figmaImportConfig={{ containerHeight: 163, containerWidth: 354 }}></RButton>
        <RButton label='x' androidRippleColor='#51ff0090' hoverOpacityMin='00' borderColor='#ff0000' backgroundColor='#ff0000' hoverOpacityMax='00' color='#fff' figmaImport={{ mobile: { top: 5, left: 290, width: 59, height: 26 } }} figmaImportConfig={{ containerHeight: 163, containerWidth: 354 }}></RButton>
      </RBox> */}
      <RTextInput align='left' onInput={(e) => { console.log(e) }} top="50%" width="50%" left="20%" label='dd'></RTextInput>
      <RToggleSwitch top="90%" left="15%" figmaImport={{ mobile: { width: 55, height: 22 } }}></RToggleSwitch>
      <RLabel text='yeeey' backgroundColor={globalStyle.color + '20'} figmaImport={{ mobile: { top: 450, left: '50%', width: 320, height: 40 } }} horizontalCenter={true}></RLabel>
      <RButton onClick={() => {
        dispatch(updateGlobalStyle({ ...globalStyle, ...r() }))
      }} figmaImport={{ mobile: { top: 430, left: 5, width: 350, height: 40 } }} label='xx'></RButton>
      <RLabel text='Running' fontSize={12} left="5%" align='left' top="20%" width="15%"></RLabel>
      <RLabel text='Workout' fontSize={8} left="5%" align='left' top="22%" width="15%"></RLabel>
      <RBox id='statusBarBkg' borderRadius={0} top={-Constants.statusBarHeight} height={Constants.statusBarHeight} backgroundColor={globalStyle.statusBarColor} width="100%"></RBox>
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
  }, input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});