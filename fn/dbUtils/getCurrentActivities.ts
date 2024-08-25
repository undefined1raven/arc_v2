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
  if (currentActivities === null) {
    return [];
  } else {
    try {
      return JSON.parse(currentActivities.value);
    } catch (e) {
      return [];
    }
  }
}

export { getCurrentActivities };
