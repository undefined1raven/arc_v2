import { EmptyView } from "@/components/common/EmptyView";
import { DayPlannerHeatmapStatsView } from "./DayPlannerHeatmapStatsView";

function DayPlannerStatsMain({ navigation }) {
  return (
    <EmptyView navigation={navigation} showHeader={true} showMenu={false}>
      <DayPlannerHeatmapStatsView></DayPlannerHeatmapStatsView>
    </EmptyView>
  );
}

export { DayPlannerStatsMain };
