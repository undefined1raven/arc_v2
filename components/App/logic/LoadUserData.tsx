import { SingleDecrypt } from "@/components/common/crypto/SingleDecrypt";
import { getUserDataByID } from "@/fn/dbUtils/getUserDataByID";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { useSQLiteContext } from "expo-sqlite";
import { useStore } from "@/stores/arcChunks";
import { newChunkID } from "@/fn/newChunkID";
import { useLoadingScreenMessageStore } from "@/stores/loadingScreenMessage";
import { useNavigatorStore } from "@/hooks/navigator";
import { useCurrentArcChunkStore } from "@/stores/currentArcChunk";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import * as jsesc from "jsesc";
import { symmetricDecrypt } from "../decryptors/symmetricDecrypt";
import { ARC_ChunksType, ArcTaskLogType } from "@/app/config/commonTypes";
import { symmetricEncrypt } from "../encryptors/symmetricEncrypt";
import { useHasLoadedUserDataStore } from "../Home/hasLoadedUserData";
function LoadUserData() {
  const hasLoadedUserDataAPI = useHasLoadedUserDataStore();
  const getActiveUserID = useLocalUserIDsStore(
    (store) => store.getActiveUserID
  );
  const activeUserID = getActiveUserID();
  const db = useSQLiteContext();
  const addChunkToArcChunks = useStore((state) => state.addChunkToArcChunks);
  const appendDecryptionQueue = useStore(
    (state) => state.appendDecryptionQueue
  );
  const [hasArcChunks, setHasArcChunks] = useState<boolean>(false);
  const arcChunks = useStore((state) => state.arcChunks);
  const arcFeatureConfig = useArcFeatureConfigStore(
    (store) => store.arcFeatureConfig
  );
  const updateLoadingMessage = useLoadingScreenMessageStore(
    (store) => store.updateLoadingScreenMessage
  );
  const navigator = useNavigatorStore((state) => state.navigator);
  const currentActivities = useArcCurrentActivitiesStore();
  useEffect(() => {
    setHasArcChunks(arcChunks !== null);
  }, [arcChunks]);
  useEffect(() => {
    console.log(currentActivities.ini, "currentActivities.ini");
    if (
      arcFeatureConfig !== null &&
      currentActivities.ini === true &&
      hasLoadedUserDataAPI.hasLoadedUserData === false
    ) {
      //bug
      updateLoadingMessage({ redirect: "Home" });
    }
  }, [
    arcFeatureConfig,
    hasLoadedUserDataAPI.hasLoadedUserData,
    currentActivities.ini,
  ]);

  useEffect(() => {
    if (activeUserID !== null) {
      hasLoadedUserDataAPI.setHasStartedDecryption(true);
      db.getAllAsync(
        `SELECT * FROM arcChunks WHERE userID=? ORDER BY tx DESC LIMIT 6`,
        [activeUserID]
      ).then((recentChunks) => {
        console.log(hasLoadedUserDataAPI.keyType, "keyType");
        if (
          hasLoadedUserDataAPI.keyType === "simple" ||
          (hasLoadedUserDataAPI.keyType === "double" &&
            hasLoadedUserDataAPI.hasTessKey)
        ) {
          if (recentChunks.length === 0) {
            currentActivities.setCurrentActivities([]);
            currentActivities.setIni(true);
          } else {
            const encryptedContents = recentChunks.map((chunk) => {
              return chunk.encryptedContent;
            });
            symmetricDecrypt(JSON.stringify(encryptedContents))
            .then((res) => {
                const decryptedChunks: ARC_ChunksType[] = [];
                const results = JSON.parse(jsesc.default(res, { json: true }));
                console.log(results.length, "results len");
                for (let ix = 0; ix < results.length; ix++) {
                  const tasks = JSON.parse(results[ix]);
                  decryptedChunks.push({
                    ...recentChunks[ix],
                    encryptedContent: tasks,
                  });
                }
                try {
                  let activities = [];
                  for (let ix = 0; ix < decryptedChunks.length; ix++) {
                    const na = decryptedChunks[ix].encryptedContent.tasks;
                    activities = [...activities, ...na];
                  }
                  const lastDecryptedChunk = {
                    ...recentChunks[0],
                    encryptedContent: results[0],
                  };
                  currentActivities.setCurrentActivities(activities);
                  currentActivities.setLastChunk(lastDecryptedChunk);
                  currentActivities.setIni(true);
                } catch (e) {
                  console.log(e, "initial chunks parsing failed");
                }
              })
              .catch((e) => {
                console.log(e, "decryption failed");
              });
          }
        }
      });
    }
  }, [
    activeUserID,
    hasLoadedUserDataAPI.keyType,
    hasLoadedUserDataAPI.hasTessKey,
  ]);

  return <></>;
}

export { LoadUserData };
