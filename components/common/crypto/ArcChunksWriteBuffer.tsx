import { ARC_ChunksType } from "@/app/config/commonTypes";
import { useStore } from "@/stores/arcChunks";
import { useEffect, useRef, useState } from "react";
import { SingleEncrypt } from "./SingleEncrypt";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import * as SecureStore from "expo-secure-store";
import { View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
function ArcChunksWriteBuffer() {
  const ARC_ChunksBuffer = useStore((state) => state.arcChunks);
  const ARC_ChunksBufferRef = useRef(ARC_ChunksBuffer);
  const [changedChunks, setChangedChunks] = useState<ARC_ChunksType[]>([]);
  const getActiveUserID = useLocalUserIDsStore(
    (store) => store.getActiveUserID
  );
  const activeUserID = getActiveUserID();
  const db = useSQLiteContext();
  const [flickr, setFlickr] = useState<boolean>(true);
  useEffect(() => {
    const changedChunks = [];
    if (
      ARC_ChunksBuffer.length === 1 &&
      ARC_ChunksBufferRef.current.length === 0
    ) {
      changedChunks.push(ARC_ChunksBuffer[0]);
    } else {
      if (ARC_ChunksBuffer.length === ARC_ChunksBufferRef.current.length) {
        for (let ix = 0; ix < ARC_ChunksBuffer.length; ix++) {
          if (ARC_ChunksBufferRef.current[ix] !== undefined) {
            if (
              ARC_ChunksBuffer[ix].activities.length !==
              ARC_ChunksBufferRef.current[ix].activities.length
            ) {
              changedChunks.push(ARC_ChunksBuffer[ix]);
            }
          }
        }
      } else {
        changedChunks.push(ARC_ChunksBuffer[ARC_ChunksBuffer.length - 1]);
      }
    }
    setChangedChunks(changedChunks);
  }, [ARC_ChunksBuffer]);

  useEffect(() => {
    setFlickr(false);
    setTimeout(() => {
      setFlickr(true);
    }, 20);
    console.log("xx");

  }, [changedChunks]);

  return (
    <>
      {flickr === true ? (
        changedChunks.map((chunk) => {
          return (
            <View key={chunk.id} style={{ opacity: 0 }}>
              <SingleEncrypt
                plainText={JSON.stringify(chunk.activities)}
                symsk={SecureStore.getItem(`${activeUserID}-symsk`)}
                onEncrypted={(encrypted) => {
                  db.runAsync(
                    `INSERT OR REPLACE INTO arcChunks (id, userID, encryptedContent, tx, version) VALUES (?, ?, ?, ?, ?)`,
                    [chunk.id, activeUserID, encrypted, chunk.tx, chunk.version]
                  )
                    .then((r) => {
                      console.log("updated arcChunks table");
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }}
                onError={() => {
                  console.log("error encrypting");
                }}
              ></SingleEncrypt>
            </View>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
}

export { ArcChunksWriteBuffer };
