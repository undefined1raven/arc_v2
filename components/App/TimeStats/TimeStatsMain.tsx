import {
  Image,
  StyleSheet,
  Platform,
  View,
  useWindowDimensions,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
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
  SharedValue,
  FadeInRight,
} from "react-native-reanimated";
import { ARCLogoMini } from "@/components/common/deco/ARCLogoMini";
import { ARCLogo } from "@/components/common/deco/ARCLogo";
import store from "@/app/store";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import {
  MenuOverlayButtons,
  MenuOverlayButtonType,
  useMenuConfigStore,
} from "@/stores/mainMenu";
import { BlurView } from "expo-blur";
import RFlatList from "@/components/common/RFlatList";
import RButton from "@/components/common/RButton";
import { Header } from "../Home/Header";
import MenuMain from "@/components/common/menu/MenuMain";
import {
  CartesianChart,
  Line,
  Pie,
  PolarChart,
  useChartPressState,
} from "victory-native";
import MenuList from "@/components/common/menu/MenuList";
import { Circle } from "@shopify/react-native-skia";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { symmetricDecrypt } from "../decryptors/symmetricDecrypt";
import useDecryptionStore from "../decryptors/decryptionStore";
export default function TimeStatsMain({}) {
  const menuApi = useMenuConfigStore();
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);

  function ToolTip({
    x,
    y,
  }: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  }) {
    return <Circle cx={x} cy={y} r={8} color="black" />;
  }
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });
  const menuOverlayStatus = useMenuConfigStore();
  function generateRandomColor(): string {
    // Generating a random number between 0 and 0xFFFFFF
    const randomColor = Math.floor(Math.random() * 0xffffff);
    // Converting the number to a hexadecimal string and padding with zeros
    return `#${randomColor.toString(16).padStart(6, "0")}`;
  }
  const DATA = (numberPoints = 5) => {
    let r = Math.random();
    return Array.from({ length: numberPoints }, (_, index) => ({
      value: index === 0 ? r : 1 - r,
      color: index === 0 ? globalStyle.color : globalStyle.colorInactive,
      label: `Label ${index + 1}`,
    }));
  };

  const currentActivities = useArcCurrentActivitiesStore();

  const HalfDonutChart = () => {
    const [data] = useState(DATA(2));

    return (
      <PolarChart
        data={data}
        labelKey={"label"}
        valueKey={"value"}
        colorKey={"color"}
      >
        <Pie.Chart innerRadius={"80%"} circleSweepDegrees={-360} startAngle={0}>
          {() => {
            return (
              <>
                <Pie.Slice />
                <Pie.SliceAngularInset
                  angularInset={{
                    angularStrokeWidth: 1,
                    angularStrokeColor: globalStyle.textColor,
                  }}
                />
              </>
            );
          }}
        </Pie.Chart>
      </PolarChart>
    );
  };
  const renderItem = ({ item, index }: { item: MenuOverlayButtonType }) => {
    return (
      <Animated.View
        entering={FadeInRight.duration(75)
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
          width="100%"
          height="100%"
          verticalAlign="center"
        >
          <RLabel
            align="left"
            width="70%"
            left="2%"
            height="100%"
            verticalAlign="center"
            fontSize={globalStyle.mediumMobileFont}
            text={item}
          ></RLabel>
          <RBox width="30%" top="10%" height="50%" left="75%">
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <HalfDonutChart></HalfDonutChart>
            </View>
          </RBox>
        </RButton>
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
      <Header show={true}></Header>

      {hasMounted && menuOverlayStatus.menuOverlayConfig.visible === false ? (
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
              mobile: { top: 25, left: 15, width: 329, height: 500 },
            }}
          >
            <RFlatList
              inverted={false}
              data={Object.keys(currentActivities.derivedActivities.byDay)}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              width="100%"
              height="100%"
              renderItem={renderItem}
              top="0%"
              left="0%"
            ></RFlatList>
          </RBox>
        </Animated.View>
      ) : (
        <RBox></RBox>
      )}
      <MenuMain></MenuMain>
      <MenuList></MenuList>
    </View>
  );
}
