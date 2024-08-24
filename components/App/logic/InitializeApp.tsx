import { useSQLiteContext } from "expo-sqlite";
import { checkTables } from "./checkTables";
import { useEffect } from "react";
import { getLocalUsers } from "./getLocalUsers";
import { AsyncGenNewAccountInfo } from "./AsyncGenNewAccountInfo";
import { useLoadingScreenMessageStore } from "@/stores/loadingScreenMessage";
import { useHasCheckedTablesStore } from "@/stores/hasCheckedTables";

function InitializeApp() {
  const db = useSQLiteContext();
  const updateHasCheckedTables =
    useHasCheckedTablesStore.getState().updateHasCheckedTables;
  const updateLoadingMessage =
    useLoadingScreenMessageStore.getState().updateLoadingScreenMessage;
  useEffect(() => {
    console.log("here");
    checkTables()
      .then((res) => {
        updateHasCheckedTables(true);
        if (res.status === "success" && res.error === null) {
          if (res.isEmpty !== undefined) {
            if (res.isEmpty === true) {
              updateLoadingMessage({ redirect: "landingScreen" });
            } else {
              getLocalUsers()
                .then((res) => {})
                .catch((e) => {});
            }
          }
        } else {
          console.log("failed to check tables");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  ///check tables
  ///get localUsers and auth status for each
  ///async gen new account info on load (in case we'd need it)
  return (
    <>
      <AsyncGenNewAccountInfo></AsyncGenNewAccountInfo>
    </>
  );
}

export { InitializeApp };
