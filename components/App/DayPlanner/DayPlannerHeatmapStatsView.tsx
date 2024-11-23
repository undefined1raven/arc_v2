import RBox from "@/components/common/RBox";
import { useEffect, useState } from "react";
import { useDayPlannerStore } from "./daysStore";

function DayPlannerHeatmapStatsView() {
  const [lists, setLists] = useState([]);
  const dayPlannerAPI = useDayPlannerStore();

  useEffect(() => {}, []);

  return (
    <RBox
      backgroundColor="#000"
      figmaImport={{
        mobile: {
          left: 3,
          top: 70,
          width: 308,
          height: 516,
        },
      }}
    ></RBox>
  );
}

export { DayPlannerHeatmapStatsView };
