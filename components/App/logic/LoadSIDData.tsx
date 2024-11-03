import { SingleDecrypt } from "@/components/common/crypto/SingleDecrypt";
import { getUserDataByID } from "@/fn/dbUtils/getUserDataByID";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { useSQLiteContext } from "expo-sqlite";
import * as jsesc from "jsesc";
import { symmetricDecrypt } from "../decryptors/symmetricDecrypt";
import {
  SID_ChunksType,
  SIDGroups_ChunksType,
  SIDGroupType,
  SIDNoteType,
} from "@/app/config/commonTypes";
import { useHasLoadedUserDataStore } from "../Home/hasLoadedUserData";
import { MultiDecrypt } from "@/components/common/crypto/MultiDecrypt";
import useDiaryStore from "../PersonalDiary/state/groups";

function LoadSIDData() {
  const diaryAPI = useDiaryStore();
  const [encryptedChunkContents, setEncryptedChunkContents] = useState<
    string[] | null
  >(null);
  const [encryptedSIDFullChunks, setEncryptedSIDFullChunks] = useState<
    null | SID_ChunksType[]
  >(null);
  const [encryptedGroupsFullChunks, setEncryptedGroupsFullChunks] =
    useState<null | SIDGroups_ChunksType>(null);
  const [encryptedGroupsContents, setEncryptedGroupsContents] = useState<
    string[] | null
  >(null);
  const hasLoadedUserDataAPI = useHasLoadedUserDataStore();
  const getActiveUserID = useLocalUserIDsStore(
    (store) => store.getActiveUserID
  );
  const activeUserID = getActiveUserID();
  const db = useSQLiteContext();

  useEffect(() => {
    if (
      activeUserID === null ||
      hasLoadedUserDataAPI.hasLoadedUserData === false ||
      (hasLoadedUserDataAPI.keyType === "double" &&
        hasLoadedUserDataAPI.hasTessKey === false)
    ) {
      return;
    } else {
      db.getAllAsync(`SELECT * FROM sidChunks WHERE userID=?`, [
        activeUserID,
      ]).then((encryptedSIDChunks) => {
        if (encryptedSIDChunks.length === 0) {
          diaryAPI.setGroups([]);
          diaryAPI.setNotes([]);
        } else {
          const encryptedContents = encryptedSIDChunks.map((chunk) => {
            return chunk.encryptedContent;
          });
          setEncryptedChunkContents(encryptedContents);
          setEncryptedSIDFullChunks(encryptedSIDChunks as SID_ChunksType[]);
        }
      });
      db.getFirstAsync(`SELECT * FROM sidGroups WHERE userID=?`, [activeUserID])
        .then((encryptedGroups) => {
          if (encryptedGroups === null) {
          } else {
            setEncryptedGroupsContents([encryptedGroups.encryptedContent]);
            setEncryptedGroupsFullChunks([encryptedGroups]);
          }
        })
        .catch((e) => {
          console.log(e, "error getting groups [SID]");
        });
    }
  }, [
    activeUserID,
    hasLoadedUserDataAPI.keyType,
    hasLoadedUserDataAPI.hasTessKey,
    hasLoadedUserDataAPI.hasLoadedUserData,
  ]);

  return (
    <>
      {encryptedChunkContents !== null && (
        <MultiDecrypt
          symsk={SecureStore.getItem(
            hasLoadedUserDataAPI.keyType === "simple"
              ? `${activeUserID}-symsk`
              : `${activeUserID}-tess-symkey`
          )}
          onError={(e) => {
            console.log("error decrypting sid data", e);
          }}
          encryptedObj={JSON.stringify(encryptedChunkContents)}
          onDecrypted={(res) => {
            const decryptedChunks: SID_ChunksType[] = [];
            const results = JSON.parse(jsesc.default(res, { json: true }));
            for (let ix = 0; ix < results.length; ix++) {
              const notes = JSON.parse(results[ix]);
              decryptedChunks.push({
                ...encryptedSIDFullChunks[ix],
                encryptedContent: notes,
              });
            }
            try {
              let allNotes: SIDNoteType[] = [];
              for (let ix = 0; ix < decryptedChunks.length; ix++) {
                const na = decryptedChunks[ix].encryptedContent;
                allNotes = [...allNotes, ...na];
              }
              const lastDecryptedChunk = {
                ...encryptedSIDFullChunks[0],
                encryptedContent: results[0],
              };
              diaryAPI.setLastNotesChunk(lastDecryptedChunk);
              diaryAPI.setNotes(allNotes);
            } catch (e) {
              console.log(e, "initial chunks parsing failed [sid]");
            }
          }}
        ></MultiDecrypt>
      )}
      {encryptedGroupsContents !== null && (
        <MultiDecrypt
          symsk={SecureStore.getItem(
            hasLoadedUserDataAPI.keyType === "simple"
              ? `${activeUserID}-symsk`
              : `${activeUserID}-tess-symkey`
          )}
          onError={(e) => {
            console.log("error decrypting sid data", e);
          }}
          encryptedObj={JSON.stringify(encryptedGroupsContents)}
          onDecrypted={(res) => {
            const decryptedChunks: SIDGroups_ChunksType[] = [];
            const results = JSON.parse(jsesc.default(res, { json: true }));
            for (let ix = 0; ix < results.length; ix++) {
              const groups = JSON.parse(results[ix]);
              decryptedChunks.push({
                ...encryptedGroupsFullChunks[ix],
                encryptedContent: groups,
              });
            }
            try {
              let allGroups: SIDGroupType[] = [];
              for (let ix = 0; ix < decryptedChunks.length; ix++) {
                const na = decryptedChunks[ix].encryptedContent;
                allGroups = [...allGroups, ...na];
              }
              const lastDecryptedChunk = {
                ...encryptedGroupsFullChunks[0],
                encryptedContent: results[0],
              };
              diaryAPI.setLastGroupsChunk(lastDecryptedChunk);
              diaryAPI.setGroups(allGroups);
            } catch (e) {
              console.log(e, "initial chunks parsing failed [sid]");
            }
          }}
        ></MultiDecrypt>
      )}
    </>
  );
}

export { LoadSIDData };
