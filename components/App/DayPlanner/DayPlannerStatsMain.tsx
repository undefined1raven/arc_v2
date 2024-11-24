import { EmptyView } from "@/components/common/EmptyView";
import { DayPlannerHeatmapStatsView } from "./DayPlannerHeatmapStatsView";
import RButton from "@/components/common/RButton";
import RLabel from "@/components/common/RLabel";
import { useState } from "react";
import { DayPlannerLineChartView } from "./DayPlannerLineChartView";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { DayPlannerPieChartView } from "./DayPlannerPieChart";

function DayPlannerStatsMain({ navigation }) {
  type StatsViews = "heatmap" | "piechart" | "linechart";
  const [statsView, setStatsView] = useState<StatsViews>("heatmap");
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  return (
    <EmptyView navigation={navigation} showHeader={true} showMenu={false}>
      {statsView === "heatmap" && (
        <DayPlannerHeatmapStatsView></DayPlannerHeatmapStatsView>
      )}
      {statsView === "piechart" && (
        <DayPlannerPieChartView></DayPlannerPieChartView>
      )}
      {statsView === "linechart" && (
        <DayPlannerLineChartView></DayPlannerLineChartView>
      )}
      <RButton
        onClick={() => navigation.goBack()}
        label="Back"
        figmaImport={{ mobile: { left: 3, width: 354, height: 48, top: 589 } }}
      ></RButton>
      <RLabel
        align="left"
        text="Day Planner / Stats"
        figmaImport={{ mobile: { left: 0, width: 150, height: 20, top: 32 } }}
      ></RLabel>
      <RButton
        label="H"
        color={
          statsView === "heatmap" ? globalStyle.color : globalStyle.colorAccent
        }
        borderColor={
          statsView === "heatmap" ? globalStyle.color : globalStyle.colorAccent
        }
        onClick={() => setStatsView("heatmap")}
        figmaImport={{ mobile: { left: 314, top: 202, width: 44, height: 44 } }}
      ></RButton>
      <RButton
        label="P"
        borderColor={
          statsView === "piechart" ? globalStyle.color : globalStyle.colorAccent
        }
        color={
          statsView === "piechart" ? globalStyle.color : globalStyle.colorAccent
        }
        onClick={() => setStatsView("piechart")}
        figmaImport={{ mobile: { left: 314, top: 249, width: 44, height: 44 } }}
      ></RButton>
      <RButton
        label="L"
        color={
          statsView === "linechart"
            ? globalStyle.color
            : globalStyle.colorAccent
        }
        borderColor={
          statsView === "linechart"
            ? globalStyle.color
            : globalStyle.colorAccent
        }
        onClick={() => setStatsView("linechart")}
        figmaImport={{ mobile: { left: 314, top: 296, width: 44, height: 44 } }}
      ></RButton>
    </EmptyView>
  );
}

export { DayPlannerStatsMain };
