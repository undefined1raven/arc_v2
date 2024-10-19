import { AddIcon } from "@/components/common/deco/AddIcon";
import { DayPlannerIcon } from "@/components/common/deco/DayPlannerIcon";
import { EditDeco } from "@/components/common/deco/EditDeco";
import { StatsDeco } from "@/components/common/deco/StatsDeco";
import { EmptyView } from "@/components/common/EmptyView";
import QuickNavMain from "@/components/common/QuickNav/QuickNavMain";
import RBox from "@/components/common/RBox";
import RButton from "@/components/common/RButton";
import RLabel from "@/components/common/RLabel";
import { useTessFeatureConfigStore } from "./tessFeatureConfigStore";
import { ActivityIndicator } from "react-native";
import { useGlobalStyleStore } from "@/stores/globalStyles";

function DayPlannerLoadingScreen({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  return (
    <EmptyView navigation={navigation}>
      <RLabel
        text="Decrypting Data"
        figmaImport={{
          mobile: {
            left: "0",
            width: "100%",
            height: 20,
            top: 246,
          },
        }}
      ></RLabel>
      <RBox
        figmaImport={{
          mobile: {
            left: "0",
            width: "100%",
            height: 20,
            top: 270,
          },
        }}
      >
        <ActivityIndicator color={globalStyle.color}></ActivityIndicator>
      </RBox>
      <RLabel
        fontSize={globalStyle.smallMobileFont}
        text="This can take a few moments. You can go back and come back later"
        figmaImport={{
          mobile: {
            left: "2.5%",
            width: "95%",
            height: 40,
            top: 320,
          },
        }}
      ></RLabel>
    </EmptyView>
  );
}

export { DayPlannerLoadingScreen };
