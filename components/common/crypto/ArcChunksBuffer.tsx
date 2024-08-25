import { ARC_ChunksType } from "@/app/config/commonTypes";
import { useStore } from "@/stores/arcChunks";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState, version } from "react";
import { SingleDecrypt } from "./SingleDecrypt";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";

type ArcChunksBufferProps = {
  symsk: string | null;
  activeUserID: string | null;
};
function ArcChunksBuffer(props: ArcChunksBufferProps) {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [encryptedArcChunks, setEncryptedArcChunks] = useState<
    ARC_ChunksType[]
  >([]);
  const db = useSQLiteContext();
  const decryptionQueue = useStore((state) => state.decryptionQueue);
  const ARC_ChunksBuffer = useStore((state) => state.arcChunks);
  const addChunkToArcChunks = useStore((state) => state.addChunkToArcChunks);
  const removeChunkFromDecryptionQueue = useStore(
    (state) => state.removeChunkFromDecryptionQueue
  );
  function deduplicateArray(array: string[]) {
    return array.filter((item, index) => array.indexOf(item) === index);
  }
  const ARC_ChunksBufferRef = useRef(ARC_ChunksBuffer);
  const arcFeatureConfig = useArcFeatureConfigStore(
    (state) => state.arcFeatureConfig
  );
  useEffect(() => {
    if (props.symsk !== null && props.activeUserID !== null) {
      setIsReady(true);
    }
  }, [props.symsk, props.activeUserID]);

  useEffect(() => {
    if (ARC_ChunksBuffer.length > 0) {
      const allActivities = [];
      for (let ix = 0; ix < ARC_ChunksBuffer.length; ix++) {
        allActivities.push(...ARC_ChunksBuffer[ix].activities);
      }
      console.log(
        allActivities
          .sort((a, b) => {
            return b.tx - a.tx;
          })
          .map(
            (activity) =>
              arcFeatureConfig?.tasks.find(
                (elm) => elm.taskID === activity.taskID
              )?.name
          )
      );
      // console.log(allActivities.map((activity) => activity.taskID));
    }
  }),
    [ARC_ChunksBuffer];

  function updateEncryptedArcChunks(sqlReadyIDs: string[], append: boolean) {
    db.getAllAsync(
      `SELECT * FROM arcChunks WHERE userID = ? AND id IN ("${sqlReadyIDs}") ORDER BY tx DESC`,
      [props.activeUserID]
    )
      .then((res) => {
        if (append) {
          setEncryptedArcChunks((prev) => {
            return [...prev, ...res];
          });
        } else {
          setEncryptedArcChunks(res);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (!isReady) return;
    if (encryptedArcChunks !== null && encryptedArcChunks.length > 0) {
      const idsInEncryptedArcChunks = encryptedArcChunks.map(
        (chunk) => chunk.id
      );
      const sqlReadyIDs = decryptionQueue
        .filter((id) => !idsInEncryptedArcChunks.includes(id))
        .join('","');
      updateEncryptedArcChunks(sqlReadyIDs, true);
    } else {
      const sqlReadyIDs = decryptionQueue.join('","');
      updateEncryptedArcChunks(sqlReadyIDs, false);
    }
  }, [decryptionQueue, isReady]);

  useEffect(() => {
    setEncryptedArcChunks((prev) => {
      return prev.filter((chunk) => decryptionQueue.includes(chunk.id));
    });
  }, [decryptionQueue]);

  return isReady ? (
    encryptedArcChunks.map((chunk) => {
      return (
        <SingleDecrypt
          key={chunk.id}
          symsk={props.symsk}
          encryptedObj={chunk.encryptedContent}
          onDecrypted={(e) => {
            if (
              ARC_ChunksBuffer.find(
                (arcChunk) => arcChunk.chunkID === chunk.id
              ) === undefined
            ) {
              removeChunkFromDecryptionQueue(chunk.id);
              addChunkToArcChunks({
                id: chunk.id,
                tx: chunk.tx,
                activities: e,
                version: chunk.version,
                userID: props.activeUserID,
              });
            }
          }}
          onError={(e) => {
            console.log(e);
          }}
        ></SingleDecrypt>
      );
    })
  ) : (
    <></>
  );
}

export { ArcChunksBuffer };
