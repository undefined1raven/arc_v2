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
function LoadUserData() {
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
    if (arcFeatureConfig !== null && arcChunks !== null) {
      //bug
      updateLoadingMessage({ redirect: "Home" });
    }
  }, [arcFeatureConfig, hasArcChunks]);

  useEffect(() => {
    if (activeUserID !== null) {
      db.getAllAsync(
        `SELECT * FROM arcChunks WHERE userID=? ORDER BY tx DESC LIMIT 3`,
        [activeUserID]
      ).then((recentChunks) => {
        console.log(recentChunks.length, "recentChunks");
        if (recentChunks.length === 0) {
          symmetricEncrypt(JSON.stringify({ tasks: [] })).then((encrypted) => {
            const NTID = newChunkID();
            const newChunk: ARC_ChunksType = {
              id: NTID,
              userID: activeUserID,
              tx: Date.now(),
              version: "0.1.1",
              encryptedContent: encrypted,
            };
            db.runAsync(
              `INSERT INTO arcChunks (id, userID, encryptedContent, version, tx) VALUES (?, ?, ?, ?, ?)`,
              [
                newChunk.id,
                newChunk.userID,
                newChunk.encryptedContent,
                newChunk.version,
                newChunk.tx,
              ]
            ).then(() => {
              currentActivities.setCurrentActivities([]);
              currentActivities.setIni(true);
              currentActivities.setLastChunk({
                ...newChunk,
                encryptedContent: { tasks: [] },
              });
              console.log("initialized empty chunk");
            });
          });
        } else {
          let encryptedChunks = recentChunks;
          const decryptedChunks = [];
          function recursiveCall() {
            console.log("called at", Date.now());
            if (encryptedChunks.length > 0) {
              const chunk = encryptedChunks.pop();
              console.log(chunk.tx.toString().slice(-3), "chunk");
              const encryptedContent = chunk.encryptedContent;
              symmetricDecrypt(encryptedContent).then((decrypted) => {
                decryptedChunks.push(decrypted);
                setTimeout(() => {
                  recursiveCall();
                }, 100);
              });
            } else {
              console.log("decryption done", decryptedChunks);
              try {
                const activities = [];
                const lastChunkDecryptedData = {};
                for (let ix = 0; ix < decryptedChunks.length; ix++) {
                  const parsedChunk = jsesc.default(decryptedChunks[ix], {
                    json: true,
                  });
                  const chunk: { tasks: ArcTaskLogType[] } =
                    JSON.parse(parsedChunk);
                  activities.push(...chunk.tasks);
                  if (ix === 0) {
                    lastChunkDecryptedData["tasks"] = chunk.tasks;
                  }
                }
                currentActivities.setCurrentActivities(activities);
                currentActivities.setLastChunk({
                  ...recentChunks[0],
                  encryptedContent: lastChunkDecryptedData,
                });
                currentActivities.setIni(true);
              } catch (e) {
                console.log(e, "initial chunks parsing failed");
              }
            }
          }
          recursiveCall();
        }
      });
    }
  }, [activeUserID]);

  return <></>;
}

export { LoadUserData };
