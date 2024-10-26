import { TessStatusDeco } from "@/components/common/deco/TessStatusDeco";
import { EmptyView } from "@/components/common/EmptyView";
import RBox from "@/components/common/RBox";
import RFlatList from "@/components/common/RFlatList";
import RLabel from "@/components/common/RLabel";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import React from "react";
import { ActivityIndicator } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useTessFeatureConfigStore } from "./tessFeatureConfigStore";
import { TessTagsDeco } from "@/components/common/deco/TessTagsDeco";
import { TessDayClassifierDeco } from "@/components/common/deco/TessDayClassifierDeco";
import RButton from "@/components/common/RButton";

function DayPlannerSettings({ navigation }) {
  const tessFeatureConfig = useTessFeatureConfigStore(
    (store) => store.tessFeatureConfig
  );
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const listItemConfig = { containerHeight: 120, containerWidth: 356 };
  const settingsList = [
    {
      key: "statusPicker",
      label: "Status Picker",
      description: "Add or remove statuses from the status picker",
      deco: TessStatusDeco,
      navRedirect: "dayPlannerStatusSettings",
    },
    {
      key: "tags",
      label: "Tags",
      description: "Edit tags for tasks",
      deco: TessTagsDeco,
      navRedirect: "Home",
    },
    {
      key: "dayClassifer",
      label: "Day Classifier",
      description: "Edit the day classifier",
      deco: TessDayClassifierDeco,
      navRedirect: "Home",
    },
  ];

  function listRenderItem({ item, index }) {
    let colorsArr = [];
    if (item.key === "tags") {
      try {
        for (let ix = 0; ix < 3; ix++) {
          colorsArr.push(
            tessFeatureConfig?.labelArray[ix]?.colors[globalStyle.theme]?.color
          );
        }
      } catch {
        colorsArr.push(undefined);
      }
    }

    if (item.key === "statusPicker") {
      try {
        for (let ix = 0; ix < 3; ix++) {
          colorsArr.push(
            tessFeatureConfig?.statusArray[ix]?.colors[globalStyle.theme]?.color
          );
        }
      } catch {
        colorsArr.push(undefined);
      }
    }

    if (item.key === "dayClassifer") {
      try {
        for (let ix = 0; ix < 3; ix++) {
          colorsArr.push(
            tessFeatureConfig?.dayClassifier[ix]?.colors[globalStyle.theme]
              ?.color
          );
        }
      } catch {
        colorsArr.push(undefined);
      }
    }
    return (
      <Animated.View
        entering={FadeInRight.duration(75)
          .damping(30)
          .delay(indexAnimationDelay * index)}
        style={{
          position: "relative",
          paddingBottom: "3%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 120,
        }}
      >
        <RButton
          onClick={() => {
            navigation.navigate(item.navRedirect);
          }}
          width="100%"
          height="100%"
          borderWidth={1}
          borderColor={globalStyle.color}
        >
          <RBox top="10%" height="80%" width="17%" left="2%">
            {React.createElement(item.deco, {
              color1: colorsArr[0],
              color2: colorsArr[1],
              color3: colorsArr[2],
              width: "80%",
              height: "80%",
            })}
          </RBox>
          <RLabel
            align="left"
            top="30%"
            width="80%"
            left="20%"
            text={item.label}
          ></RLabel>
          <RLabel
            align="left"
            top="60%"
            width="80%"
            fontSize={globalStyle.smallMobileFont}
            left="20%"
            text={item.description}
          ></RLabel>
        </RButton>
      </Animated.View>
    );
  }

  return (
    <EmptyView navigation={navigation}>
      <RLabel
        text="Day Planner / Settings"
        figmaImport={{
          mobile: {
            left: 2,
            width: 171,
            height: 20,
            top: 32,
          },
        }}
      ></RLabel>
      <RFlatList
        renderItem={listRenderItem}
        data={settingsList}
        figmaImport={{
          mobile: {
            left: 2,
            width: 356,
            height: 524,
            top: 62,
          },
        }}
      ></RFlatList>
    </EmptyView>
  );
}

export { DayPlannerSettings };
