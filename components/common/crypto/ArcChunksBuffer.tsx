import { ARC_ChunksType } from "@/app/config/commonTypes";
import { useStore } from "@/stores/arcChunks";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState, version } from "react";
import { SingleDecrypt } from "./SingleDecrypt";

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
  useEffect(() => {
    if (props.symsk !== null && props.activeUserID !== null) {
      setIsReady(true);
    }
  }, [props.symsk, props.activeUserID]);

  function updateEncryptedArcChunks(sqlReadyIDs: string[], append: boolean) {
    db.getAllAsync(
      `SELECT * FROM ARC_Chunks WHERE userID = ? AND id IN ("${sqlReadyIDs}") ORDER BY tx DESC`,
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
                chunkID: chunk.id,
                tx: chunk.tx,
                activities: e,
                version: chunk.version,
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
