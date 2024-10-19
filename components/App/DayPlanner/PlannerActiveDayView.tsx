import { AddIcon } from "@/components/common/deco/AddIcon";
import { DayPlannerIcon } from "@/components/common/deco/DayPlannerIcon";
import { EditDeco } from "@/components/common/deco/EditDeco";
import { StatsDeco } from "@/components/common/deco/StatsDeco";
import { EmptyView } from "@/components/common/EmptyView";
import QuickNavMain from "@/components/common/QuickNav/QuickNavMain";
import RBox from "@/components/common/RBox";
import RButton from "@/components/common/RButton";
import RLabel from "@/components/common/RLabel";

function DayPlannerMain({ navigation }) {
  return (
    <EmptyView showMenu={true}>
      <RLabel
        align="left"
        figmaImport={{
          mobile: {
            left: 2,
            width: 120,
            height: 20,
            top: 32,
          },
        }}
        text="Day Planner"
      ></RLabel>
      <RButton
        figmaImport={{
          mobile: {
            left: 234,
            width: 59,
            height: 26,
            top: 29,
          },
        }}
      >
        <StatsDeco width="90%" height="55%"></StatsDeco>
      </RButton>
      <RButton
        figmaImport={{
          mobile: {
            left: 299,
            width: 59,
            height: 26,
            top: 29,
          },
        }}
      >
        <EditDeco width="90%" height="70%"></EditDeco>
      </RButton>
      <RButton
        alignPadding="2%"
        align="left"
        label="New Day"
        figmaImport={{
          mobile: {
            left: 3,
            width: 352,
            height: 39,
            top: 543,
          },
        }}
      >
        <RBox width="15%" left="87%" height="100%">
          <AddIcon width="70%" height="50%"></AddIcon>
        </RBox>
      </RButton>
    </EmptyView>
  );
}

export { DayPlannerMain };
