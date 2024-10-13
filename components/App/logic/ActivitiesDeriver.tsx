import { ArcTaskLogType } from "@/app/config/commonTypes";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { useEffect } from "react";

function ActivitiesDeriver() {
  const arcActivitiesAPI = useArcCurrentActivitiesStore();
  const activities = arcActivitiesAPI.currentActivities.sort(
    (a, b) => a.start - b.start
  );

  useEffect(() => {
    ///for days
    const days: { [key: string]: ArcTaskLogType[] } = {};
    for (let ix = 0; ix < activities.length; ix++) {
      const activity = activities[ix];
      const day = new Date(activity.start).toDateString();
      if (days[day] === undefined) {
        days[day] = [activity];
      } else {
        const newDay = [...days[day], activity];
        days[day] = newDay.sort((a, b) => a.start - b.start);
      }
    }
    arcActivitiesAPI.setByDayDerivedActivities({ byDay: days });
  }, [activities]);

  useEffect(() => {
    ///for duration
    const durations: { [key: string]: number } = {};
    const cumulativeDuration: { [key: string]: number } = {};
    for (let ix = 0; ix < activities.length; ix++) {
      const activity = activities[ix];
      const duration = (activity.end as number) - activity.start;
      if (cumulativeDuration[activity.taskID] === undefined) {
        cumulativeDuration[activity.taskID] = duration / 1000;
      } else {
        const newDuration =
          cumulativeDuration[activity.taskID] + duration / 1000;
        cumulativeDuration[activity.taskID] = newDuration;
      }
      durations[`${activity.start}-${activity.taskID}`] = duration / 1000;
    }
    arcActivitiesAPI.setCumulativeDuration(cumulativeDuration);
    arcActivitiesAPI.setDurationMap(durations);
  }, [activities]);

  return <></>;
}

export { ActivitiesDeriver };
