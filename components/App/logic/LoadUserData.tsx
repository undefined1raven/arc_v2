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
  const arcChunks = useStore((state) => state.arcChunks);
  const arcFeatureConfig = useArcFeatureConfigStore(
    (store) => store.arcFeatureConfig
  );
  const updateLoadingMessage = useLoadingScreenMessageStore(
    (store) => store.updateLoadingScreenMessage
  );

  useEffect(() => {
    if (arcFeatureConfig !== null && arcChunks !== null) {
      console.log("fuck yessssssss");
      updateLoadingMessage({ redirect: "Home" });
    }
  }, [arcFeatureConfig, arcChunks]);

  useEffect(() => {
    if (activeUserID !== null) {
      db.getAllAsync(
        `SELECT id FROM arcChunks WHERE userID=? ORDER BY tx DESC LIMIT 3`,
        [activeUserID]
      ).then((recentChunks) => {
        console.log(recentChunks.length, "recentChunks");
        if (recentChunks.length === 0) {
          const NCID = newChunkID();
          addChunkToArcChunks({
            id: NCID,
            tx: Date.now(),
            activities: [],
            version: "0.1.1",
            userID: activeUserID,
          });
        } else {
          recentChunks.forEach((chunk) => {
            appendDecryptionQueue(chunk.id);
          });
        }
      });
    }
  }, [activeUserID]);

  return <></>;
}

export { LoadUserData };
