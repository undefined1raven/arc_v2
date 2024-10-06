import MenuList from "@/components/common/menu/MenuList";
import MenuMain from "@/components/common/menu/MenuMain";
import RBox from "@/components/common/RBox";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";
import { ActivityIndicator, BackHandler, View } from "react-native";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useMenuConfigStore } from "@/stores/mainMenu";
import { globalEnteringConfig } from "@/app/config/defaultTransitionConfig";
import RLabel from "@/components/common/RLabel";
import RButton from "@/components/common/RButton";
import RFlatList from "@/components/common/RFlatList";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { ArcTaskLogType, FeatureConfigArcType } from "@/app/config/commonTypes";
import { Header } from "../../Home/Header";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";
import { transform } from "@babel/core";

function ActivitiesSettingsMain({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const currentActivities = useArcCurrentActivitiesStore();
  const arcFeatureConfig: FeatureConfigArcType = useArcFeatureConfigStore()
    .arcFeatureConfig as FeatureConfigArcType;
  const menuOverlayStatus = useMenuConfigStore();
  const [hasMounted, setHasMounted] = useState(false);
  type selectedViewType = "activities" | "categories";
  const [selectedView, setSelectedView] =
    useState<selectedViewType>("activities");
  useEffect(() => {
    setHasMounted(true);
    BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
    setStatusBarBackgroundColor(globalStyle.statusBarColor, false);
  }, []);

  return (
    <Animated.View
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

      {hasMounted &&
      menuOverlayStatus.menuOverlayConfig.visible === false &&
      arcFeatureConfig !== null ? (
        <>
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
              backgroundColor={globalStyle.color + "20"}
              figmaImport={{
                mobile: {
                  width: 356,
                  height: 36,
                  top: 28,
                  left: 2,
                },
              }}
            >
              <RLabel
                width="100%"
                align="left"
                verticalAlign="center"
                text="Config / Time tracking"
              ></RLabel>
            </RBox>
            <RButton
              borderColor={
                selectedView === "categories"
                  ? globalStyle.color
                  : globalStyle.colorAccent
              }
              onClick={() => setSelectedView("categories")}
              figmaImport={{
                mobile: { top: 73, left: 185, width: 173, height: 37 },
              }}
            >
              <RLabel
                fontSize={globalStyle.mediumMobileFont}
                color={
                  selectedView === "categories"
                    ? globalStyle.textColor
                    : globalStyle.textColorAccent
                }
                top="20%"
                width="100%"
                text="Categories"
              ></RLabel>
              <RBox
                top="75%"
                width="40%"
                left="30%"
                horizontalCenter={true}
                height={2}
                backgroundColor={
                  selectedView === "categories"
                    ? globalStyle.color
                    : globalStyle.colorAccent
                }
              ></RBox>
            </RButton>
            <RButton
              borderColor={
                selectedView === "activities"
                  ? globalStyle.color
                  : globalStyle.colorAccent
              }
              onClick={() => setSelectedView("activities")}
              figmaImport={{
                mobile: { top: 73, left: 2, width: 173, height: 37 },
              }}
            >
              <RLabel
                fontSize={globalStyle.mediumMobileFont}
                color={
                  selectedView === "activities"
                    ? globalStyle.textColor
                    : globalStyle.textColorAccent
                }
                top="20%"
                width="100%"
                text="Activities"
              ></RLabel>
              <RBox
                top="75%"
                width="40%"
                left="30%"
                horizontalCenter={true}
                height={2}
                backgroundColor={
                  selectedView === "activities"
                    ? globalStyle.color
                    : globalStyle.colorAccent
                }
              ></RBox>
            </RButton>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(150).damping(15)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <RButton
              figmaImport={{
                mobile: { left: 183, width: 174, height: 48, top: 589 },
              }}
            >
              <RLabel
                text="Add category"
                width="80%"
                height="100%"
                left="2%"
                align="left"
                verticalAlign="center"
              ></RLabel>
              <RBox width="20%" height="100%" left="80%">
                <AddIcon width="50%" height="70%"></AddIcon>
              </RBox>
            </RButton>
            <RButton
              onClick={() => {
                navigation.goBack();
              }}
              borderColor={globalStyle.colorAccent}
              figmaImport={{
                mobile: { left: 2, width: 174, height: 48, top: 589 },
              }}
            >
              <RLabel
                color={globalStyle.textColorAccent}
                text="Back"
                width="58%"
                height="100%"
                left="40%"
                align="right"
                verticalAlign="center"
              ></RLabel>
              <RBox
                width="42%"
                height="100%"
                style={{ transform: "rotate(180deg)" }}
                left="0%"
              >
                <ArrowDeco
                  style={{ left: "11%" }}
                  width="60%"
                  height="80%"
                  color={globalStyle.colorAccent}
                ></ArrowDeco>
              </RBox>
            </RButton>
          </Animated.View>
        </>
      ) : (
        <RBox></RBox>
      )}
    </Animated.View>
  );
}

export { ActivitiesSettingsMain };
