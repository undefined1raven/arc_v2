import { useSQLiteContext } from "expo-sqlite";
import { checkTables } from "./checkTables";
import { useEffect, useState } from "react";
import { getLocalUsers } from "./getLocalUsers";
import { AsyncGenNewAccountInfo } from "./AsyncGenNewAccountInfo";
import { useLoadingScreenMessageStore } from "@/stores/loadingScreenMessage";
import { useHasCheckedTablesStore } from "@/stores/hasCheckedTables";
import { ArcChunksBuffer } from "@/components/common/crypto/ArcChunksBuffer";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import * as SecureStore from "expo-secure-store";
import { getUserDataByID } from "@/fn/dbUtils/getUserDataByID";
import { SingleDecrypt } from "@/components/common/crypto/SingleDecrypt";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import * as format from "jsesc";
import { LoadUserData } from "./LoadUserData";
import { ArcChunksWriteBuffer } from "@/components/common/crypto/ArcChunksWriteBuffer";
import { ArcChunksWriteBufferActual } from "@/components/common/crypto/ArcChunksWriteBufferActual";
function InitializeApp() {
  const db = useSQLiteContext();
  const updateHasCheckedTables =
    useHasCheckedTablesStore.getState().updateHasCheckedTables;
  const updateLoadingMessage =
    useLoadingScreenMessageStore.getState().updateLoadingScreenMessage;
  const localUsers = useLocalUserIDsStore((store) => store.localUserIDs);
  const updateLoaclUsers = useLocalUserIDsStore(
    (store) => store.updateLocalUserIDs
  );
  const [activeUserID, setActiveUserID] = useState<string | null>(null);
  const [arcEncryptedFeatureConfig, setArcEncryptedFeatureConfig] = useState<
    null | string
  >(null);
  const setArcFeatureConfig = useArcFeatureConfigStore(
    (store) => store.setArcFeatureConfig
  );
  const arcFeatureConfig = useArcFeatureConfigStore(
    (store) => store.arcFeatureConfig
  );

  useEffect(() => {
    checkTables()
      .then((res) => {
        updateHasCheckedTables(true); ///used in the async gen account component to know if its safe to proceed
        if (res.status === "success" && res.error === null) {
          if (res.isEmpty !== undefined) {
            if (res.isEmpty === true) {
              updateLoadingMessage({ redirect: "landingScreen" });
            } else {
              getLocalUsers()
                .then((res) => {
                  if (
                    res.status === "success" &&
                    res.error === null &&
                    res.users !== undefined
                  ) {
                    const users = res.users;
                    if (users.length === 0) {
                      updateLoadingMessage({ redirect: "landingScreen" });
                    } else {
                      if (users.length === 1) {
                        const user = users[0];
                        if (user.authenticated === true) {
                          user.isActive = true;
                          SecureStore.setItem("activeUserID", user.id);
                          updateLoaclUsers([user]);
                          setActiveUserID(user.id);
                          ////load user data
                          getUserDataByID(user.id).then((res) => {
                            if (
                              res.status === "success" &&
                              res.data !== null &&
                              res.data !== undefined
                            ) {
                              setArcEncryptedFeatureConfig(
                                res.data?.arcFeatureConfig
                              );
                            } else {
                              //failed
                            }
                          });
                        } else {
                        }
                      } else {
                        ///show multi account picker
                      }
                    }
                  }
                })
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
      {arcEncryptedFeatureConfig !== null && (
        <SingleDecrypt
          encryptedObj={arcEncryptedFeatureConfig}
          onDecrypted={(e) => {
            setArcFeatureConfig(JSON.parse(format.default(e, { json: true })));
          }}
          symsk={SecureStore.getItem(`${activeUserID}-symsk`)}
        ></SingleDecrypt>
      )}
      <ArcChunksBuffer
        activeUserID={activeUserID}
        symsk={SecureStore.getItem(`${activeUserID}-symsk`)}
      ></ArcChunksBuffer>
      <AsyncGenNewAccountInfo></AsyncGenNewAccountInfo>
      <ArcChunksWriteBuffer></ArcChunksWriteBuffer>
      <ArcChunksWriteBufferActual></ArcChunksWriteBufferActual>
      <LoadUserData></LoadUserData>
    </>
  );
}

export { InitializeApp };
