import {
  ActivityIndicator,
  ColorValue,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useContext, useEffect, useState } from "react";
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
import RButton from "@/components/common/RButton";
import { BlurView } from "expo-blur";
import { BackHandler, Alert } from "react-native";
import themeColors from "@/app/config/colors";
import {
  FlatList,
  GestureHandlerRootView,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import RTextInput from "@/components/common/RTextInput";
import { FeatureConfigArcType, UserDataValues } from "@/app/config/commonTypes";
import { ColorValueHex } from "@/components/common/CommonTypes";
import { SearchIcon } from "@/components/common/deco/SearchIcon";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useMenuConfigStore } from "@/stores/mainMenu";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { randomUUID } from "expo-crypto";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";

type TimeTrackingActivityMenuProps = {
  onBackButton: Function;
  onTaskSelected: Function;
};
export default function TimeTrackingActivityMenu(
  props: TimeTrackingActivityMenuProps
) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  const hideMainMenu = useMenuConfigStore((store) => store.hideMenu);
  const showMainMenu = useMenuConfigStore((store) => store.showMenu);

  const [searchInput, setSearchInput] = useState("");
  const arcFeatureConfig: FeatureConfigArcType | null =
    useArcFeatureConfigStore((store) => store.arcFeatureConfig);

  function onBackTrigger() {
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
  }, []);

  const headerContainerConfig = { containerHeight: 34, containerWidth: 350 };
  const renderItem = ({ item, index }: { item: { name: string } }) => {
    return (
      <Animated.View
        entering={FadeInDown.duration(75)
          .damping(30)
          .delay(indexAnimationDelay * index)}
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
          onClick={() => {
            props.onTaskSelected(item.taskID);
            onBackTrigger();
          }}
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
            mobile: { left: 5, width: 350, height: 528, top: 52 },
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ ...styles.defaultStyle }}
            renderItem={renderItem}
            keyExtractor={(item) => item.taskID}
            data={arcFeatureConfig?.tasks.filter((task) => {
              if (task.deleted === true) return false;
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
