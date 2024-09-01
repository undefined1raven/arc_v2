import { ARC_ChunksType } from "@/app/config/commonTypes";
import { useStore } from "@/stores/arcChunks";
import { useEffect, useRef, useState } from "react";
import { SingleEncrypt } from "./SingleEncrypt";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import * as SecureStore from "expo-secure-store";
import { View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useCurrentArcChunkStore } from "@/stores/currentArcChunk";
import { SingleDecrypt } from "./SingleDecrypt";
import * as jsesc from "jsesc";

function ArcLastChunkDecryptor() {
  const getActiveUserID = useLocalUserIDsStore(
    (store) => store.getActiveUserID
  );
  const activeUserID = getActiveUserID();
  const db = useSQLiteContext();
  const currentArcChunkAPI = useCurrentArcChunkStore();
  const [encryptedChunk, setEncryptedChunk] = useState<null | ARC_ChunksType>(
    null
  );
  const [flickr, setFlickr] = useState<boolean>(true);

  useEffect(() => {
    if (currentArcChunkAPI.lastChunkID !== null) {
      db.getAllAsync(`SELECT * FROM arcChunks WHERE id=? AND userID=?`, [
        currentArcChunkAPI.lastChunkID,
        activeUserID,
      ]).then((res) => {
        if (res.length > 0) {
          const chunk: ARC_ChunksType = res[0] as ARC_ChunksType;
          setEncryptedChunk(chunk);
        }
      });
    }
  }, [currentArcChunkAPI?.lastChunkID]);

  useEffect(() => {
    if (encryptedChunk !== null) {
      setFlickr(false);
      setTimeout(() => {
        setFlickr(true);
      }, 20);
    }
  }, [encryptedChunk]);

  return flickr === true ? (
    <SingleDecrypt
      encryptedObj={encryptedChunk?.encryptedContent}
      symsk={SecureStore.getItem(`${activeUserID}-symsk`)}
      onDecrypted={(decrypted) => {
        if (encryptedChunk === null) return;
        currentArcChunkAPI.setChunk({
          ...encryptedChunk,
          activities: JSON.parse(jsesc.default(decrypted, { json: true })),
        });
      }}
      onError={() => {
        console.log("error decrypting");
      }}
    ></SingleDecrypt>
  ) : (
    <></>
  );
}

export { ArcLastChunkDecryptor };
