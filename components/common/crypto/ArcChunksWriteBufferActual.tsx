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
import { MaxActivitiesInArcChunk } from "@/app/config/chunking";
import { newChunkID } from "@/fn/newChunkID";

function ArcChunksWriteBufferActual() {
  const getActiveUserID = useLocalUserIDsStore(
    (store) => store.getActiveUserID
  );
  const activeUserID = getActiveUserID();
  const db = useSQLiteContext();
  const currentArcChunkAPI = useCurrentArcChunkStore();
  const [plainChunk, setPlainChunk] = useState<null | ARC_ChunksType>(null);
  const [flickr, setFlickr] = useState<boolean>(true);

  useEffect(() => {
    if (
      currentArcChunkAPI.chunk !== null &&
      currentArcChunkAPI.chunk.activities !== undefined
    ) {
      const activities = currentArcChunkAPI.chunk.activities;
      if (activities.length > MaxActivitiesInArcChunk) {
        setPlainChunk({
          ...currentArcChunkAPI.chunk,
          isComplete: true,
          activities: activities.slice(0, MaxActivitiesInArcChunk),
        });
      } else {
      }
    }
  }, [currentArcChunkAPI.chunk]);

  useEffect(() => {
    if (plainChunk !== null) {
      if (plainChunk.activities === undefined) return;
      setFlickr(false);
      setTimeout(() => {
        setFlickr(true);
      }, 20);
    }
  }, [plainChunk]);

  return flickr === true ? (
    <View style={{ opacity: 0 }}>
      <SingleEncrypt
        plainText={JSON.stringify(plainChunk?.activities)}
        symsk={SecureStore.getItem(`${activeUserID}-symsk`)}
        onEncrypted={(encryptedContent) => {
          if (plainChunk === null || activeUserID === null) return;
          db.runAsync(
            `INSERT OR REPLACE INTO arcChunks (id, tx, userID, encryptedContent, isComplete) VALUES (?, ?, ?, ?, ?)`,
            [
              plainChunk.id,
              plainChunk.tx,
              activeUserID,
              encryptedContent,
              plainChunk.isComplete,
            ]
          )
            .then(() => {
              if (plainChunk.isComplete === true) {
                const newChunk = {
                  id: newChunkID(),
                  tx: Date.now(),
                  activities: [],
                  version: "0.1.1",
                  encryptedContent: "xxx",
                  userID: activeUserID,
                  isComplete: false,
                };
                currentArcChunkAPI.setChunk(newChunk);
              }
            })
            .catch(() => {});
        }}
        onError={() => {
          console.log("error decrypting");
        }}
      ></SingleEncrypt>
    </View>
  ) : (
    <></>
  );
}

export { ArcChunksWriteBufferActual };
