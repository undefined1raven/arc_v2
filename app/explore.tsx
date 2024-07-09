import { Image, StyleSheet, Platform, View, useWindowDimensions, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview'
import * as SecureStore from 'expo-secure-store';
import { FlatList } from 'react-native-gesture-handler';
import RButton from '@/components/common/RButton';
import ReactorMain from '@/components/common/deco/rrr';
import { Text } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import Constants from 'expo-constants';
import RBox from '@/components/common/RBox';
import { LinearGradient } from 'expo-linear-gradient';
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
  const globalStyle = useSelector((store) => store.globalStyle);
  useEffect(() => {
    setColor(isRed ? '#ff0000' : '#ffffff');
  }, [isRed])

  const [show, setShow] = useState(true);
  return (
    <View style={{ ...styles.container }}>
      <LinearGradient
        colors={['#BEB4FF', '#7E75B5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 0.7 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      {/* <RBox figmaImport={{ mobile: { width: 354, height: 163, top: 420, left: 3 } }} backgroundColor='#ff000020'>
        <RButton label='y' androidRippleColor='#ff005590' hoverOpacityMin='00' borderColor='#ff0000' backgroundColor='#ff0000' hoverOpacityMax='00' color='#fff' figmaImport={{ mobile: { top: 5, left: 227, width: 59, height: 26 } }} figmaImportConfig={{ containerHeight: 163, containerWidth: 354 }}></RButton>
        <RButton label='x' androidRippleColor='#51ff0090' hoverOpacityMin='00' borderColor='#ff0000' backgroundColor='#ff0000' hoverOpacityMax='00' color='#fff' figmaImport={{ mobile: { top: 5, left: 290, width: 59, height: 26 } }} figmaImportConfig={{ containerHeight: 163, containerWidth: 354 }}></RButton>
      </RBox> */}
      <RButton label='Generate key file' androidRippleColor='#BEB4FF20' hoverOpacityMin='00' borderColor='#0B004F' backgroundColor='#0B004F' hoverOpacityMax='00' color='#0B004F' figmaImport={{ mobile: { top: 382, left: 50, width: 260, height: 44 } }}></RButton>

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