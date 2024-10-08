import { EmptyView } from "@/components/common/EmptyView";
import RBox from "@/components/common/RBox";
import RLabel from "@/components/common/RLabel";
import RTextInput from "@/components/common/RTextInput";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { ActivityIndicator } from "react-native";

function EditActivities({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
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
          onInput={() => {}}
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
