import { EmptyView } from "@/components/common/EmptyView";
import RFlatList from "@/components/common/RFlatList";
import RLabel from "@/components/common/RLabel";
import { useTessFeatureConfigStore } from "../../DayPlanner/tessFeatureConfigStore";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import RButton from "@/components/common/RButton";
import { TessStatusType } from "@/app/config/commonTypes";
import { LinearGradient } from "react-native-svg";
import { useEffect, useState } from "react";
import { fromHsv } from "react-native-color-picker";
import { BackHandler } from "react-native";
import RBox from "@/components/common/RBox";
import RTextInput from "@/components/common/RTextInput";
import { TriangleColorPicker } from "react-native-color-picker";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";

function DayPlannerStatusSettings({ navigation }) {
  const tessFeatureConfig = useTessFeatureConfigStore().tessFeatureConfig;
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", () => {
  //     if (isEditingStatus) {
  //       setIsEditingStatus(false);
  //       return true;
  //     }
  //     return false;
  //   });
  // }, []);

  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [colorEditingKey, setColorEditingKey] = useState<string | null>(null);
  const [statusToEdit, setStatusToEdit] = useState<TessStatusType | null>(null);
  const renderItem = ({ item, index }: { item: TessStatusType }) => {
    const color = item.colors[globalStyle.theme].color;
    const textColor = item.colors[globalStyle.theme].textColor;
    const statusName = item.name;
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
            setIsEditingStatus(true);
            setStatusToEdit(item);
          }}
          androidRippleColor={color + "30"}
          width="100%"
          height="100%"
          style={{ overflow: "hidden" }}
          verticalAlign="center"
        >
          <RLabel
            align="left"
            width="100%"
            left="1%"
            top="0%"
            height="100%"
            fontSize={globalStyle.mediumMobileFont}
            verticalAlign="center"
            text={statusName}
          ></RLabel>
          <RBox
            width="20%"
            top="15%"
            height="70%"
            left="78%"
            backgroundColor={color}
          ></RBox>
        </RButton>
      </Animated.View>
    );
  };

  return (
    <EmptyView navigation={navigation} showMenu={false}>
      <RLabel
        align="left"
        text={`Day Planner / ${
          !isEditingStatus ? "Pick a status to edit" : "Edit Status"
        }`}
        figmaImport={{
          mobile: {
            left: 2,
            width: 280,
            height: 20,
            top: 32,
          },
        }}
      ></RLabel>
      {isEditingStatus && (
        <>
          <RLabel
            align="left"
            text={`Name`}
            verticalAlign="center"
            backgroundColor={globalStyle.color + "20"}
            figmaImport={{
              mobile: {
                left: 2,
                width: 105,
                height: 39,
                top: 55,
              },
            }}
          ></RLabel>
          <RTextInput
            onInput={() => {}}
            align="left"
            defaultValue={statusToEdit?.name}
            fontSize={globalStyle.mediumMobileFont}
            alignPadding={10}
            figmaImport={{
              mobile: {
                left: 112,
                width: 246,
                height: 39,
                top: 55,
              },
            }}
          ></RTextInput>
          <RLabel
            align="left"
            text={`Color`}
            verticalAlign="center"
            backgroundColor={globalStyle.color + "20"}
            figmaImport={{
              mobile: {
                left: 2,
                width: 105,
                height: 39,
                top: 99,
              },
            }}
          ></RLabel>
          <RButton
            onClick={() => {
              setColorEditingKey("color");
            }}
            align="left"
            borderColor={statusToEdit?.colors[globalStyle.theme].color}
            fontSize={globalStyle.mediumMobileFont}
            alignPadding={10}
            figmaImport={{
              mobile: {
                left: 112,
                width: 246,
                height: 39,
                top: 99,
              },
            }}
          >
            <RLabel
              height="100%"
              verticalAlign="center"
              width="35%"
              text={statusToEdit?.colors[globalStyle.theme].color.toString()}
            ></RLabel>
            <RBox
              left="40%"
              height="100%"
              width="60%"
              backgroundColor={statusToEdit?.colors[globalStyle.theme].color}
            ></RBox>
          </RButton>
          <RButton
            onClick={() => {
              setColorEditingKey("textColor");
            }}
            align="left"
            borderColor={statusToEdit?.colors[globalStyle.theme].textColor}
            fontSize={globalStyle.mediumMobileFont}
            alignPadding={10}
            figmaImport={{
              mobile: {
                left: 112,
                width: 246,
                height: 39,
                top: 143,
              },
            }}
          >
            <RLabel
              height="100%"
              verticalAlign="center"
              width="35%"
              text={statusToEdit?.colors[
                globalStyle.theme
              ].textColor.toString()}
            ></RLabel>
            <RBox
              left="40%"
              height="100%"
              width="60%"
              backgroundColor={
                statusToEdit?.colors[globalStyle.theme].textColor
              }
            ></RBox>
          </RButton>
          <RLabel
            align="left"
            text={`Text Color`}
            verticalAlign="center"
            backgroundColor={globalStyle.color + "20"}
            figmaImport={{
              mobile: {
                left: 2,
                width: 105,
                height: 39,
                top: 143,
              },
            }}
          ></RLabel>
          {colorEditingKey !== null && (
            <RBox
              figmaImport={{
                mobile: {
                  left: 2,
                  width: 356,
                  height: 338,
                  top: 244,
                },
              }}
            >
              <Animated.View
                style={{
                  top: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <TriangleColorPicker
                  oldColor={
                    statusToEdit?.colors[globalStyle.theme][colorEditingKey] ||
                    "#000"
                  }
                  onColorChange={(color) => {
                    setSelectedColor(fromHsv(color));
                  }}
                  style={{ flex: 1 }}
                ></TriangleColorPicker>
              </Animated.View>
            </RBox>
          )}
          <RButton
            onClick={() => {
              if (statusToEdit === null) return;
              if (colorEditingKey === null) {
                // Save
              } else {
                if (colorEditingKey === "color") {
                  // Save new color
                  const newStatus: TessStatusType = statusToEdit;
                  const currentThemeColors =
                    newStatus.colors[globalStyle.theme];
                  newStatus.colors[globalStyle.theme] = {
                    ...currentThemeColors,
                    color: selectedColor,
                  };
                  const statusIndex = tessFeatureConfig?.statusArray.findIndex(
                    (status) => status.statusID === newStatus.statusID
                  );
                  if (statusIndex === -1) {
                    return;
                  }
                  const newTessFeatureConfig = tessFeatureConfig;
                  newTessFeatureConfig.statusArray[statusIndex] = newStatus;
                  useTessFeatureConfigStore
                    .getState()
                    .setTessFeatureConfig(newTessFeatureConfig);
                  setStatusToEdit(newStatus);
                  colorEditingKey === null;
                } else if (colorEditingKey === "textColor") {
                  // Save new text color
                  const newStatus: TessStatusType = statusToEdit;
                  const currentThemeColors =
                    newStatus.colors[globalStyle.theme];
                  newStatus.colors[globalStyle.theme] = {
                    ...currentThemeColors,
                    textColor: selectedColor,
                  };
                  const statusIndex = tessFeatureConfig?.statusArray.findIndex(
                    (status) => status.statusID === newStatus.statusID
                  );
                  if (statusIndex === -1) {
                    return;
                  }
                  const newTessFeatureConfig = tessFeatureConfig;
                  newTessFeatureConfig.statusArray[statusIndex] = newStatus;
                  console.log(newTessFeatureConfig);
                  useTessFeatureConfigStore
                    .getState()
                    .setTessFeatureConfig(newTessFeatureConfig);
                  setStatusToEdit(newStatus);
                  colorEditingKey === null;
                }
              }
            }}
            figmaImport={{
              mobile: {
                left: colorEditingKey === null ? 2 : 183,
                width: colorEditingKey === null ? 356 : 173,
                height: 48,
                top: 589,
              },
            }}
          >
            <RLabel
              text={colorEditingKey === null ? "Save" : "Save new color"}
              width="80%"
              height="100%"
              left="2%"
              align="left"
              verticalAlign="center"
            ></RLabel>
            {colorEditingKey === null && (
              <RBox width="50%" height="100%" left="60%">
                <ArrowDeco width="50%" height="70%"></ArrowDeco>
              </RBox>
            )}
          </RButton>
          {colorEditingKey !== null && (
            <RButton
              align="left"
              label="Cancel"
              onClick={() => {
                setColorEditingKey(null);
              }}
              figmaImport={{
                mobile: {
                  left: 2,
                  width: 173,
                  height: 48,
                  top: 589,
                },
              }}
            ></RButton>
          )}
        </>
      )}
      {!isEditingStatus ? (
        <RFlatList
          renderItem={renderItem}
          data={tessFeatureConfig?.statusArray}
          figmaImport={{
            mobile: {
              left: 2,
              width: 356,
              height: 524,
              top: 62,
            },
          }}
        ></RFlatList>
      ) : (
        <></>
      )}
    </EmptyView>
  );
}

export { DayPlannerStatusSettings };
