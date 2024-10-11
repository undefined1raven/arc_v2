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

function EditActivities({ navigation }) {
  const selectedObjectsAPI = useSelectedObjects();
  const [newName, setNewName] = useState("");
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const arcFeatureConfig = useArcFeatureConfigStore();
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
            text="Config / Edit Activity"
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
              top: 68,
              height: 39,
            },
          }}
        ></RTextInput>
        <RButton
          onClick={() => {
            if (selectedObjectsAPI.selectedActivity === null) return;
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
            console.log("newTasks", newTasks);
            arcFeatureConfig.setArcFeatureConfig({
              ...arcFeatureConfig.arcFeatureConfig,
              tasks: newTasks,
            });
            navigation.goBack()
          }}
          figmaImport={{
            mobile: {
              left: 2,
              top: 589,
              width: 356,
              height: 48,
            },
          }}
        ></RButton>
      </>
    </EmptyView>
  );
}

export { EditActivities };
