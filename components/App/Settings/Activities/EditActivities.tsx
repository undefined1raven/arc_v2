import { EmptyView } from "@/components/common/EmptyView";
import RBox from "@/components/common/RBox";
import RLabel from "@/components/common/RLabel";
import RTextInput from "@/components/common/RTextInput";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { ActivityIndicator } from "react-native";
import { useSelectedObjects } from "./selectedObjects";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";

function EditActivities({ navigation }) {
  const selectedObjectsAPI = useSelectedObjects();
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
            if (!selectedObjectsAPI.selectedActivity) return;
            const newArcConfig = { ...arcFeatureConfig.arcFeatureConfig };
            const selectedActivityIndex = newArcConfig.tasks?.findIndex(
              (elm) =>
                elm.taskID === selectedObjectsAPI.selectedActivity?.taskID
            );
            if (!newArcConfig.tasks || selectedActivityIndex === -1) return;
            const newTasks = newArcConfig.tasks.splice(selectedActivityIndex as number, 1);
            newTasks.push({
              ...selectedObjectsAPI.selectedActivity,
              name: e,
            });
            console.log(newTasks);
            newArcConfig['tasks'] = newTasks;
            console.log(
              newArcConfig.tasks?.filter(
                (elm) =>
                  elm.taskID === selectedObjectsAPI.selectedActivity?.taskID
              )[0].name
            );
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
      </>
    </EmptyView>
  );
}

export { EditActivities };
