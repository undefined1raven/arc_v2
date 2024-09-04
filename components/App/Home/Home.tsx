import { View, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import React, { useContext, useEffect, useState } from "react";
import RButton from "@/components/common/RButton";
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
import { Header } from "./Header";
import TimeTracker from "./Widgets/TimeTracker";
import MenuMain from "@/components/common/menu/MenuMain";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import QuickNavMain from "@/components/common/QuickNav/QuickNavMain";
import { ARCLogo } from "@/components/common/deco/ARCLogo";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { randomUUID } from "expo-crypto";
import MenuList from "@/components/common/menu/MenuList";
import { BlurView } from "expo-blur";

type HomeProps = { onRequestUserIDs: Function };
export default function Home({ navigation, onRequestUserIDs }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  // const [t, st] = useState<{ dataStr: string; isOff: boolean }[]>([]);
  // useEffect(() => {
  //   const startUnix = Date.now();
  //   for (let ix = 0; ix < 500; ix++) {
  //     const date = new Date(startUnix + ix * 86400000);
  //     const day = date.getDate();
  //     const monthThreeLetter = date.toLocaleString("default", {
  //       month: "short",
  //     });
  //     const dayOfWeek = date.toLocaleString("default", { weekday: "short" });
  //     const isOff = ix % 8 < 4;

  //     st((prev) => {
  //       return [
  //         ...prev,
  //         {
  //           dateStr: `${day} ${monthThreeLetter} | ${dayOfWeek}`,
  //           isOff: isOff,
  //         },
  //       ];
  //     });
  //   }
  // }, []);

  const renderItem = ({
    item,
    index,
  }: {
    item: { dateStr: string; isOff: boolean };
  }) => {
    return (
      <Animated.View
        key={item.dateStr}
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
        <RBox
          backgroundColor={
            (item.isOff ? globalStyle.successColor : globalStyle.errorColor) +
            "70"
          }
          width="100%"
          height="100%"
        >
          <RLabel
            align="left"
            width="70%"
            left="1%"
            height="100%"
            color="#000"
            verticalAlign="center"
            text={item.dateStr}
          ></RLabel>
          {item.dateStr.includes("Sun") || item.dateStr.includes("Sat") ? (
            <RLabel
              text="Weekend"
              left="70%"
              width="30%"
              color="#000"
              align="center"
              verticalAlign="center"
              height="100%"
              fontSize={globalStyle.largeMobileFont}
            ></RLabel>
          ) : (
            <></>
          )}
        </RBox>
      </Animated.View>
    );
  };

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
        <QuickNavMain
          navMenuItems={[
            {
              buttonID: "cancel",
              label: "x",
              onClick: () => {
                console.log("cancel");
              },
            },
            {
              buttonID: "hide2",
              label: "Hide2",
              onClick: () => {
                console.log("hide2");
              },
            },
            {
              buttonID: "timeStats",
              label: "Time Stats",
              onClick: () => {
                navigation.navigate("timeStats", { name: "timeStats" });
                console.log("remove");
              },
            },
          ]}
        ></QuickNavMain>
        {/* <GestureHandlerRootView>
          <RBox
          figmaImport={{
            mobile: { left: 5, width: 350, height: 508, top: 52 },
            }}
            >
            <FlatList
            showsVerticalScrollIndicator={false}
            style={{ ...styles.defaultStyle }}
            renderItem={renderItem}
            keyExtractor={(item) => item.tx}
            data={t}
            ></FlatList>
            </RBox>
            </GestureHandlerRootView> */}
      </Animated.View>
      <MenuList></MenuList>
    </View>
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
