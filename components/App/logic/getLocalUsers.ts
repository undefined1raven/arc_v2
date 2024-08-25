import { getActiveUserID } from "@/fn/SecureStoreUtils/getActiveUserID";
import { getAuthToken } from "@/fn/SecureStoreUtils/getAuthToken";
import { getUserPK } from "@/fn/SecureStoreUtils/getUserPK";
import { getUserSymsk } from "@/fn/SecureStoreUtils/getUserSymsk";
import { localUsersType } from "@/hooks/localUserIDs";
import { LocalUserIDsType } from "@/stores/localUserIDsActual";
import * as SQLite from "expo-sqlite";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
type GetLocalUsersSig = {
  status: "failed" | "success";
  error: null | string;
  users?: LocalUserIDsType[];
};

async function getLocalUsers(): Promise<GetLocalUsersSig> {
  const updateLocalUsers = useLocalUserIDsStore.getState().updateLocalUserIDs;
  const db = await SQLite.openDatabaseAsync("localCache");
  return db
    .getAllAsync(`SELECT id FROM users`)
    .then((result) => {
      const users: LocalUserIDsType[] = [];
      const activeUserID = getActiveUserID();
      for (let ix = 0; ix < result.length; ix++) {
        const userID = result[ix].id;
        if (userID === "temp") {
          continue;
        }
        const splitByDot = userID.split(".");
        if (splitByDot.length === 2 && splitByDot[1] === "local") {
          ///local accounts
          const symsk = getUserSymsk(userID);
          const pk = getUserPK(userID);
          if (pk !== null && symsk !== null) {
            users.push({ authenticated: true, id: userID, isActive: false });
          } else {
            users.push({ authenticated: false, id: userID, isActive: false });
          }
        } else {
          ///online accounts
          let auth = false;
          const authToken = getAuthToken(userID);
          if (authToken !== null) {
            auth = true;
          }
          users.push({ authenticated: auth, id: userID, isActive: false });
        }
      }
      if (activeUserID !== null) {
        ////set active user or leave them all as false for the ui to show the account picker if multiple accounts are present
        for (let ix = 0; ix < users.length; ix++) {
          if (users[ix].id === activeUserID) {
            users[ix].isActive = true;
          }
        }
      }
      updateLocalUsers(users);
      return { status: "success", error: null, users: users };
    })
    .catch((error) => {
      return { status: "failed", error: "GLU-32" };
    });
}

export { getLocalUsers };
