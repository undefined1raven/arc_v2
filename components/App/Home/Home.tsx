import {
  Image,
  StyleSheet,
  Platform,
  View,
  useWindowDimensions,
  Button,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { BlurView } from "expo-blur";

import * as SecureStore from "expo-secure-store";
import React, {
  Component,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import RButton from "@/components/common/RButton";
import { Provider, useDispatch, useSelector } from "react-redux";
import RBox from "@/components/common/RBox";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import RLabel from "@/components/common/RLabel";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, Easing } from "react-native-reanimated";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import store from "@/app/store";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useSQLiteContext } from "expo-sqlite";
import { localUsersType, updateLocalUserIDs } from "@/hooks/localUserIDs";
import * as jsesc from "jsesc";
import { FeatureConfigType, UserData } from "@/app/config/commonTypes";
import { Dimensions } from "react-native";
import { FeatureConfigDecryptor } from "../decryptors/FetureConfigDecryptor";
import { Header } from "./Header";
import ActivitiesSettingsMain from "../Settings/Activities/ActivitiesSettingsMain";
import { updateArcFeatureConfig } from "@/hooks/arcFeatureConfig";
import TimeTracker from "./Widgets/TimeTracker";
import { localStorageGet, localStorageSet } from "@/fn/localStorage";
import { act } from "react-test-renderer";
import { updateActiveUser } from "@/hooks/activeUserID";
import WebView from "react-native-webview";
import MenuMain from "@/components/common/menu/MenuMain";
import { LoadData } from "./LoadData";

type HomeProps = { onRequestUserIDs: Function };
export default function Home({ navigation, onRequestUserIDs }) {
  store.subscribe(() => {});
  const windowHeight = Dimensions.get("window").height;
  const globalStyle: GlobalStyleType = useSelector(
    (store) => store.globalStyle
  );
  const localUserIDsActual: localUsersType = useSelector(
    (store) => store.localUserIDs
  );

  const rt = useSelector((store) => store.rt);
  const [component, setComponent] = useState(rt);
  const [hasMounted, setHasMounted] = useState(false);
  const [userSymsk, setUserSymsk] = useState<null | string>(null);
  const [activeUserID, setActiveUserID] = useState(
    SecureStore.getItem("activeUserID")
  );
  const [encryptedFeatureConfig, setEncryptedFeatureConfig] = useState<
    null | string
  >(null);

  const db = useSQLiteContext();

  useEffect(() => {
    console.log(localUserIDsActual);
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    if (localUserIDsActual.users.length > 1) {
      const currentActiveUser = SecureStore.getItem("activeUserID");
      if (currentActiveUser !== undefined && currentActiveUser !== null) {
        setActiveUserID(localUserIDsActual.users[0].id);
      } else {
        ///multi account logic but for now pick the first one active by def
        const activeUser = localUserIDsActual.users[0].id;
        SecureStore.setItem("activeUserID", activeUser);
        setActiveUserID(localUserIDsActual.users[0].id);
      }
    } else if (localUserIDsActual.users.length === 1) {
      if (localUserIDsActual.users[0].authenticated === true) {
        const activeUserID = localUserIDsActual.users[0].id;
        SecureStore.setItem("activeUserID", activeUserID);
        setActiveUserID(activeUserID);
      } else {
        navigation.navigate("landingScreen", { name: "landingScreen" });
      }
    }
  }, []);

  useEffect(() => {
    store.dispatch(updateActiveUser(activeUserID));
    function prepareFeatureConfigDecryption() {
      const rawfeatureConfig = db.getFirstSync(
        `SELECT featureConfig, id FROM users WHERE id='${activeUserID}'`
      );
      if (rawfeatureConfig === null) {
        onRequestUserIDs();
      }
      const parsedFeatureConfig = JSON.parse(
        jsesc.default(rawfeatureConfig, { json: true })
      );
      setEncryptedFeatureConfig(parsedFeatureConfig.featureConfig);
      const symskLocal = SecureStore.getItem(`${activeUserID}-symsk`) as string;
      setUserSymsk(symskLocal);
    }
    if (activeUserID !== null) {
      prepareFeatureConfigDecryption();
    }
  }, [activeUserID]);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <FeatureConfigDecryptor
        onError={() => {}}
        onDecryption={(e: string) => {
          const decryptedFC = JSON.parse(e);
          store.dispatch(updateArcFeatureConfig(decryptedFC.arc));
          setHasMounted(true);
        }}
        encryptedFeatureConfig={encryptedFeatureConfig}
        symsk={userSymsk}
      ></FeatureConfigDecryptor>
      <LoadData activeUserID={activeUserID} symsk={userSymsk}></LoadData>
      <StatusBar backgroundColor={globalStyle.statusBarColor}></StatusBar>
      <LinearGradient
        colors={globalStyle.pageBackgroundColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 0.7 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {hasMounted ? (
        <Animated.View
          entering={globalEnteringConfig()}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Header show={true}></Header>
          <RBox
            id="widgetContainer"
            figmaImport={{
              mobile: { top: 22, left: "0", width: "100%", height: 618 },
            }}
          >
            <TimeTracker></TimeTracker>
          </RBox>
          <MenuMain></MenuMain>
        </Animated.View>
      ) : (
        <Animated.View
          entering={globalEnteringConfig(150, 20)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <RBox
            figmaImport={{
              mobile: { left: 155, width: 50, height: 50, top: 264 },
            }}
          >
            <ARCLogoMini width="100%" height="100%"></ARCLogoMini>
          </RBox>
          <RLabel
            figmaImport={{
              mobile: { left: 0, width: "100%", height: 50, top: 330 },
            }}
            text="Decrypting"
          ></RLabel>
          <RBox
            figmaImport={{
              mobile: { left: 155, width: 50, height: 50, top: 340 },
            }}
          >
            <ActivityIndicator color={globalStyle.color}></ActivityIndicator>
          </RBox>
        </Animated.View>
      )}
    </View>
  );
}
