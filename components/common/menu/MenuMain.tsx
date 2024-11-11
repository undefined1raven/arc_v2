import { View, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import RBox from "@/components/common/RBox";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import * as FileSystem from "expo-file-system";
import RLabel from "@/components/common/RLabel";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, {
  FadeInDown,
  Easing,
  FadeInUp,
} from "react-native-reanimated";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import store from "@/app/store";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { FeatureConfigArcType } from "@/app/config/commonTypes";
import RButton from "../RButton";
import { HomeIcon } from "../deco/HomeIcon";
import { ThreeDotsIcon } from "../deco/ThreeDotsIcon";
import { SettingdIcon } from "../deco/SettingsIcon";
import themeColors from "@/app/config/colors";
import getRandomInt from "@/fn/getRandomInt";
import { MenuConfigType } from "@/hooks/menuConfig";
import { useSQLiteContext } from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import { useMenuConfigStore } from "../../../stores/mainMenu";
import { useNavigation } from "@react-navigation/native";
import { useNavigatorStore } from "@/hooks/navigator";
import { StorageAccessFramework } from "expo-file-system";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";

export default function MenuMain() {
  const navigation = useNavigation();

  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const menuConfig = useMenuConfigStore((store) => store.menuConfig);
  const navigator = useNavigatorStore((store) => store.navigator);
  store.subscribe(() => {});
  const [hasMounted, setHasMounted] = useState(false);
  const containerConfig = { containerHeight: 46, containerWidth: 354 };
  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
      setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    }, 150);
  }, []);
  const { height: screenHeight } = Dimensions.get("window");
  const menuApi = useMenuConfigStore();
  const db = useSQLiteContext();
  const activeUserID = useLocalUserIDsStore().getActiveUserID();

  async function saveFile() {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      console.log("Permission denied");
      return;
    }
    console.log("here 2");

    const userData = await db.getFirstAsync(
      `SELECT * FROM users WHERE id = '${activeUserID}'`
    );
    const arcData = await db.getAllAsync(
      `SELECT * FROM arcChunks WHERE userID = '${activeUserID}'`
    );
    const SIDData = await db.getAllAsync(
      `SELECT * FROM sidChunks WHERE userID = '${activeUserID}'`
    );
    const SIDGroups = await db.getAllAsync(
      `SELECT * FROM sidGroups WHERE userID = '${activeUserID}'`
    );
    const tessData = await db.getAllAsync(
      `SELECT * FROM tessChunks WHERE userID = '${activeUserID}'`
    );
    const pk = await SecureStore.getItemAsync(`${activeUserID}-pk`);
    const symkey = await SecureStore.getItemAsync(`${activeUserID}-symsk`);
    console.log("here");
    let accountBackup = {
      userData,
      arcData,
      SIDData,
      SIDGroups,
      tessData,
      pk,
      symkey,
    };

    function getUTC() {
      const date = new Date();
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    try {
      await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        `ARC_AccountBackup-${getUTC()}-${activeUserID}.arc.backup.txt`,
        "text/plain"
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(
            uri,
            JSON.stringify(accountBackup),
            {
              encoding: FileSystem.EncodingType.UTF8,
            }
          );
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      throw new Error(e);
    }
  }

  return menuConfig.visible ? (
    <RBox
      figmaImport={{
        mobile: {
          top: 589,
          left: 3,
          width: containerConfig.containerWidth,
          height: containerConfig.containerHeight,
        },
      }}
    >
      <Animated.View
        style={styles.defaultStyle}
        entering={FadeInDown.duration(100).damping(1)}
      >
        <RButton
          onLongPress={() => {
            // console.log("xx");
            // db.runAsync("DROP TABLE users");
            // db.runAsync("DROP TABLE userData");
            // db.runAsync("DROP TABLE arcChunks");
            // if (navigator !== null) {
            //   // navigator.navigate("SettingsMain", { name: "SettingsMain" });
            // }
          }}
          onClick={async () => {
            await saveFile();
          }}
          figmaImportConfig={containerConfig}
          figmaImport={{
            mobile: { left: "0%", height: "100%", width: 116, top: "0%" },
          }}
        >
          <SettingdIcon width="50%" height="50%"></SettingdIcon>
        </RButton>
        <RButton
          onClick={() => {
            if (navigator !== null) {
              navigator.navigate("Home", { name: "Home" });
            }
          }}
          verticalAlign="center"
          figmaImportConfig={containerConfig}
          figmaImport={{
            mobile: { left: 119, height: "100%", width: 116, top: "0%" },
          }}
        >
          <HomeIcon width="60%" height="60%"></HomeIcon>
        </RButton>
        <RButton
          figmaImportConfig={containerConfig}
          onClick={() => {
            menuApi.setOverlayMenuVisibility(true);
          }}
          figmaImport={{
            mobile: { left: 238, height: "100%", width: 116, top: "0%" },
          }}
        >
          <ThreeDotsIcon width="22%" height="30%"></ThreeDotsIcon>
        </RButton>
      </Animated.View>
    </RBox>
  ) : (
    <RBox></RBox>
  );
}
const styles = StyleSheet.create({
  defaultStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
});
