import themeColors, { themeColorKeyToDisplayName } from "@/app/config/colors";
import { EmptyView } from "@/components/common/EmptyView";
import RBox from "@/components/common/RBox";
import RButton from "@/components/common/RButton";
import RFlatList from "@/components/common/RFlatList";
import RLabel from "@/components/common/RLabel";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
function ThemeSettings({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [currentThemeID, setCurrentThemeID] = React.useState("cloudy");
  const updateGlobalStyle = useGlobalStyleStore(
    (store) => store.updateGlobalStyle
  );

  useEffect(() => {
    SecureStore.getItemAsync("theme")
      .then((theme) => {
        if (theme !== null) {
          if (Object.keys(themeColors).includes(theme)) {
            setCurrentThemeID(theme);
          }
        }
      })
      .catch((err) => {});
  }, []);

  let colorScheme = useColorScheme();
  type ThemeType = {
    themeID: string;
    themeName: string;
    color: string;
    textColor: string;
    successColor: string;
    errorColor: string;
  };
  const availableThemes = Object.keys(themeColors).map((theme) => {
    return {
      themeID: theme,
      themeName: themeColorKeyToDisplayName[theme] as string,
      color: themeColors[theme][colorScheme].color,
      textColor: themeColors[theme][colorScheme].textColor,
      successColor: themeColors[theme][colorScheme].successColor,
      errorColor: themeColors[theme][colorScheme].errorColor,
    };
  });

  const renderItem = ({ item, index }: { item: ThemeType }) => {
    return (
      <Animated.View
        entering={FadeInDown.duration(25)
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
            updateGlobalStyle({
              ...themeColors[item.themeID][colorScheme],
            });
            setCurrentThemeID(item.themeID);
            SecureStore.setItemAsync("theme", item.themeID)
              .then(() => {})
              .catch(() => {
                console.log("Error saving theme");
              });
          }}
          width="100%"
          height="100%"
          verticalAlign="center"
        >
          <RLabel
            fontSize={globalStyle.mediumMobileFont}
            left="0%"
            height="70%"
            top="15%"
            width="80%"
            align="left"
            text={item.themeName}
          ></RLabel>
          <RBox
            backgroundColor={item.color}
            left={8 + 20 * 0}
            width={15}
            height={15}
            top="65%"
          ></RBox>
          <RBox
            backgroundColor={item.textColor}
            left={8 + 20 * 1}
            width={15}
            height={15}
            top="65%"
          ></RBox>
          <RBox
            backgroundColor={item.successColor}
            left={8 + 20 * 2}
            width={15}
            height={15}
            top="65%"
          ></RBox>
          <RBox
            backgroundColor={item.errorColor}
            left={8 + 20 * 3}
            width={15}
            height={15}
            top="65%"
          ></RBox>
          <RLabel
            opacity={currentThemeID === item.themeID ? 100 : 0}
            fontSize={globalStyle.mediumMobileFont}
            top="25%"
            left="68%"
            width="30%"
            height="50%"
            verticalAlign="center"
            backgroundColor={globalStyle.color + "20"}
            text="Active"
          ></RLabel>
        </RButton>
      </Animated.View>
    );
  };

  return (
    <EmptyView navigation={navigation} showMenu={false}>
      <RLabel
        align="left"
        verticalAlign="center"
        backgroundColor={globalStyle.color + "20"}
        text="Config / Account Settings / Theme "
        figmaImport={{
          mobile: {
            top: 28,
            left: 5,
            width: 350,
            height: 38,
          },
        }}
      ></RLabel>
      <StatusBar backgroundColor={globalStyle.statusBarColor}></StatusBar>
      <RFlatList
        data={availableThemes}
        renderItem={renderItem}
        figmaImport={{
          mobile: {
            top: 70,
            left: 5,
            width: 350,
            height: 516,
          },
        }}
      ></RFlatList>
    </EmptyView>
  );
}

export { ThemeSettings };
