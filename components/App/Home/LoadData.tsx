import { useSQLiteContext } from "expo-sqlite";
import { ARC_ChunksDecryptor } from "../decryptors/ARC_ChunksDecryptor";
import { useEffect, useState } from "react";
import { ARC_ChunksType } from "@/app/config/commonTypes";
import store from "@/app/store";
import { updateArcChunks } from "@/hooks/arcChunks";
import { randomUUID } from "expo-crypto";
import { ARC_ChunksEncryptor } from "../encryptors/ARC_ChunksEncryptor";
import RBox from "@/components/common/RBox";

type LoadDataProps = { symsk: string | null; activeUserID: string | null };
function LoadData(props: LoadDataProps) {
  const db = useSQLiteContext();
  const [encryptedNewChunk, setEncryptedNewChunk] = useState<{} | null>(null);
  const [newChunkToEncrypt, setNewChunkToEncrypt] = useState<string | null>(
    null
  );
  const [lastChunk, setLastChunk] = useState<{
    cipher: string;
    iv: string;
  } | null>(null);
  useEffect(() => {
    if (props.symsk !== null && props.activeUserID !== null) {
      db.getFirstAsync(
        `SELECT * FROM ARC_Chunks WHERE userID = ? ORDER BY tx DESC;`,
        [props.activeUserID]
      ).then((r: ARC_ChunksType) => {
        if (r !== null) {
          setLastChunk({ cipher: r.encryptedContent, iv: r.iv });
        } else {
          const newChunkID = `ARC_Chunk-${randomUUID()}-${Date.now().toString()}`;
          const newChunkTX = Date.now();
          setNewChunkToEncrypt(JSON.stringify([]));
          store.dispatch(
            updateArcChunks({
              plainActivities: [
                { chunkID: newChunkID, activities: [], chunkTX: newChunkTX },
              ],
              triggerChunkIDs: [newChunkID],
            })
          );
        }
      });
    }
  }, [props.symsk, props.activeUserID]);
  return (
    <RBox>
      <ARC_ChunksEncryptor
        plainChunk={newChunkToEncrypt}
        onEncryption={(e) => {
          console.log("data encryption", e);
        }}
        onError={(e) => {
          console.log("data encryption error", e);
        }}
        symsk={props.symsk}
      ></ARC_ChunksEncryptor>
      <ARC_ChunksDecryptor
        symsk={props.symsk}
        onDecryption={(e) => {
          console.log("data decry[tion", e);
        }}
        onError={(e) => {
          console.log("data decry[tion error", e);
        }}
        encryptedChunks={[lastChunk]}
      ></ARC_ChunksDecryptor>
    </RBox>
  );
}

export { LoadData };
