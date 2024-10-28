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
import { useHasLoadedUserDataStore } from "../Home/hasLoadedUserData";
import { useTessFeatureConfigStore } from "../DayPlanner/tessFeatureConfigStore";
import { LoadTessData } from "./LoadTessData";
import { useActiveDayStore } from "../DayPlanner/activeDayStore";
import { useDayPlannerStore } from "../DayPlanner/daysStore";
import { TessSync } from "./TessSync";
import { migrateTessFeatureConfigFromv010Tov011 } from "./featureConfigVersionMigrations";
import { symmetricEncrypt } from "../encryptors/symmetricEncrypt";
function InitializeApp({ navigation }) {
  const db = useSQLiteContext();
  const decryptionAPI = useDecryptionStore();
  const encryptionAPI = useEncryptionStore();
  const hasLoadedUserDataAPI = useHasLoadedUserDataStore();
  const [hasUsers, setHasUsers] = useState(false);
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
  const [tessEncryptedFeatureConfig, setTessEncryptedFeatureConfig] = useState<
    string | null
  >(null);
  const setTessFeatureConfig =
    useTessFeatureConfigStore.getState().setTessFeatureConfig;
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
                  console.log(res, "checkTables");
                  if (
                    res.status === "success" &&
                    res.error === null &&
                    res.users !== undefined
                  ) {
                    const users = res.users;
                    if (users.length === 0) {
                      console.log("no users");
                      updateLoadingMessage({ redirect: "landingScreen" });
                    } else {
                      setHasUsers(true);
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
                              setTessEncryptedFeatureConfig(
                                res.data?.tessFeatureConfig
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
      <TessSync></TessSync>
      {arcEncryptedFeatureConfig !== null &&
        hasLoadedUserDataAPI.hasLoadedUserData === false && (
          <SingleDecrypt
            encryptedObj={arcEncryptedFeatureConfig}
            onDecrypted={(e) => {
              setArcFeatureConfig(
                JSON.parse(format.default(e, { json: true }))
              );
            }}
            onError={() => {
              console.log("failed to decrypt arc feature config");
            }}
            symsk={SecureStore.getItem(
              hasLoadedUserDataAPI.keyType === "simple"
                ? `${activeUserID}-symsk`
                : `${activeUserID}-tess-symkey`
            )}
          ></SingleDecrypt>
        )}
      {tessEncryptedFeatureConfig !== null && (
        <SingleDecrypt
          encryptedObj={tessEncryptedFeatureConfig}
          onDecrypted={(e) => {
            setTessEncryptedFeatureConfig(null);
            const cachedTessFeatureConfig = JSON.parse(
              format.default(e, { json: true })
            );

            const latestTessFeatureConfig =
              migrateTessFeatureConfigFromv010Tov011(cachedTessFeatureConfig);

            setTessFeatureConfig(latestTessFeatureConfig);
          }}
          onError={() => {
            console.log("failed to decrypt tess feature config");
          }}
          symsk={SecureStore.getItem(
            hasLoadedUserDataAPI.keyType === "simple"
              ? `${activeUserID}-symsk`
              : `${activeUserID}-tess-symkey`
          )}
        ></SingleDecrypt>
      )}
      {(hasLoadedUserDataAPI.hasTessKey === true &&
        hasLoadedUserDataAPI.keyType === "double") ||
      hasLoadedUserDataAPI.keyType === "simple" ? (
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
          symsk={SecureStore.getItem(
            hasLoadedUserDataAPI.keyType === "simple"
              ? `${activeUserID}-symsk`
              : `${activeUserID}-tess-symkey`
          )}
        ></MultiDecrypt>
      ) : (
        <></>
      )}
      {encryptionAPI.plain !== null && (
        <SingleEncrypt
          plainText={encryptionAPI.plain}
          onEncrypted={(e) => {
            // encryptionAPI.setEncryptedData(e);
            encryptionAPI.setPlain(null);
          }}
          onError={(e) => {
            encryptionAPI.setTransactionID(null);
            encryptionAPI.setEncryptedData({
              transactionID: null,
              encryptedData: "error",
            });
            encryptionAPI.setPlain(null);
          }}
          onEncryptedWatching={(e) => {
            encryptionAPI.setTransactionID(null);
            encryptionAPI.setEncryptedData({
              transactionID: e.transactionID,
              encryptedData: e.payload,
            });
            console.log("encrypted watching", e);
          }}
          transactionID={encryptionAPI.transactionID}
          symsk={SecureStore.getItem(
            hasLoadedUserDataAPI.keyType === "simple"
              ? `${activeUserID}-symsk`
              : `${activeUserID}-tess-symkey`
          )}
        ></SingleEncrypt>
      )}
      {hasUsers === false && <AsyncGenNewAccountInfo></AsyncGenNewAccountInfo>}
      <LoadUserData navigation={navigation}></LoadUserData>
      <LoadTessData></LoadTessData>
    </>
  );
}

export { InitializeApp };
