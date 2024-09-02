import store from "@/app/store";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import * as SQLite from "expo-sqlite";

async function getCurrentActivities() {
  const activeUserID = useLocalUserIDsStore.getState().getActiveUserID();
  const db = await SQLite.openDatabaseAsync("localCache");
  const currentActivities = await db.getFirstAsync(
    `SELECT * FROM userData WHERE userID=? AND key=?`,
    [activeUserID, "currentActivities"]
  );
  console.log(currentActivities.value, "from db");
  if (currentActivities === null) {
    return [];
  } else {
    try {
      if (
        currentActivities !== undefined &&
        currentActivities !== null &&
        currentActivities.value !== undefined &&
        currentActivities.value !== null
      ) {
        try {
          return JSON.parse(currentActivities.value);
        } catch (e) {
          console.log(e);
          return [];
        }
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  }
}

export { getCurrentActivities };
