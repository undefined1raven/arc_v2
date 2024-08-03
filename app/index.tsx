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
import RButton from "@/components/common/RButton";
import WebView from "react-native-webview";
import { Provider, useSelector } from "react-redux";
import store from "./store";
import RBox from "@/components/common/RBox";
import Constants from "expo-constants";
import { UseSelector } from "react-redux";
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
const Stack = createNativeStackNavigator();

type handleAccountInfoEventReturnSig = {
  status: "failed" | "success";
  error: null | string | object;
  taskID: "accountGen";
  symkey?: string;
  pk?: string;
  featureConfig?: string;
  publicKey?: string;
};

export default function App() {
  const [accountCreds, setAccountCreds] = React.useState<null | {
    publicKey: string;
    symkey: string;
    pk: string;
    featureConfig: string;
  }>(null);
  const [triggerCode, setCodeTrigger] = React.useState(null);
  const [hasInitialized, setHasInitialized] = React.useState(false);
  let colorScheme = useColorScheme();

  store.dispatch(updateGlobalStyle({ ...themeColors[colorScheme] }));

  React.useEffect(() => {
    console.log();
    initialize()
      .then((res: InitializeReturnType) => {
        if (res.status === "success") {
          if (res.mustCreateNewAccountCreds === true) {
            store.dispatch(
              updateLoadingScreenMessage({
                message: "Must create new credentials",
              })
            );
            if (accountCreds !== null) {
              setHasInitialized(true);
              store.dispatch(
                updateLoadingScreenMessage({
                  message: "Writing account credentials",
                })
              );
              setTempCredentials({
                RCKBackup: "",
                PIKBackup: "",
                pk: accountCreds.pk,
                publicKey: accountCreds.publicKey,
                symsk: accountCreds.symkey,
                featureConfig: JSON.stringify(accountCreds.featureConfig),
              })
                .then((r) => {
                  store.dispatch(
                    updateLoadingScreenMessage({ message: "Ready" })
                  );
                  //  user is redirected from the keysLoadingScreen when loading message is "Ready"
                })
                .catch((e) => {
                  console.log(e);
                });
            } else {
              setCodeTrigger(Date.now().toString());
              if (res.allowedAyncGen === true) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "landingScreen" }],
                });
              }
              store.dispatch(
                updateLoadingScreenMessage({
                  message: "Must create new credentials",
                })
              );
              setTimeout(() => {
                store.dispatch(
                  updateLoadingScreenMessage({
                    message: "Generating secure keys",
                    initialTime: Date.now(),
                  })
                );
              }, 20);
            }
          } else {
            store.dispatch(updateLoadingScreenMessage({ message: "Ready" }));
            setHasInitialized(true);
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const navigation = useNavigation();

  React.useEffect(() => {
    if (
      hasInitialized === false &&
      triggerCode !== null &&
      accountCreds !== null
    ) {
      if (accountCreds.publicKey && accountCreds.pk && accountCreds.symkey) {
        initialize()
          .then((res: InitializeReturnType) => {
            console.log(res);
            if (res.status === "success") {
              if (res.mustCreateNewAccountCreds === true) {
                store.dispatch(
                  updateLoadingScreenMessage({
                    message: "Writing account credentials",
                  })
                );
                setTempCredentials({
                  pk: accountCreds.pk,
                  publicKey: accountCreds.publicKey,
                  symsk: accountCreds.symkey,
                  featureConfig: JSON.stringify(accountCreds.featureConfig),
                })
                  .then((r) => {
                    setHasInitialized(true);
                    store.dispatch(
                      updateLoadingScreenMessage({ message: "Ready" })
                    );
                    //  user is redirected from the keysLoadingScreen when loading message is "Ready"
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              } else {
                store.dispatch(
                  updateLoadingScreenMessage({ message: "Ready" })
                );
                setHasInitialized(true);
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Home" }],
                });
              }
            }
          })
          .catch((e) => {
            store.dispatch(
              updateLoadingScreenMessage({
                message: "Something went wrong. Reload the app",
              })
            );
            console.log(e);
          });
      }
    }
  }, [accountCreds, hasInitialized]);

  function handleAccountInfo(e) {
    const eventResults: handleAccountInfoEventReturnSig = JSON.parse(
      e.nativeEvent.data
    );
    if (
      eventResults.error === null &&
      eventResults.pk &&
      eventResults.featureConfig !== undefined &&
      eventResults.symkey &&
      eventResults.publicKey
    ) {
      setAccountCreds({
        pk: eventResults.pk,
        featureConfig: eventResults.featureConfig,
        symkey: eventResults.symkey,
        publicKey: eventResults.publicKey,
      });
    }
  }

  return (
    <SQLiteProvider databaseName="localCache">
      <Provider store={store}>
        <View>
          <BackgroundTaskRunner
            tx={triggerCode}
            triggeredCode={genenerateAccountCode()}
            code={genenerateAccountCode()}
            messageHandler={(e) => {
              handleAccountInfo(e);
            }}
          ></BackgroundTaskRunner>
        </View>
        <Stack.Navigator
          screenOptions={{
            contentStyle: { backgroundColor: "#FF0000" },
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
        </Stack.Navigator>
        <RBox
          id="statusBarBkg"
          borderRadius={0}
          top={-Constants.statusBarHeight}
          height={Constants.statusBarHeight}
          backgroundColor={"#000000"}
          width="100%"
        ></RBox>
      </Provider>
    </SQLiteProvider>
  );
}
