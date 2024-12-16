import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
async function logout() {
  const db = await SQLite.openDatabaseAsync("localCache");
  db.runAsync("DROP TABLE users");
  db.runAsync("DROP TABLE userData");
}

export { logout };
