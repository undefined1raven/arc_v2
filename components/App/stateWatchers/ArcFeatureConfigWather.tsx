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
function ArcFeatureConfigWatcher() {
  const { arcFeatureConfig } = useArcFeatureConfigStore();
  const activeUserID = useLocalUserIDsStore().getActiveUserID();
  const [dataToEncrypt, setDataToEncrypt] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [symsk, setSymsk] = useState<string | null>(null);
  const [tx, setTx] = useState<number>(0);
  const db = useSQLiteContext();
  useEffect(() => {
    const debounced = debounce(
      () => {
        setDataToEncrypt(null);
        setTimeout(() => {
          setDataToEncrypt(JSON.stringify(arcFeatureConfig));
        }, 500);
        const tid = randomUUID();
        symmetricEncrypt(JSON.stringify(arcFeatureConfig), tid)
          .then((e) => {
            console.log("encrypted AFCW");
            db.runAsync(`UPDATE users SET arcFeatureConfig = ? WHERE id = ?`, [
              e,
              activeUserID,
            ])
              .then((e) => {
                console.log("updated AFCW");
              })
              .catch((e) => {
                console.log("error from AFCW");
              });
          })
          .catch((e) => {
            console.log("error from AFCW");
          });
      },
      5000,
      { leading: true, trailing: true }
    );
    debounced();
  }, [arcFeatureConfig]);

  useEffect(() => {
    SecureStore.getItemAsync(`${activeUserID}-symsk`)
      .then((e) => {
        if (e !== null) {
          setSymsk(e);
        } else {
          setReady(false);
        }
      })
      .catch((e) => {
        setReady(false);
      });
  }, [activeUserID]);

  useEffect(() => {
    if (dataToEncrypt !== null && symsk !== null) {
      setReady(true);
      setTx(Date.now());
    } else {
      setReady(false);
    }
  }, [symsk, dataToEncrypt]);

  return null;
}

export { ArcFeatureConfigWatcher };
