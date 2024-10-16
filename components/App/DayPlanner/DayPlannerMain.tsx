import { AddIcon } from "@/components/common/deco/AddIcon";
import { EditDeco } from "@/components/common/deco/EditDeco";
import { EmptyView } from "@/components/common/EmptyView";
import QuickNavMain from "@/components/common/QuickNav/QuickNavMain";
import RBox from "@/components/common/RBox";
import RButton from "@/components/common/RButton";
import RLabel from "@/components/common/RLabel";

function DayPlannerMain({navigation}) {
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
      ></RButton>
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
        alignPadding="10%"
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
      ></RButton>
      {/* <QuickNavMain
        navMenuItems={[
          {
            buttonID: "cancel",
            label: "x",
            onClick: () => {
              console.log("cancel");
            },
          },
          {
            buttonID: "hide2",
            label: "Home",
            onClick: () => {
              navigation.navigate("Home", { name: "Home" });
            },
          },
          {
            buttonID: "timeStats",
            label: "Time Stats",
            onClick: () => {
              navigation.navigate("timeStats", { name: "timeStats" });
            },
          },
        ]}
      ></QuickNavMain> */}
    </EmptyView>
  );
}

export { DayPlannerMain };
