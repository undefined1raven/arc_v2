import { SingleDecrypt } from "@/components/common/crypto/SingleDecrypt";
import { getUserDataByID } from "@/fn/dbUtils/getUserDataByID";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { useSQLiteContext } from "expo-sqlite";
import * as jsesc from "jsesc";
import { symmetricDecrypt } from "../decryptors/symmetricDecrypt";
import {
  ARC_ChunksType,
  ArcTaskLogType,
  Tess_ChunksType,
  TessDayLogType,
} from "@/app/config/commonTypes";
import { useDayPlannerStore } from "../DayPlanner/daysStore";
import { useHasLoadedUserDataStore } from "../Home/hasLoadedUserData";
import { useTessFeatureConfigStore } from "../DayPlanner/tessFeatureConfigStore";
import { MultiDecrypt } from "@/components/common/crypto/MultiDecrypt";

function LoadTessData() {
  const dayPlannerAPI = useDayPlannerStore();
  const [recentChunks, setRecentChunks] = useState<Tess_ChunksType[] | null>(
    null
  );
  const [encryptedContents, setEncryptedContents] = useState<string[] | null>(
    null
  );
  const hasLoadedUserDataAPI = useHasLoadedUserDataStore();
  const getActiveUserID = useLocalUserIDsStore(
    (store) => store.getActiveUserID
  );
  const activeUserID = getActiveUserID();
  const db = useSQLiteContext();

  useEffect(() => {
    if (activeUserID !== null) {
      dayPlannerAPI.setHasLoadedData(false);
      db.getAllAsync(
        `SELECT * FROM tessChunks WHERE userID=? ORDER BY tx DESC LIMIT 6`,
        [activeUserID]
      ).then((recentChunksLocal) => {
        if (
          hasLoadedUserDataAPI.hasLoadedUserData === true &&
          (hasLoadedUserDataAPI.keyType === "simple" ||
            (hasLoadedUserDataAPI.keyType === "double" &&
              hasLoadedUserDataAPI.hasTessKey))
        ) {
          if (recentChunksLocal.length === 0) {
            dayPlannerAPI.setDays([]);
            dayPlannerAPI.setHasLoadedData(true);
          } else {
            const encryptedContents = recentChunksLocal.map((chunk) => {
              return chunk.encryptedContent;
            });
            setRecentChunks(recentChunksLocal);
            setEncryptedContents(encryptedContents);
          }
        }
      });
    }
  }, [
    activeUserID,
    hasLoadedUserDataAPI.keyType,
    hasLoadedUserDataAPI.hasTessKey,
    hasLoadedUserDataAPI.hasLoadedUserData,
  ]);

  return (
    encryptedContents !== null &&
    recentChunks !== null && (
      <MultiDecrypt
        symsk={SecureStore.getItem(
          hasLoadedUserDataAPI.keyType === "simple"
            ? `${activeUserID}-symsk`
            : `${activeUserID}-tess-symkey`
        )}
        onError={(e) => {
          console.log("error decrypting tess data", e);
        }}
        encryptedObj={JSON.stringify(encryptedContents)}
        onDecrypted={(res) => {
          console.log(res, "decrypted tess data");
          const decryptedChunks: Tess_ChunksType[] = [];
          const results = JSON.parse(jsesc.default(res, { json: true }));
          for (let ix = 0; ix < results.length; ix++) {
            const days = JSON.parse(results[ix]);
            decryptedChunks.push({
              ...recentChunks[ix],
              encryptedContent: days,
            });
          }
          console.log("got here", "DSDEDI3J9");
          try {
            let allDays: TessDayLogType[] = [];
            for (let ix = 0; ix < decryptedChunks.length; ix++) {
              const na = decryptedChunks[ix].encryptedContent;
              allDays = [...allDays, ...na];
            }
            const lastDecryptedChunk = {
              ...recentChunks[0],
              encryptedContent: results[0],
            };
            dayPlannerAPI.setDays(allDays);
            dayPlannerAPI.setLastChunk(lastDecryptedChunk);
            dayPlannerAPI.setHasLoadedData(true);
          } catch (e) {
            console.log(e, "initial chunks parsing failed [tess]");
          }
        }}
      ></MultiDecrypt>
    )
  );
}

export { LoadTessData };
