import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  StatusBar,
  Keyboard,
} from "react-native";
import { LogBox } from "react-native";
import RButton from "@/components/common/RButton";
import WebView from "react-native-webview";
import { Provider } from "react-redux";
import store from "./store";
import RBox from "@/components/common/RBox";
import Constants from "expo-constants";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import { updateLoadingScreenMessage } from "@/hooks/loadingScreenMessage";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "react-native-svg";
import CreateAccountMainActual from "./CreateAccountMainActual";
import LandingScreen from "./LandingScreen";
import CreateAccountOnline from "@/components/CreateAccount/CreateAccountOnline";
import { BackgroundTaskRunner } from "@/components/common/BackgroundTaskRunner";
import { openDB } from "@/fn/dbOps";
import { Appearance, useColorScheme } from "react-native";
import { initialize, InitializeReturnType } from "@/fn/initialize";
import { genenerateAccountCode } from "@/fn/generateAccountCode";
import { setTempCredentials } from "@/fn/setTempCredentials";
import CreateAccountOnlineEmail from "@/components/CreateAccount/CreateAccountOnlineEmail";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SQLiteProvider } from "expo-sqlite";
import OTSOne from "@/components/OneTimeSetup/OTSOne";
import OTSTwo from "@/components/OneTimeSetup/OTSTwo";
import OTSThree from "@/components/OneTimeSetup/OTSThree";
import Home from "@/components/App/Home/Home";
import themeColors, { ThemeColorsType } from "@/app/config/colors";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "@/components/common/LoadingScreen";
import KeysLoadingScreen from "@/components/CreateAccount/KeysLoadingScreen";
import CreateAccountKeyFile from "@/components/CreateAccount/CreateAccountKeyFile";
import CreateAccountOffline from "@/components/CreateAccount/CreateAccountOffline";
import { FeatureConfigDecryptor } from "@/components/App/decryptors/FetureConfigDecryptor";
import { stringToCharCodeArray } from "@/fn/stringToCharCode";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { InitializeApp } from "@/components/App/logic/InitializeApp";
import SettingsMainMenu from "@/components/App/Settings/SettingsMainMenu";
const Stack = createNativeStackNavigator();

type handleAccountInfoEventReturnSig = {
  status: "failed" | "success";
  error: null | string | object;
  taskID: "accountGen";
  symkey?: string;
  pk?: string;
  arcFeatureConfig?: string;
  tessFeatureConfig?: string;
  SIDFeatureConfig?: string;
  publicKey?: string;
};

export default function App() {
  LogBox.ignoreAllLogs();
  const updateGlobalStyle = useGlobalStyleStore(
    (store) => store.updateGlobalStyle
  );
  let colorScheme = useColorScheme();

  React.useEffect(() => {
    updateGlobalStyle({ ...themeColors[colorScheme] });
  }, []);

  return (
    <SQLiteProvider databaseName="localCache">
      <InitializeApp></InitializeApp>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: "#000000" },
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
        ></Stack.Screen>
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
        <Stack.Screen
          name="createAccountOnlineEmail"
          component={CreateAccountOnlineEmail}
        ></Stack.Screen>
        <Stack.Screen name="OTSOne" component={OTSOne}></Stack.Screen>
        <Stack.Screen name="OTSTwo" component={OTSTwo}></Stack.Screen>
        <Stack.Screen name="OTSThree" component={OTSThree}></Stack.Screen>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
        <Stack.Screen
          name="keysLoadingScreen"
          component={KeysLoadingScreen}
        ></Stack.Screen>
        <Stack.Screen
          name="createAccountKeyFile"
          component={CreateAccountKeyFile}
        ></Stack.Screen>
        <Stack.Screen
          name="createAccountOffline"
          component={CreateAccountOffline}
        ></Stack.Screen>
        {/* <Stack.Screen
          name="SettingsMain"
          component={SettingsMainMenu}
        ></Stack.Screen> */}
      </Stack.Navigator>
    </SQLiteProvider>
  );
}
