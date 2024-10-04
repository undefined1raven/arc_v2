import { useSQLiteContext } from "expo-sqlite";
import { checkTables } from "./checkTables";
import { useEffect, useState } from "react";
import { getLocalUsers } from "./getLocalUsers";
import { AsyncGenNewAccountInfo } from "./AsyncGenNewAccountInfo";
import { useLoadingScreenMessageStore } from "@/stores/loadingScreenMessage";
import { useHasCheckedTablesStore } from "@/stores/hasCheckedTables";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import * as SecureStore from "expo-secure-store";
import { getUserDataByID } from "@/fn/dbUtils/getUserDataByID";
import { SingleDecrypt } from "@/components/common/crypto/SingleDecrypt";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import * as format from "jsesc";
import { LoadUserData } from "./LoadUserData";
import useDecryptionStore from "../decryptors/decryptionStore";
import useEncryptionStore from "../encryptors/encryptionStore";
import { SingleEncrypt } from "@/components/common/crypto/SingleEncrypt";
import { CryptoMain } from "../CryptoMain";
import { MultiDecrypt } from "@/components/common/crypto/MultiDecrypt";
function InitializeApp() {
  const db = useSQLiteContext();
  const decryptionAPI = useDecryptionStore();
  const encryptionAPI = useEncryptionStore();
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
      <MultiDecrypt
        encryptedObj={decryptionAPI.cipherText}
        onDecrypted={(e) => {
          decryptionAPI.setCipherText(null);
          decryptionAPI.setDecryptedData(e);
        }}
        onError={(e) => {
          decryptionAPI.setCipherText(null);
          decryptionAPI.setDecryptedData("error");
        }}
        symsk={SecureStore.getItem(`${activeUserID}-symsk`)}
      ></MultiDecrypt>
      {encryptionAPI.plain !== null && (
        <SingleEncrypt
          plainText={encryptionAPI.plain}
          onEncrypted={(e) => {
            encryptionAPI.setEncryptedData(e);
            encryptionAPI.setPlain(null);
          }}
          onError={(e) => {
            encryptionAPI.setEncryptedData("error");
            encryptionAPI.setPlain(null);
          }}
          symsk={SecureStore.getItem(`${activeUserID}-symsk`)}
        ></SingleEncrypt>
      )}
      <AsyncGenNewAccountInfo></AsyncGenNewAccountInfo>
      <LoadUserData></LoadUserData>
    </>
  );
}

export { InitializeApp };
