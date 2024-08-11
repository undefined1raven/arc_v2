import store from "@/app/store";
import * as SQLite from "expo-sqlite";

async function getCurrentActivities() {
  const db = await SQLite.openDatabaseAsync("localCache");
  const activeUserID = store.getState().activeUserID;
  const currentActivities = await db.getFirstAsync(
    `SELECT * FROM userData WHERE userID=? AND key=?`,
    [activeUserID, "currentActivities"]
  );
  if (currentActivities === null) {
    return null;
  } else {
    try {
      return JSON.parse(currentActivities.value);
    } catch (e) {
      return [];
    }
  }
}

export { getCurrentActivities };
