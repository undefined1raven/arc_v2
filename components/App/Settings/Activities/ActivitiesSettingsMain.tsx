import MenuList from "@/components/common/menu/MenuList";
import MenuMain from "@/components/common/menu/MenuMain";
import RBox from "@/components/common/RBox";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
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
import {
  ARCCategoryType,
  ArcTaskLogType,
  ARCTasksType,
  FeatureConfigArcType,
} from "@/app/config/commonTypes";
import { Header } from "../../Home/Header";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";
import { emptyRenderItem } from "@/components/common/EmptyListItem";
import { EditDeco } from "@/components/common/deco/EditDeco";
import { TrashIcon } from "@/components/common/deco/TrashIcon";
import { useSelectedObjects } from "./selectedObjects";
import { randomUUID } from "expo-crypto";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";

function ActivitiesSettingsMain({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const selectedObjectsAPI = useSelectedObjects();
  const currentActivitiesAPI = useArcCurrentActivitiesStore();
  const arcFeatureConfig: FeatureConfigArcType = useArcFeatureConfigStore()
    .arcFeatureConfig as FeatureConfigArcType;
  const arcFeatureConfigAPI = useArcFeatureConfigStore();
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

  function getTaskOrCategoryName(id: string) {
    const split = id.split("-");
    if (split[0] === "TID") {
      return (
        arcFeatureConfig.tasks.find((task) => task.taskID === id)?.name ||
        "Unknown"
      );
    } else {
      return (
        arcFeatureConfig.taskCategories.find(
          (category) => category.categoryID === id
        )?.name || "Unknown"
      );
    }
  }

  function newTask() {
    const newTask: ARCTasksType = {
      name: `New Task ${Date.now().toString().slice(-4)}`,
      taskID: "TID-" + randomUUID(),
      categoryID: null,
      deleted: false,
      version: "0.1.0",
      routineConfig: {
        enabledDays: [0, 1, 2, 3, 4, 5, 6],
        timeConfig: null,
        isActive: false,
      },
      isSpecialStatus: false,
    };
    selectedObjectsAPI.setSelectedActivity(newTask);
    arcFeatureConfig.tasks.push(newTask);
    setTimeout(() => {
      navigation.navigate("editActivities", {
        name: "editActivities",
      });
    }, 80);
  }

  function newCategory() {
    const newCategory: ARCCategoryType = {
      categoryID: "CID-" + randomUUID(),
      name: `New Category ${Date.now().toString().slice(-4)}`,
      deleted: false,
      version: "0.1.0",
    };
    selectedObjectsAPI.setSelectedCategory(newCategory);
    arcFeatureConfig.taskCategories.push(newCategory);
    setTimeout(() => {
      navigation.navigate("editCategories", {
        name: "editCategories",
      });
    }, 80);
  }

  function listRenderItem({ item, index }) {
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
          height: 80,
        }}
      >
        <RBox
          width="100%"
          height="100%"
          borderWidth={1}
          borderColor={globalStyle.color}
        >
          <RButton
            onClick={() => {
              if (selectedView === "activities") {
                selectedObjectsAPI.setSelectedActivity(item);
                navigation.navigate("editActivities", {
                  name: "editActivities",
                });
              } else {
                selectedObjectsAPI.setSelectedCategory(item);
                navigation.navigate("editCategories", {
                  name: "editCategories",
                });
              }
            }}
            borderColor="#00000000"
            left="0%"
            width="85%"
            height="100%"
          >
            <RLabel
              left="2%"
              width="90%"
              height="100%"
              verticalAlign="center"
              align="left"
              text={
                selectedView === "activities"
                  ? getTaskOrCategoryName(item.taskID)
                  : getTaskOrCategoryName(item.categoryID)
              }
            ></RLabel>

            <EditDeco
              style={{ left: "42%" }}
              width="10%"
              height="40%"
            ></EditDeco>
          </RButton>
          <RBox
            width={1}
            top="10%"
            height="80%"
            left="85%"
            backgroundColor={globalStyle.color}
          ></RBox>
          <RButton
            borderColor="#00000000"
            onClick={() => {
              if (selectedObjectsAPI.selectedActivity === null) return;
              if (selectedView === "activities") {
                const newTasks = arcFeatureConfig.tasks;
                const newTask = {
                  ...selectedObjectsAPI.selectedActivity,
                  deleted: true,
                };
                const index = newTasks.findIndex(
                  (task) => task.taskID === newTask.taskID
                );
                if (index === -1) return;
                newTasks[index] = newTask;
                arcFeatureConfigAPI.setArcFeatureConfig({
                  ...arcFeatureConfig,
                  tasks: newTasks,
                });
              } else {
                const newCats = arcFeatureConfig.taskCategories;
                const newCat = {
                  ...item,
                  deleted: true,
                };
                const index = newCats.findIndex(
                  (category) => category.categoryID === newCat.categoryID
                );
                if (index === -1) return;
                newCats[index] = newCat;
                const newTasks = arcFeatureConfig.tasks.map((task) => {
                  if (task.categoryID === newCat.categoryID) {
                    return {
                      ...task,
                      categoryID: null,
                    };
                  } else {
                    return task;
                  }
                });
                arcFeatureConfigAPI.setArcFeatureConfig({
                  ...arcFeatureConfig,
                  taskCategories: newCats,
                  tasks: newTasks,
                });
              }
              console.log("delete");
            }}
            width="15%"
            height="100%"
            left="85%"
          >
            <TrashIcon width="70%" color={globalStyle.errorColor}></TrashIcon>
          </RButton>
        </RBox>
      </Animated.View>
    );
  }

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
                height="100%"
                align="left"
                verticalAlign="center"
                text="Config / Time tracking"
              ></RLabel>
            </RBox>
            <RButton
              transitionIndex={2}
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
              transitionIndex={2}
              borderColor={
                selectedView === "activities"
                  ? globalStyle.color
                  : globalStyle.colorAccent
              }
              onClick={() => {
                setSelectedView("activities");
              }}
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
            <RFlatList
              figmaImport={{
                mobile: { top: 119, left: 2, width: 356, height: 464 },
              }}
              emptyComponent={emptyRenderItem(
                globalStyle,
                `No ${
                  selectedView === "activities" ? "activities" : "categories"
                } to show`
              )}
              inverted={false}
              data={
                selectedView === "activities"
                  ? arcFeatureConfig.tasks.filter((task) => !task.deleted)
                  : arcFeatureConfig.taskCategories.filter(
                      (cat) => !cat.deleted
                    )
              }
              keyExtractor={(item, index) => {
                return selectedView === "activities"
                  ? item.taskID
                  : item.categoryID;
              }}
              renderItem={listRenderItem}
            ></RFlatList>
          </Animated.View>
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
                  if (selectedView === "activities") {
                    newTask();
                  } else {
                    newCategory();
                  }
                }}
                figmaImportConfig={{ containerHeight: 48, containerWidth: 356 }}
                figmaImport={{
                  mobile: { left: 183, width: 174, height: 48, top: "0" },
                }}
              >
                <RLabel
                  text={`Add ${
                    selectedView === "activities" ? "activity" : "category"
                  }`}
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
                figmaImportConfig={{ containerHeight: 48, containerWidth: 356 }}
                borderColor={globalStyle.colorAccent}
                figmaImport={{
                  mobile: { left: 2, width: 174, height: 48, top: "0" },
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
          </RBox>
        </>
      ) : (
        <RBox></RBox>
      )}
    </Animated.View>
  );
}

export { ActivitiesSettingsMain };
