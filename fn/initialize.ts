import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";
import { clearTempCredentials } from "./clearTempCredentials";
import { createUsersTable } from "./dbOps";
import store from "@/app/store";
import { updateLocalUserIDs } from "@/hooks/localUserIDs";
import { getInsertStringFromObject } from "./dbUtils";
import { ARC_ChunksType } from "@/app/config/commonTypes";
import { randomUUID } from "expo-crypto";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";

type InitializeReturnType = {
  status: "success" | "failed";
  auth?: boolean;
  hasCache?: boolean;
  error?: string;
  mustCreateNewAccountCreds?: boolean;
  allowedAyncGen?: boolean;
};
type UsersInCache = { id: string }[];
type LocalUserIDsArray = { authenticated: boolean; id: string }[];

type CheckCacheTableResponse = {
  status: "success" | "failed";
  error: null | string | object;
  hasData: boolean; //used when status == 'success' to tell if table is empty;
  tx?: number; //latest timestamp
};

async function initialize(): Promise<InitializeReturnType> {
  var tx = Date.now();
  const db = await SQLite.openDatabaseAsync("localCache");

  function createEmptyArcChunk() {
    const chunkDefault: ARC_ChunksType = {
      id: `ARC-${Date.now()}-${randomUUID()}`,
      userID: "",
      encryptedContent: "",
      tx: Date.now(),
      iv: "",
      version: "0.1.1",
    };
    const insertString = getInsertStringFromObject(chunkDefault);
    if (insertString.error === null && insertString.queryString) {
      return db
        .runAsync(
          `INSERT INTO ARC_Chunks ${insertString.queryString}`,
          insertString.values
        )
        .then(() => {
          return { status: "success", error: null };
        })
        .catch((e) => {
          return { status: "failed", error: e };
        });
    } else {
      return { status: "failed", error: "insert str getter failed" };
    }
  }

  function profile(label) {
    console.log((Date.now() - tx).toString() + " | ", label);
    tx = Date.now();
  }
  profile("ini called");

  profile("db link established");

  SecureStore.deleteItemAsync("temp-pk").catch((e) => {
    return {
      error: "Failed to delete keychain pk",
      errorObj: e,
      status: "failed",
    };
  });
  SecureStore.deleteItemAsync("temp-symsk").catch((e) => {
    return {
      error: "Failed to delete keychain symsk",
      errorObj: e,
      status: "failed",
    };
  });

  async function createCacheTable(
    tableName: "ARC_Chunks" | "SID_Chunks" | "Tess_Chunks"
  ) {
    return db
      .runAsync(
        `CREATE TABLE ${tableName} (id TEXT NOT NULL, userID TEXT NOT NULL, encryptedContent TEXT NOT NULL, tx NUMBER NOT NULL, version TEXT NOT NULL)`
      )
      .then((e) => {
        return { status: "success", error: null, hasData: false };
      })
      .catch((e) => {
        return { status: "failed", error: e, hasData: false };
      });
  }

  const updateLocalUserIDs = useLocalUserIDsStore(
    (store) => store.updateLocalUserIDs
  );
  async function checkCacheTable(
    tableName: "ARC_Chunks" | "SID_Chunks" | "Tess_Chunks"
  ) {
    return db
      .getFirstAsync(`SELECT id, tx FROM ${tableName} ORDER BY tx DESC`)
      .then((r) => {
        if (r === null) {
          ///grab from backend and see if the user has any there

          return { status: "success", error: null, hasData: false };
        } else if (r.tx) {
          return { status: "success", error: null, hasData: true, tx: r.tx };
        }
      })
      .catch(async (e) => {
        const tableCreationOp: CheckCacheTableResponse =
          (await createCacheTable(tableName)) as CheckCacheTableResponse;
        console.log(tableCreationOp, "x");
        return tableCreationOp;
      });
  }

  async function checkUserDataTable(): Promise<{
    status: "success" | "failed";
    error: null | string | object;
  }> {
    return db
      .getFirstAsync(`SELECT userID FROM userData`)
      .then((r) => {
        return { status: "success", error: null };
      })
      .catch((e) => {
        db.runAsync(
          `CREATE TABLE userData (userID TEXT NOT NULL, key TEXT NOT NULL, value TEXT)`
        )
          .then((r) => {
            return { status: "success", error: null };
          })
          .catch((e) => {
            return { status: "failed", error: e };
          });
      })
      .catch((e) => {
        return { status: "failed", error: e };
      });
  }

  async function assessLocalUsers(usersInCache: UsersInCache) {
    const localUserIDsArray: LocalUserIDsArray = [];

    for (let ix = 0; ix < usersInCache.length; ix++) {
      const userID = usersInCache[ix].id;
      if (usersInCache[ix].id !== "temp") {
        const isLocalUser = userID.split(".").length === 2; //local accounts have .local in their id
        const userPrivateKey = await SecureStore.getItemAsync(`${userID}-pk`);
        const userSymsk = await SecureStore.getItemAsync(`${userID}-symsk`);
        if (userPrivateKey !== null && userSymsk !== null) {
          if (isLocalUser) {
            localUserIDsArray.push({ authenticated: true, id: userID });
          } else {
            ///backend auth check first
            localUserIDsArray.push({ authenticated: true, id: userID });
          }
        }
      } else {
        await db.runAsync(`DELETE FROM users WHERE id='temp'`).catch((e) => {});
        profile("delete temp from users");
        return {
          status: "success",
          mustCreateNewAccountCreds: true,
          allowedAyncGen: true,
        };
      }
    }
    updateLocalUserIDs(localUserIDsArray);
  }
  return {};
}
export type { InitializeReturnType };
export { initialize };
