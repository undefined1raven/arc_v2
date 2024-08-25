import { UserData } from "@/app/config/commonTypes";
import * as SQLite from "expo-sqlite";

type getUserDataByIDReturnSig = {
  status: "failed" | "success";
  error: null | string | object;
  data?: UserData | null;
};

async function getUserDataByID(id: string): Promise<getUserDataByIDReturnSig> {
  const db = await SQLite.openDatabaseAsync("localCache");
  return db
    .getFirstAsync("SELECT * FROM users WHERE id=?", [id])
    .then((res) => {
      if (res === null) {
        return { status: "success", error: null, data: null };
      } else {
        return { status: "success", error: null, data: res };
      }
    })
    .catch((e) => {
      return { status: "failed", error: e };
    });
}

export { getUserDataByID };
