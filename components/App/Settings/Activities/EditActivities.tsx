import { EmptyView } from "@/components/common/EmptyView";
import RBox from "@/components/common/RBox";
import RLabel from "@/components/common/RLabel";
import RTextInput from "@/components/common/RTextInput";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { ActivityIndicator } from "react-native";
import { useSelectedObjects } from "./selectedObjects";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import RButton from "@/components/common/RButton";
import { useState } from "react";
import RFlatList from "@/components/common/RFlatList";
import { getVal } from "@/app/config/defaultTransitionConfig";
import { emptyRenderItem } from "@/components/common/EmptyListItem";
import Animated, { FadeInRight } from "react-native-reanimated";

function EditActivities({ navigation }) {
  const selectedObjectsAPI = useSelectedObjects();
  const [newName, setNewName] = useState(
    selectedObjectsAPI.selectedActivity?.name
  );
  const [isPickingCategory, setIsPickingCategory] = useState(false);
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const arcFeatureConfig = useArcFeatureConfigStore();

  function listRenderItem({ item, index }) {
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
        <RBox
          width="100%"
          height="100%"
          borderWidth={1}
          borderColor={globalStyle.color}
        >
          <RButton
            onClick={() => {
              const newActivity = {
                ...selectedObjectsAPI.selectedActivity,
                categoryID: item.categoryID,
              };
              const index = arcFeatureConfig.arcFeatureConfig?.tasks.findIndex(
                (task) =>
                  task.taskID === selectedObjectsAPI.selectedActivity?.taskID
              );
              if (index === -1) return;
              const newTasks = [...arcFeatureConfig.arcFeatureConfig.tasks];
              newTasks[index] = newActivity;
              selectedObjectsAPI.setSelectedActivity(newActivity);
              arcFeatureConfig.setArcFeatureConfig({
                ...arcFeatureConfig.arcFeatureConfig,
                tasks: newTasks,
              });
              setIsPickingCategory(false);
            }}
            width="100%"
            height="100%"
            verticalAlign="center"
            align="left"
            alignPadding={"2%"}
            label={item.name}
          ></RButton>
        </RBox>
      </Animated.View>
    );
  }

  return (
    <EmptyView navigation={navigation} showMenu={false}>
      <>
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
            height="100%"
            verticalAlign="center"
            text={`Config / Edit Activity ${
              isPickingCategory ? " / Pick Category" : ""
            }`}
          ></RLabel>
        </RBox>
        {isPickingCategory === false ? (
          <>
            <RLabel
              backgroundColor={globalStyle.color + "20"}
              figmaImport={{
                mobile: {
                  left: 2,
                  width: 105,
                  height: 39,
                  top: 70,
                },
              }}
              align="left"
              fontSize={globalStyle.regularMobileFont}
              alignPadding={8}
              verticalAlign="center"
              text="Name"
            ></RLabel>
            <RTextInput
              align="left"
              fontSize={globalStyle.regularMobileFont}
              alignPadding={"2%"}
              onInput={(e) => {
                if (
                  !selectedObjectsAPI.selectedActivity ||
                  arcFeatureConfig === null
                )
                  return;
                const newName = e;
                setNewName(newName);
              }}
              defaultValue={selectedObjectsAPI.selectedActivity?.name}
              figmaImport={{
                mobile: {
                  left: 112,
                  width: 246,
                  top: 70,
                  height: 39,
                },
              }}
            ></RTextInput>
            <RLabel
              backgroundColor={globalStyle.color + "20"}
              figmaImport={{
                mobile: {
                  left: 2,
                  width: 105,
                  height: 39,
                  top: 115,
                },
              }}
              align="left"
              fontSize={globalStyle.regularMobileFont}
              alignPadding={8}
              verticalAlign="center"
              text="Category"
            ></RLabel>
            <RButton
              onClick={() => {
                setIsPickingCategory(true);
              }}
              align="left"
              mobileFontSize={globalStyle.regularMobileFont}
              alignPadding={"2%"}
              label={
                arcFeatureConfig.arcFeatureConfig?.taskCategories.find(
                  (cat) =>
                    cat.categoryID ===
                    selectedObjectsAPI.selectedActivity?.categoryID
                )?.name || "No category"
              }
              figmaImport={{
                mobile: {
                  left: 112,
                  width: 246,
                  top: 115,
                  height: 39,
                },
              }}
            ></RButton>
          </>
        ) : (
          <>
            <RFlatList
              renderItem={listRenderItem}
              data={getVal(
                arcFeatureConfig.arcFeatureConfig?.taskCategories.filter(
                  (cat) => cat.deleted === false
                ),
                []
              )}
              emptyComponent={emptyRenderItem(globalStyle, "No Categories")}
              figmaImport={{
                mobile: {
                  top: 70,
                  left: 2,
                  width: 356,
                  height: 513,
                },
              }}
            ></RFlatList>
          </>
        )}

        <RButton
          onClick={() => {
            if (isPickingCategory) {
              setIsPickingCategory(false);
              return;
            }
            if (
              selectedObjectsAPI.selectedActivity === null ||
              selectedObjectsAPI.selectedActivity.name === newName
            ) {
              navigation.goBack();
              return;
            }
            const index = arcFeatureConfig.arcFeatureConfig?.tasks.findIndex(
              (task) =>
                task.taskID === selectedObjectsAPI.selectedActivity?.taskID
            );
            if (index === -1) return;
            const newActivity = {
              ...selectedObjectsAPI.selectedActivity,
              name: newName,
            };
            const newTasks = [...arcFeatureConfig.arcFeatureConfig.tasks];
            newTasks[index] = newActivity;
            arcFeatureConfig.setArcFeatureConfig({
              ...arcFeatureConfig.arcFeatureConfig,
              tasks: newTasks,
            });
            navigation.goBack();
          }}
          figmaImport={{
            mobile: {
              left: 2,
              top: 589,
              width: 356,
              height: 48,
            },
          }}
        >
          <RLabel
            text={isPickingCategory ? "Cancel" : "Save"}
            height="100%"
            width="100%"
            verticalAlign="center"
          ></RLabel>
        </RButton>
      </>
    </EmptyView>
  );
}

export { EditActivities };
