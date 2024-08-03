import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";
import { clearTempCredentials } from "./clearTempCredentials";
import { createUsersTable } from "./dbOps";
import { useDispatch, useSelector } from "react-redux";
import store from "@/app/store";
import { updateLocalUserIDs } from "@/hooks/localUserIDs";

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

  function profile(label) {
    console.log((Date.now() - tx).toString() + " | ", label);
    tx = Date.now();
  }
  profile("ini called");

  const db = await SQLite.openDatabaseAsync("localCache");

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
        `CREATE TABLE ${tableName} (id TEXT NOT NULL, userID TEXT NOT NULL, encryptedContent TEXT NOT NULL, iv TEXT NOT NULL, tx NUMBER NOT NULL, version TEXT NOT NULL)`
      )
      .then((e) => {
        return { status: "success", error: null, hasData: false };
      })
      .catch((e) => {
        return { status: "failed", error: e, hasData: false };
      });
  }

  async function checkCacheTable(
    tableName: "ARC_Chunks" | "SID_Chunks" | "Tess_Chunks"
  ) {
    return db
      .getFirstAsync(`SELECT id, tx FROM ${tableName} ORDER BY tx DESC`)
      .then((r) => {
        if (r === null) {
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
    store.dispatch(updateLocalUserIDs(localUserIDsArray));
  }

  return db
    .getFirstAsync(`SELECT id FROM users`)
    .then(async (res: { id: string }) => {
      //check if users table exists
      profile("asssess #1");
      if (res !== null) {
        const usersInCache: UsersInCache = await db.getAllAsync(
          `SELECT id FROM users`
        );

        await assessLocalUsers(usersInCache);
        const createCacheTablesPromises = [];
        const currentCacheTables = {
          arc: { tableName: "ARC_Chunks" },
          tess: { tableName: "Tess_Chunks" },
          sid: { tableName: "SID_Chunks" },
        };

        for (let table in currentCacheTables) {
          createCacheTablesPromises.push(
            checkCacheTable(currentCacheTables[table].tableName)
          );
        }

        return Promise.all(createCacheTablesPromises)
          .then((responses) => {
            const hasDataInCache = responses[0].hasData;
            if (hasDataInCache) {
              //check if stale
              return { status: "success", auth: true, hasCache: true };
            } else {
              return { status: "success", auth: true, hasCache: true };
              //go to the backend and fetch latest
            }
          })
          .catch((e) => {
            return { status: "failed", error: "Failed to fix cache state" };
          });
      } else {
        return {
          status: "success",
          mustCreateNewAccountCreds: true,
          allowedAyncGen: true,
        };
      }
    })
    .catch(async (e) => {
      profile("asssess #2");
      console.log(e);
      return db
        .runAsync(
          "CREATE TABLE users (id TEXT PRIMARY KEY, signupTime TEXT NOT NULL, publicKey TEXT NOT NULL, passwordHash TEXT, emailAddress TEXT, passkeys TEXT, PIKBackup TEXT, PSKBackup TEXT, RCKBackup TEXT, trustedDevices TEXT, oauthState TEXT, securityLogs TEXT, featureConfig TEXT NOT NULL, version TEXT NOT NULL);"
        )
        .then((res) => {
          return {
            status: "success",
            mustCreateNewAccountCreds: true,
            allowedAyncGen: true,
          };
        })
        .catch((e) => {
          return { status: "failed", error: e };
        });
    });
}
export type { InitializeReturnType };
export { initialize };
