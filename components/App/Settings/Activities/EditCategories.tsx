import { EmptyView } from "@/components/common/EmptyView";
import RBox from "@/components/common/RBox";
import RLabel from "@/components/common/RLabel";
import RTextInput from "@/components/common/RTextInput";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { ActivityIndicator } from "react-native";
import { useSelectedObjects } from "./selectedObjects";
import RButton from "@/components/common/RButton";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { useState } from "react";
function EditCategories({ navigation }) {
  const selectedObjectsAPI = useSelectedObjects();
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const arcFeatureConfig = useArcFeatureConfigStore();
  const [newName, setNewName] = useState(
    selectedObjectsAPI.selectedCategory?.name
  );
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
            text="Config / Edit Category"
          ></RLabel>
        </RBox>
        <RLabel
          backgroundColor={globalStyle.color + "20"}
          figmaImport={{
            mobile: {
              left: 2,
              width: 105,
              height: 39,
              top: 68,
            },
          }}
          align="left"
          alignPadding={8}
          verticalAlign="center"
          text="Name"
        ></RLabel>
        <RTextInput
          onInput={(e) => {
            setNewName(e);
          }}
          defaultValue={selectedObjectsAPI.selectedCategory?.name}
          figmaImport={{
            mobile: {
              left: 112,
              width: 246,
              top: 68,
              height: 39,
            },
          }}
        ></RTextInput>
        <RButton
          onClick={() => {
            if (
              selectedObjectsAPI.selectedCategory === null ||
              selectedObjectsAPI.selectedCategory.name === newName
            ){
              navigation.goBack();
              return;
            }
            const index =
              arcFeatureConfig.arcFeatureConfig?.taskCategories.findIndex(
                (task) =>
                  task.categoryID ===
                  selectedObjectsAPI.selectedCategory?.categoryID
              );
            if (index === -1) return;
            const newCategory = {
              ...selectedObjectsAPI.selectedCategory,
              name: newName,
            };
            const newTaskCategories = [
              ...arcFeatureConfig.arcFeatureConfig?.taskCategories,
            ];
            newTaskCategories[index] = newCategory;
            arcFeatureConfig.setArcFeatureConfig({
              ...arcFeatureConfig.arcFeatureConfig,
              taskCategories: newTaskCategories,
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
            text="Save"
            height="100%"
            width="100%"
            verticalAlign="center"
          ></RLabel>
        </RButton>
      </>
    </EmptyView>
  );
}

export { EditCategories };
