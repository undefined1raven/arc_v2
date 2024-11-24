import { EmptyView } from "@/components/common/EmptyView";
import RFlatList from "@/components/common/RFlatList";
import RLabel from "@/components/common/RLabel";
import { useTessFeatureConfigStore } from "../../DayPlanner/tessFeatureConfigStore";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import RButton from "@/components/common/RButton";
import { DayClassifierType, TessStatusType } from "@/app/config/commonTypes";
import { LinearGradient } from "react-native-svg";
import { useEffect, useState } from "react";
import { fromHsv } from "react-native-color-picker";
import { BackHandler } from "react-native";
import RBox from "@/components/common/RBox";
import RTextInput from "@/components/common/RTextInput";
import { TriangleColorPicker } from "react-native-color-picker";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";
import { updateTessFeatureConfig } from "../../logic/TessSync";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { randomUUID } from "expo-crypto";
import themeColors from "@/app/config/colors";

function DayPlannerDayClassifierSettings({ navigation }) {
  const tessFeatureConfig = useTessFeatureConfigStore().tessFeatureConfig;
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);

  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [colorEditingKey, setColorEditingKey] = useState<string | null>(null);
  const [newCompletionEffect, setNewCompletionEffect] = useState<number>(0);
  const [newStatusName, setNewStatusName] = useState<string>("");
  const [statusToEdit, setStatusToEdit] = useState<DayClassifierType | null>(
    null
  );
  const renderItem = ({ item, index }: { item: DayClassifierType }) => {
    const color = item.colors[globalStyle.theme].color;
    const statusName = item.label;
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
          !isEditingStatus
            ? "Pick a day class to edit"
            : "Edit Day Classification"
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
            onInput={(e) => {
              setNewStatusName(e);
            }}
            align="left"
            value={statusToEdit?.label}
            defaultValue={statusToEdit?.label}
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
          <RLabel
            align="left"
            text={`Threshold`}
            verticalAlign="center"
            backgroundColor={globalStyle.color + "20"}
            figmaImport={{
              mobile: {
                left: 2,
                width: 105,
                height: 39,
                top: 187,
              },
            }}
          ></RLabel>
          <RLabel
            align="left"
            fontSize={globalStyle.smallMobileFont}
            text={`A value from 0 to 1 where 1 is 100% of the tasks completed`}
            verticalAlign="center"
            backgroundColor={globalStyle.color + "20"}
            figmaImport={{
              mobile: {
                left: 112,
                width: 166,
                height: 39,
                top: 187,
              },
            }}
          ></RLabel>
          <RTextInput
            onInput={(e) => {
              const parsedScore = parseFloat(e);
              if (
                isNaN(parsedScore) === false &&
                parsedScore >= 0 &&
                parsedScore <= 1
              ) {
                setNewCompletionEffect(parsedScore);
              }
            }}
            align="left"
            keyboardType="numeric"
            defaultValue={statusToEdit?.threshold.toString()}
            value={statusToEdit?.threshold.toString()}
            fontSize={globalStyle.mediumMobileFont}
            alignPadding={10}
            figmaImport={{
              mobile: {
                left: 283,
                width: 74,
                height: 39,
                top: 187,
              },
            }}
          ></RTextInput>
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
                const currentName = statusToEdit.label;
                const newName = newStatusName;
                if (
                  (currentName !== newName && newName.length > 0) ||
                  newCompletionEffect !== statusToEdit.threshold
                ) {
                  const newStatus: DayClassifierType = statusToEdit;
                  if (currentName !== newName && newName.length > 0) {
                    newStatus.label = newName;
                  }
                  if (newCompletionEffect !== statusToEdit.threshold) {
                    newStatus.threshold = newCompletionEffect;
                  }
                  const statusIndex =
                    tessFeatureConfig?.dayClassifier.findIndex(
                      (status) => status.dayClassID === newStatus.dayClassID
                    );
                  if (statusIndex === -1) {
                    return;
                  }
                  const newTessFeatureConfig = tessFeatureConfig;
                  newTessFeatureConfig.dayClassifier[statusIndex] = newStatus;

                  useTessFeatureConfigStore
                    .getState()
                    .setTessFeatureConfig(newTessFeatureConfig);
                  setTimeout(() => {
                    try {
                      updateTessFeatureConfig();
                    } catch (e) {}
                  }, 50);
                  setStatusToEdit(newStatus);
                  setIsEditingStatus(false);
                } else {
                  setIsEditingStatus(false);
                }
              } else {
                if (colorEditingKey === "color") {
                  // Save new color
                  const newStatus: DayClassifierType = statusToEdit;
                  const currentThemeColors =
                    newStatus.colors[globalStyle.theme];
                  newStatus.colors[globalStyle.theme] = {
                    ...currentThemeColors,
                    color: selectedColor,
                  };
                  const statusIndex =
                    tessFeatureConfig?.dayClassifier.findIndex(
                      (status) => status.dayClassID === newStatus.dayClassID
                    );
                  if (statusIndex === -1) {
                    return;
                  }
                  const newTessFeatureConfig = tessFeatureConfig;
                  newTessFeatureConfig.dayClassifier[statusIndex] = newStatus;
                  useTessFeatureConfigStore
                    .getState()
                    .setTessFeatureConfig(newTessFeatureConfig);

                  setTimeout(() => {
                    try {
                      updateTessFeatureConfig();
                    } catch (e) {}
                  }, 50);
                  setStatusToEdit(newStatus);
                  colorEditingKey === null;
                  setColorEditingKey(null);
                } else if (colorEditingKey === "textColor") {
                  // Save new text color
                  const newStatus: DayClassifierType = statusToEdit;
                  const currentThemeColors =
                    newStatus.colors[globalStyle.theme];
                  newStatus.colors[globalStyle.theme] = {
                    ...currentThemeColors,
                    textColor: selectedColor,
                  };
                  const statusIndex =
                    tessFeatureConfig?.dayClassifier.findIndex(
                      (status) => status.dayClassID === newStatus.dayClassID
                    );
                  if (statusIndex === -1) {
                    return;
                  }
                  const newTessFeatureConfig = tessFeatureConfig;
                  newTessFeatureConfig.dayClassifier[statusIndex] = newStatus;
                  useTessFeatureConfigStore
                    .getState()
                    .setTessFeatureConfig(newTessFeatureConfig);
                  setTimeout(() => {
                    try {
                      updateTessFeatureConfig();
                    } catch (e) {}
                  }, 50);
                  setStatusToEdit(newStatus);
                  colorEditingKey === null;
                  setColorEditingKey(null);
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
        <>
          <RFlatList
            renderItem={renderItem}
            data={tessFeatureConfig?.dayClassifier}
            figmaImport={{
              mobile: {
                left: 2,
                width: 356,
                height: 524,
                top: 62,
              },
            }}
          ></RFlatList>
          <RBox
            figmaImport={{
              mobile: { left: 2, width: 356, height: 48, top: 589 },
            }}
          >
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
                onClick={() => {
                  navigation.navigate("dayPlanner");
                }}
                figmaImportConfig={{ containerHeight: 48, containerWidth: 356 }}
                figmaImport={{
                  mobile: { left: 183, width: 174, height: 48, top: "0" },
                }}
              >
                <RLabel
                  text="Back"
                  width="80%"
                  height="100%"
                  left="2%"
                  align="left"
                  verticalAlign="center"
                ></RLabel>
                <RBox width="50%" height="100%" left="60%">
                  <ArrowDeco width="50%" height="70%"></ArrowDeco>
                </RBox>
              </RButton>
              <RButton
                onClick={() => {
                  const newStatus: DayClassifierType = {
                    dayClassID: `DCID-${randomUUID()}`,
                    label:
                      "New Day Classifier " + Date.now().toString().slice(-4),
                    colors: {
                      dark: {
                        color: themeColors.cloudy.dark.color,
                        textColor: themeColors.cloudy.dark.textColor,
                      },
                      light: {
                        color: themeColors.cloudy.light.color,
                        textColor: themeColors.cloudy.light.textColor,
                      },
                    },
                    threshold: 0,
                    version: "0.1.1",
                  };
                  const newTessFeatureConfig = tessFeatureConfig;
                  newTessFeatureConfig?.dayClassifier.push(newStatus);
                  useTessFeatureConfigStore
                    .getState()
                    .setTessFeatureConfig(newTessFeatureConfig);
                  setTimeout(() => {
                    try {
                      updateTessFeatureConfig();
                    } catch (e) {}
                  }, 50);
                }}
                figmaImportConfig={{ containerHeight: 48, containerWidth: 356 }}
                figmaImport={{
                  mobile: { left: 2, width: 174, height: 48, top: "0" },
                }}
              >
                <RLabel
                  text="Add Status"
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
                  <AddIcon
                    style={{ left: "25%" }}
                    width="60%"
                    height="40%"
                  ></AddIcon>
                </RBox>
              </RButton>
            </Animated.View>
          </RBox>
        </>
      ) : (
        <></>
      )}
    </EmptyView>
  );
}

export { DayPlannerDayClassifierSettings };
