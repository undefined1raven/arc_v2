import {
  ActivityIndicator,
  ColorValue,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import RBox from "@/components/common/RBox";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import RLabel from "@/components/common/RLabel";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, {
  FadeInDown,
  Easing,
  FadeIn,
  FadeOut,
  FadeInUp,
} from "react-native-reanimated";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import { ARCLogo } from "@/components/common/deco/ARCLogo";
import store from "@/app/store";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { widgetContainerConfig } from "../widgetContainerConfig";
import { localStorageGet } from "@/fn/localStorage";
import { useSQLiteContext } from "expo-sqlite";
import { activeUserIDType } from "@/hooks/activeUserID";
import RButton from "@/components/common/RButton";
import { BlurView } from "expo-blur";
import { BackHandler, Alert } from "react-native";
import themeColors from "@/app/config/colors";
import {
  FlatList,
  GestureHandlerRootView,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import { updateMenuConfig } from "@/hooks/menuConfig";
import RTextInput from "@/components/common/RTextInput";
import { FeatureConfigArcType, UserDataValues } from "@/app/config/commonTypes";
import { ColorValueHex } from "@/components/common/CommonTypes";
import { SearchIcon } from "@/components/common/deco/SearchIcon";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { getCurrentActivities } from "@/fn/dbUtils/getCurrentActivities";
import { useMenuConfigStore } from "@/stores/mainMenu";

type TimeTrackingActivityMenuProps = {
  onBackButton: Function;
  onTriggerRerender: Function;
};
export default function TimeTrackingActivityMenu(
  props: TimeTrackingActivityMenuProps
) {
  store.subscribe(() => {});
  const globalStyle: GlobalStyleType = useSelector(
    (store) => store.globalStyle
  );
  const activeUserID: activeUserIDType = useSelector(
    (store) => store.activeUserID
  );

  const hideMainMenu = useMenuConfigStore((store) => store.hideMenu);
  const showMainMenu = useMenuConfigStore((store) => store.showMenu);

  const [searchInput, setSearchInput] = useState("");
  const arcFeatureConfig: FeatureConfigArcType = useSelector(
    (store) => store.arcFeatureConfig
  );
  const [hasMounted, setHasMounted] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<null | {
    activityID: string;
    tx: number;
  }>(null);
  const timeTrackingContainerConfig = {
    containerHeight: 163,
    containerWidth: 354,
  };
  const db = useSQLiteContext();
  const menuConfig: MenuConfigType = useSelector((store) => store.menuConfig);

  function onBackTrigger() {
    props.onTriggerRerender();
    showMainMenu();
    props.onBackButton();
  }

  useEffect(() => {
    hideMainMenu();
    BackHandler.addEventListener("hardwareBackPress", () => {
      onBackTrigger();
      return true;
    });
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
    localStorageGet(db, activeUserID, "currentActivity")
      .then((r) => {
        const { status, payload } = r;
        if (status === "success") {
          setCurrentActivity(payload);
          setHasMounted(true);
        }
      })
      .catch((e) => {});
  }, []);

  async function addActivityToCurrentActivities(taskID: string) {
    const currentActivities: UserDataValues["currentActivities"] =
      await getCurrentActivities();
    if (currentActivities === null || currentActivities.length === 0) {
      const newCurrentActivities: UserDataValues["currentActivities"] = [
        { taskID: taskID, tx: Date.now() },
      ];
      await db
        .runAsync(`UPDATE userData SET value=? WHERE userID=? AND key=?`, [
          JSON.stringify(newCurrentActivities),
          activeUserID,
          "currentActivities",
        ])
        .then((r) => {
          db.getFirstAsync(`SELECT * FROM userData WHERE userID=? AND key=?`, [
            activeUserID,
            "currentActivities",
          ])
            .then((r) => {})
            .catch((e) => {
              console.log(e);
            });
          onBackTrigger();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      if (currentActivities.find((elm) => elm.taskID === taskID)) {
        return;
      }
      currentActivities.push({ taskID: taskID, tx: Date.now() });
      await db
        .runAsync(`UPDATE userData SET value=? WHERE userID=? AND key=?`, [
          JSON.stringify(currentActivities),
          activeUserID,
          "currentActivities",
        ])
        .then((r) => {
          onBackTrigger();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  const headerContainerConfig = { containerHeight: 34, containerWidth: 350 };
  const renderItem = ({ item, index }: { item: { name: string } }) => {
    return (
      <Animated.View
        entering={FadeInDown.duration(75)
          .damping(30)
          .delay(25 * index)}
        style={{
          position: "relative",
          paddingBottom: "3%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 80,
        }}
      >
        <RButton
          onClick={() => addActivityToCurrentActivities(item.taskID)}
          width="100%"
          height="100%"
          verticalAlign="center"
        >
          <RLabel
            align="left"
            width="70%"
            left="1%"
            height="100%"
            verticalAlign="center"
            text={item.name}
          ></RLabel>
          <RLabel
            width="30%"
            left="68%"
            top="25%"
            height="50%"
            fontSize={globalStyle.mediumMobileFont}
            backgroundColor={(globalStyle.color + "20") as ColorValueHex}
            verticalAlign="center"
            text={
              arcFeatureConfig.taskCategories.find(
                (elm) => item.categoryID === elm.categoryID
              )?.name
            }
          ></RLabel>
        </RButton>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={styles.defaultStyle}>
      <GestureHandlerRootView>
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
        <RBox
          figmaImportConfig={widgetContainerConfig}
          figmaImport={{
            mobile: {
              top: 8,
              left: 5,
              width: headerContainerConfig.containerWidth,
              height: headerContainerConfig.containerHeight,
            },
          }}
        >
          <Animated.View
            entering={FadeInUp.duration(70).damping(1)}
            style={styles.defaultStyle}
          >
            <RBox width="10%" height="100%">
              <SearchIcon width="65%" height="40%"></SearchIcon>
            </RBox>
            <RTextInput
              placeholder="Search by task or category"
              figmaImportConfig={headerContainerConfig}
              figmaImport={{
                mobile: { width: 278, left: "0%", height: "100%" },
              }}
              returnKeyType="search"
              height="100%"
              borderColor={globalStyle.color}
              textContentType="password"
              textAlignVertical="center"
              align="left"
              alignPadding="12%"
              onInput={(e) => {
                setSearchInput(e);
              }}
              fontSize={globalStyle.regularMobileFont}
            ></RTextInput>
            <RButton
              onClick={() => {}}
              figmaImportConfig={headerContainerConfig}
              figmaImport={{
                mobile: { top: "0", left: 283, width: 67, height: 34 },
              }}
            >
              <AddIcon width="80%" height="40%"></AddIcon>
            </RButton>
          </Animated.View>
        </RBox>
        <RBox
          figmaImport={{
            mobile: { left: 5, width: 350, height: 508, top: 52 },
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ ...styles.defaultStyle }}
            renderItem={renderItem}
            keyExtractor={(item) => item.taskID}
            ListEmptyComponent={() => {}}
            data={arcFeatureConfig.tasks.filter((task) => {
              if (searchInput === "") return true;
              const searchInputLowerCase = searchInput.toLocaleLowerCase();
              const filteredTaskCategories =
                arcFeatureConfig.taskCategories.filter((cat) =>
                  cat.name.toLocaleLowerCase().includes(searchInputLowerCase)
                );
              return (
                task.name
                  .toLocaleLowerCase()
                  .includes(searchInput.toLocaleLowerCase()) ||
                filteredTaskCategories.find(
                  (cat) => cat.categoryID === task.categoryID
                )
              );
            })}
          ></FlatList>
        </RBox>
        <RButton
          style={{ zIndex: 5, elevation: 5 }}
          onClick={() => {
            onBackTrigger();
          }}
          figmaImportConfig={widgetContainerConfig}
          figmaImport={{
            mobile: { top: 565, left: 5, width: 350, height: 48 },
          }}
          label="Back"
        ></RButton>
      </GestureHandlerRootView>
    </Animated.View>
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
