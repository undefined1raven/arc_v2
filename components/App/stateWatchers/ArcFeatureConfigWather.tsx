import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import * as SecureStore from "expo-secure-store";
import { SingleEncrypt } from "@/components/common/crypto/SingleEncrypt";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { symmetricEncrypt } from "../encryptors/symmetricEncrypt";
import { useSQLiteContext } from "expo-sqlite";
import { BackgroundTaskRunner } from "@/components/common/BackgroundTaskRunner";
import { encrypt } from "@/fn/crypto/encrypt";
import { stringToCharCodeArray } from "@/fn/stringToCharCode";
import { View } from "react-native";
import { randomUUID } from "expo-crypto";
import useStatusIndicatorsStore from "@/stores/statusIndicators";
import { useHasLoadedUserDataStore } from "../Home/hasLoadedUserData";
function ArcFeatureConfigWatcher() {
  const { arcFeatureConfig } = useArcFeatureConfigStore();
  const activeUserID = useLocalUserIDsStore().getActiveUserID();
  const db = useSQLiteContext();
  const statusIndicatorsAPI = useStatusIndicatorsStore();
  const hasLoadedUserDataAPI = useHasLoadedUserDataStore();
  useEffect(() => {
    const debounced = debounce(
      () => {
        if (hasLoadedUserDataAPI.hasLoadedUserData === false) return;
        const tid = randomUUID();
        statusIndicatorsAPI.setEncrypting(true);
        symmetricEncrypt(JSON.stringify(arcFeatureConfig), tid)
          .then((e) => {
            db.runAsync(`UPDATE users SET arcFeatureConfig = ? WHERE id = ?`, [
              e,
              activeUserID,
            ])
              .then((e) => {
                statusIndicatorsAPI.setEncrypting(false);
              })
              .catch((e) => {
                statusIndicatorsAPI.setEncrypting(false);
                console.log("error from AFCW");
              });
          })
          .catch((e) => {
            console.log("error from AFCW");
            statusIndicatorsAPI.setEncrypting(false);
          });
      },
      5000,
      { leading: true, trailing: true }
    );
    debounced();
  }, [arcFeatureConfig]);
  return null;
}

export { ArcFeatureConfigWatcher };
