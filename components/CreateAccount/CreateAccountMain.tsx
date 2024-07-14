import Animated, { Easing, FadeInDown, FadeInLeft, FadeInUp, withSpring, withTiming } from 'react-native-reanimated';
import RButton from '../common/RButton';
import RLabel from '../common/RLabel';
import store from '@/app/store';
import { useSelector, UseSelector } from 'react-redux';
import { GlobalStyleType } from '@/hooks/globalStyles';
import RBox from '../common/RBox';
import { NetworkDeco } from '../common/deco/NetworkDeco';
import { CrossedOutNetworkDeco } from '../common/deco/CrossedOutNetworkDeco';
import { View } from 'react-native';
import FigmaImporter from '../../fn/figmaImporter'
import FigmaImportConfig from '../../fn/FigmaImportConfig'
import { useEffect } from 'react';

type CreateAccountMainProps = {}
function CreateAccountMain(props: CreateAccountMainProps) {
    store.subscribe(() => { });
    const globalStyle: GlobalStyleType = useSelector(store => store.globalStyle);
    const buttonContainerSize = { containerWidth: 260, containerHeight: 155 }

    return (
        <Animated.View
            entering={FadeInUp.delay(5).duration(150).easing(Easing.inOut(Easing.ease)).withInitialValues({ transform: [{ translateY: -2 }] })}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <RLabel transitionIndex={1} figmaImport={{ mobile: { top: 103, left: 50, width: 260, height: 38 } }} text='Create Account' align='left' verticalAlign='center' fontSize={14} backgroundColor={globalStyle.color + '20'}></RLabel>
            <RButton figmaImport={{ mobile: { left: 50, width: 260, height: 155, top: 153 } }} transitionIndex={2} width="50%" height="30%">
                <RLabel verticalAlign='center' figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 10, left: 39, width: 65, height: 21 } }} fontSize={8} backgroundColor={globalStyle.color + '20'} text='Recommended'></RLabel>
                <RLabel figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 41, left: 17, width: '90%', height: 15 } }} fontSize={14} align='left' verticalCenter={true} text='Online Account'></RLabel>
                <RLabel figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 65, left: 17, width: '90%', height: 150 } }} fontSize={10} align='left' verticalCenter={true} text='This mode gives you seamless remote encrypted backups and the ability to log in from multiple devices into your account'></RLabel>
                <RBox figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 14, left: 22, width: 10, height: 13 } }}>
                    <NetworkDeco width="100%" height="100%" color={globalStyle.color} style={{ top: 5, left: 0 }}></NetworkDeco>
                </RBox>
            </RButton>
            <RButton transitionIndex={4} figmaImport={{ mobile: { left: 50, width: 260, height: 155, top: 334 } }}>
                <RLabel figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 41, left: 17, width: '90%', height: 15 } }} fontSize={14} align='left' verticalCenter={true} text='Offline Account'></RLabel>
                <RLabel figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 65, left: 17, width: '90%', height: 150 } }} fontSize={10} align='left' verticalCenter={true} text='This mode lets you store all your data on your current device requiring a back-up file to log into any other devices'></RLabel>
                <RBox figmaImportConfig={buttonContainerSize} figmaImport={{ mobile: { top: 14, left: 22, width: 10, height: 13 } }}>
                    <CrossedOutNetworkDeco width="100%" height="100%" color={globalStyle.color} style={{ top: 5, left: 0 }}></CrossedOutNetworkDeco>
                </RBox>
            </RButton>
            <RLabel figmaImport={{ mobile: { top: 508, left: 50, width: 260, height: 38 } }} text='You can switch between these modes at any time' verticalAlign='center' fontSize={10} backgroundColor={globalStyle.color + '20'}></RLabel>
        </Animated.View>)
}

export { CreateAccountMain }
