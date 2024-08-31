import {
  ActivityIndicator,
  Button,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import RBox from "@/components/common/RBox";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles, {
  GlobalStyleType,
  updateGlobalStyle,
} from "@/hooks/globalStyles";
import RLabel from "@/components/common/RLabel";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, Easing, FadeIn } from "react-native-reanimated";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import { ARCLogo } from "@/components/common/deco/ARCLogo";
import store from "@/app/store";
import {
  getVal,
  globalEnteringConfig,
} from "@/app/config/defaultTransitionConfig";
import { localStorageGet } from "@/fn/localStorage";
import { useSQLiteContext } from "expo-sqlite";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import RButton from "@/components/common/RButton";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { randomUUID } from "expo-crypto";
import { ColorValueHex } from "../CommonTypes";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { quickNavMenuType, useQuickNavStore } from "@/stores/quickNavStore";

type QuickNavMainProps = {
  figmaImport?: object;
  figmaImportConfig?: object;
  style?: object;
  className?: string | string[];
  navMenuItems: quickNavMenuType[];
};

export default function QuickNavMain(props: QuickNavMainProps) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const activeUserID = useLocalUserIDsStore((store) => store.getActiveUserID());
  const [listRenderTop, setListRenderTop] = useState<number>(0);
  const setQuickNavMenuItemByID = useQuickNavStore(
    (store) => store.setQuickNavMenuItemByID
  );
  const [trigerTimeout, setTrigerTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [currentPointerY, setCurrentPointerY] = useState<number>(0);
  const activeButtonID = useQuickNavStore((store) => store.activeButtonID);
  const setActiveButtonID = useQuickNavStore(
    (store) => store.setActiveButtonID
  );

  type propsStyleType = {
    height: Number | string;
    left: Number | string;
    width: Number | string;
    top: Number | string;
  };

  const [sliderProps, setSliderProps] = useState<propsStyleType>({
    width: 23,
    left: 337,
    top: 486 - 35,
    height: 55 + 35,
  });
  const quickNavApi = useQuickNavStore();
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const timeTrackingContainerConfig = {
    containerHeight: 163,
    containerWidth: 354,
  };
  const [containerProps, setContainerProps] = useState<propsStyleType>({
    height: 80,
    width: 23,
    left: 337,
    top: 474,
  });
  const listItemRefs = useRef({});

  useEffect(() => {
    if (isHovering === false && activeButtonID !== null) {
      const fn = props.navMenuItems.find(
        (elm) => elm.buttonID === activeButtonID
      )?.onClick;
      fn?.apply(null, []);
    }
    if (isHovering === false) {
      setContainerProps({
        height: 80,
        width: 23,
        left: 337,
        top: 474,
      });
      setSliderProps({
        height: "100%",
        left: "0%",
        top: "0",
        width: "100%",
      });
    } else {
      setSliderProps({
        height: "100%",
        left: 155,
        top: "0",
        width: 23,
      });
      setContainerProps({
        height: 222,
        width: 178,
        left: 182,
        top: 409,
      });
    }
  }, [isHovering]);

  const renderItem = ({
    item,
    index,
  }: {
    item: { buttonID: "cancel"; label: "Cancel"; onClick: Function };
  }) => {
    if (listItemRefs.current[item.buttonID] === undefined) {
      listItemRefs.current[item.buttonID] = React.createRef();
    }
    return (
      <Animated.View
        ref={listItemRefs.current[item.buttonID]}
        onLayout={(e) => {
          if (listItemRefs.current[item.buttonID] !== undefined) {
            listItemRefs.current[item.buttonID].current.measure(
              (x, y, width, height, pageX, pageY) => {
                setQuickNavMenuItemByID(item.buttonID, {
                  buttonID: item.buttonID,
                  label: item.label,
                  onClick: () => {
                    item.onClick;
                  },
                  startBound: pageY,
                  endBound: pageY + height,
                });
              }
            );
          }
        }}
        entering={FadeInDown.duration(75)
          .damping(30)
          .delay(25 * index)}
        style={{
          position: "relative",
          paddingBottom: "2%",
          alignItems: "center",
          top: "0%",
          justifyContent: "center",
          width: "100%",
          height: 35,
        }}
      >
        <RButton
          hoverOpacityMin="FF"
          hoverOpacityMax="FF"
          backgroundColor={globalStyle.pageBackgroundColors[1]}
          width="100%"
          height="100%"
          borderColor={
            activeButtonID === item.buttonID
              ? globalStyle.color
              : globalStyle.colorAccent
          }
          verticalAlign="center"
        >
          <RBox width="20%" height="80%">
            {/* {React.createElement(item.icon ? ARCLogo : ARCLogoMini)} */}
          </RBox>
          <RBox
            width="1%"
            left="94%"
            top="10%"
            borderRadius={4}
            height="80%"
            backgroundColor={
              activeButtonID === item.buttonID
                ? globalStyle.color
                : globalStyle.colorAccent
            }
          ></RBox>
          <RLabel
            align="left"
            width="70%"
            left="1%"
            fontSize={globalStyle.smallMobileFont}
            height="100%"
            verticalAlign="center"
            text={item.label}
            color={
              activeButtonID === item.buttonID
                ? globalStyle.textColor
                : globalStyle.textColorAccent
            }
          ></RLabel>
        </RButton>
      </Animated.View>
    );
  };

  const data = props.navMenuItems;

  useEffect(() => {
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);

  const pointerYRef = useRef<null | number>(null);

  useEffect(() => {
    pointerYRef.current = currentPointerY;
  }, [currentPointerY]);

  return (
    <RBox
      backgroundColor="#20202020"
      figmaImport={{
        mobile: { ...containerProps },
      }}
    >
      <Animated.View style={{ ...styles.defaultStyle }}>
        <GestureHandlerRootView>
          {isHovering ? (
            <RBox
              figmaImport={{
                mobile: { left: "0", top: "0", width: 150, height: "100%" },
              }}
              figmaImportConfig={{
                containerHeight: containerProps.height,
                containerWidth: containerProps.width,
              }}
              onLayout={(e) => {
                const y = e.nativeEvent.layout.y;
                setListRenderTop(y);
              }}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{ ...styles.defaultStyle }}
                renderItem={renderItem}
                keyExtractor={(item) => item.buttonID}
                data={data}
              ></FlatList>
            </RBox>
          ) : (
            <></>
          )}
          <RButton
            androidRippleEnabled={false}
            hoverOpacityMax="00"
            hoverOpacityMin="00"
            opacity={0}
            onTouchMove={(e) => {
              const absY = e.nativeEvent.pageY;
              setCurrentPointerY(absY);
              const newActiveButton = quickNavApi.quickNavMenu.find((elm) => {
                if (elm.startBound && elm.endBound) {
                  return elm.startBound < absY && elm.endBound > absY;
                }
              });
              // if (

              // ) {
              //   // setActiveButtonID(null);
              //   // setIsHovering(false);
              // }
              if (newActiveButton === undefined) {
                // setActiveButtonID(null);
              } else {
                setActiveButtonID(newActiveButton.buttonID);
              }
              //   setIsHovering(false);
            }}
            mouseLeave={() => {
              if (trigerTimeout !== null) {
                clearTimeout(trigerTimeout);
              }
              const latestY = pointerYRef.current;
              if (
                latestY! > listRenderTop + 0.018 * listRenderTop ||
                latestY! <
                  quickNavApi.sliderProps.y +
                    quickNavApi.sliderProps.height +
                    0.5 * quickNavApi.sliderProps.height
              ) {
                setIsHovering(false);
              }
            }}
            onLayout={(e) => {
              quickNavApi.setSliderProps({
                y: listRenderTop,
                height: e.nativeEvent.layout.height,
              });
            }}
            onLongPress={() => {}}
            mouseEnter={() => {
              setTrigerTimeout(
                setTimeout(() => {
                  setIsHovering(true);
                }, 300)
              );
            }}
            borderColor="#00000000"
            figmaImport={{
              mobile: {
                width: sliderProps.width,
                height: sliderProps.height,
                top: sliderProps.top,
                left: sliderProps.left,
              },
            }}
          >
            <RButton
              hoverOpacityMax="00"
              hoverOpacityMin="00"
              borderColor={globalStyle.color + "00"}
              androidRippleEnabled={false}
              width="80%"
              height="100%"
              left="20%"
              top="0%"
            >
              <>
                <RBox
                  left={"98%"}
                  width={1}
                  height="20%"
                  top="0%"
                  backgroundColor={globalStyle.color}
                ></RBox>
                <RBox
                  left={"98%"}
                  width={1}
                  height="20%"
                  top="25%"
                  backgroundColor={globalStyle.color}
                ></RBox>
                <RBox
                  left={"98%"}
                  width={1}
                  height="20%"
                  top="50%"
                  backgroundColor={globalStyle.color}
                ></RBox>
                <RBox
                  left={"98%"}
                  width={1}
                  height="20%"
                  top="75%"
                  backgroundColor={globalStyle.color}
                ></RBox>
                {isHovering ? (
                  <RBox
                    width={1}
                    height={"100%"}
                    left={"98%"}
                    backgroundColor={globalStyle.color}
                  ></RBox>
                ) : (
                  <RBox></RBox>
                )}
              </>
            </RButton>
          </RButton>
        </GestureHandlerRootView>
      </Animated.View>
    </RBox>
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
