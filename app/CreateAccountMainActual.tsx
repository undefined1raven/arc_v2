import { Image, StyleSheet, Platform, View, useWindowDimensions, Button } from 'react-native';

import { useEffect, useState } from 'react';
import RButton from '@/components/common/RButton';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import RBox from '@/components/common/RBox';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles, { GlobalStyleType, updateGlobalStyle } from '@/hooks/globalStyles';
import RLabel from '@/components/common/RLabel';
import RTextInput from '@/components/common/RTextInput';
import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { globalEnteringConfig } from './config/defaultTransitionConfig';
import { ARCLogoMini } from '@/components/common/deco/ARCLogoMini';
import { ARCLogo } from '@/components/common/deco/ARCLogo';
import { CrossedOutNetworkDeco } from '@/components/common/deco/CrossedOutNetworkDeco';
import { NetworkDeco } from '@/components/common/deco/NetworkDeco';
import { ArrowDeco } from '@/components/common/deco/ArrowDeco';

export default function CreateAccountMain({ navigation }) {
  const globalStyle: GlobalStyleType = useSelector((store) => store.globalStyle);
  store.subscribe(() => { });

  useEffect(() => {
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  })

  const [hasMounted, setHasMounted] = useState(false);
  const buttonContainerSize = { containerWidth: 260, containerHeight: 155 }

  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
    }, 150);
  }, [])

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
            <RBox transitionDuration={0} figmaImport={{ mobile: { top: 34, left: 167, width: 25, height: 25 } }}><ARCLogoMini width="100%" height="100%"></ARCLogoMini></RBox>

            <RLabel transitionIndex={1} figmaImport={{ mobile: { top: 103, left: 50, width: 260, height: 38 } }} text='Create Account' align='left' alignPadding={'3%'} verticalAlign='center' fontSize={14} backgroundColor={globalStyle.color + '20'}></RLabel>
            <RButton figmaImport={{ mobile: { left: 50, width: 260, height: 155, top: 153 } }} transitionIndex={2} width="50%" height="30%">
              <RLabel verticalAlign='center' figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 10, left: 39, width: 65, height: 21 } }} fontSize={8} backgroundColor={globalStyle.color + '20'} text='Recommended'></RLabel>
              <RLabel figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 41, left: 17, width: '90%', height: 25 } }} fontSize={globalStyle.largeMobileFont} align='left' verticalCenter={true} text='Online Account'></RLabel>
              <RLabel figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 64, left: 17, width: '80%', height: 150 } }} fontSize={12} align='left' verticalCenter={true} text='This mode gives you seamless remote encrypted backups and the ability to log in from multiple devices into your account'></RLabel>
              <RBox figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 14, left: 22, width: 10, height: 13 } }}>
                <NetworkDeco width="100%" height="100%" color={globalStyle.color} style={{ top: 5, left: 0 }}></NetworkDeco>
              </RBox>
              <RBox figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 122, left: 209, width: 47, height: 29 } }}>
                <ArrowDeco></ArrowDeco>
              </RBox>
            </RButton>
            <RButton transitionIndex={4} figmaImport={{ mobile: { left: 50, width: 260, height: 155, top: 334 } }}>
              <RLabel figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 41, left: 17, width: '90%', height: 25 } }} fontSize={globalStyle.largeMobileFont} align='left' verticalCenter={true} text='Offline Account'></RLabel>
              <RLabel figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 64, left: 17, width: '80%', height: 50 } }} fontSize={12} align='left' verticalCenter={true} text='This mode lets you store all your data on your current device requiring a back-up file to log into any other devices'></RLabel>
              <RBox figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 14, left: 22, width: 10, height: 13 } }}>
                <CrossedOutNetworkDeco width="100%" height="100%" color={globalStyle.color} style={{ top: 5, left: 0 }}></CrossedOutNetworkDeco>
              </RBox>
              <RBox figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 122, left: 209, width: 47, height: 29 } }}>
                <ArrowDeco></ArrowDeco>
              </RBox>
            </RButton>
            <RLabel figmaImport={{ mobile: { top: 508, left: 50, width: 260, height: 38 } }} text='You can switch between these modes at any time' verticalAlign='center' fontSize={globalStyle.smallMobileFont} backgroundColor={globalStyle.color + '20'}></RLabel>
          </Animated.View>
          : <RBox></RBox>}
    </View>)
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