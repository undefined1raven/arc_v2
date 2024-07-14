import { LinearGradient } from "react-native-svg";
import RBox from "./RBox";
import store from "@/app/store";
import Constants from 'expo-constants';
import { useSelector } from "react-redux";
import { View } from 'react-native';
import { GlobalStyleType } from "@/hooks/globalStyles";


function CommonComponents() {
    store.subscribe(() => { });
    const globalStyle: GlobalStyleType = useSelector(store => store.globalStyle);
    return (
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <LinearGradient
                colors={globalStyle.pageBackgroundColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.7 }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
            <RBox id='statusBarBkg' borderRadius={0} top={-Constants.statusBarHeight} height={Constants.statusBarHeight} backgroundColor={globalStyle.statusBarColor} width="100%"></RBox>
        </View>)
}


export { CommonComponents }