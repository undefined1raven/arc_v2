import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { useEffect } from "react";

function ActivitiesDeriver() {
  const arcActivitiesAPI = useArcCurrentActivitiesStore();
  const activities = arcActivitiesAPI.currentActivities;

  useEffect(() => {
    ///for days
    const days: { [key: string]: string[] } = {};
    for (let ix = 0; ix < activities.length; ix++) {
      const activity = activities[ix];
      const day = new Date(activity.start).toDateString();
      if (days[day] === undefined) {
        days[day] = [activity.taskID];
      } else {
        const newDay = [...days[day], activity.taskID];
        days[day] = newDay;
      }
    }
    arcActivitiesAPI.setByDayDerivedActivities({ byDay: days });
    console.log("day", days);
  }, [activities]);
  ``;
  return <></>;
}

export { ActivitiesDeriver };
