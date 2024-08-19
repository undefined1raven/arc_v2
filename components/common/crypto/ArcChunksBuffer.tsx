import { ARC_ChunksType } from "@/app/config/commonTypes";
import { useStore } from "@/stores/arcChunks";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

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
  
  useEffect(() => {
    if (props.symsk !== null && props.activeUserID !== null) {
      setIsReady(true);
    }
  }, [props.symsk, props.activeUserID]);
  
  useEffect(() => {
    if (!isReady) return;
    if (encryptedArcChunks !== null) {
      const idsInEncryptedArcChunks = encryptedArcChunks.map(
        (chunk) => chunk.id
      );
      const sqlReadyIDs = decryptionQueue
        .filter((id) => !idsInEncryptedArcChunks.includes(id))
        .join('","');
    } else {
        console.log('here')
      const sqlReadyIDs = decryptionQueue.join('","');
      db.getAllAsync(
        `SELECT * FROM ARC_Chunks WHERE userID = ? AND id IN ("${sqlReadyIDs}") ORDER BY tx DESC`,
        [props.activeUserID]
      )
        .then((res) => {
          console.log(res.length, decryptionQueue.length);
          console.log(res, "res");
          setEncryptedArcChunks(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [decryptionQueue, isReady]);



  useEffect(() => {
    console.log(encryptedArcChunks, "chunks");
  }, [encryptedArcChunks]);

  return isReady ? <></> : <></>;
}

export { ArcChunksBuffer };
