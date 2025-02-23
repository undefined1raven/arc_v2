import { EmptyView } from "@/components/common/EmptyView";
import useDiaryStore from "./state/groups";
import { useEffect, useState } from "react";
import { DayPlannerLoadingScreen } from "../DayPlanner/DayPlannerLoadingScreen";
import RButton from "@/components/common/RButton";
import RBox from "@/components/common/RBox";
import { AddIcon } from "@/components/common/deco/AddIcon";
import {
  SID_ChunksType,
  SIDGroups_ChunksType,
  SIDGroupType,
  SIDNoteType,
} from "@/app/config/commonTypes";
import { newChunkID } from "@/fn/newChunkID";
import { symmetricEncrypt } from "../encryptors/symmetricEncrypt";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { useSQLiteContext } from "expo-sqlite";
import RFlatList from "@/components/common/RFlatList";
import Animated, { FadeInDown } from "react-native-reanimated";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { emptyRenderItem } from "@/components/common/EmptyListItem";
import { randomUUID } from "expo-crypto";
import { MaxSIDNotesInChunk } from "@/app/config/chunking";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";
import RLabel from "@/components/common/RLabel";
import RTextInput from "@/components/common/RTextInput";
import useStatusIndicatorsStore from "@/stores/statusIndicators";
import { newLineReplacement } from "@/app/config/constants";
import {
  charCodeArrayToString,
  stringToCharCodeArray,
} from "@/fn/stringToCharCode";
import { RToggle } from "@/components/common/RToggle";
function PersonalDiaryNoteView({ navigation }) {
  const diaryAPI = useDiaryStore();
  const localUsersAPI = useLocalUserIDsStore();
  const [ready, setReady] = useState(false);
  const statusIndicatorAPI = useStatusIndicatorsStore();
  const [newTitle, setNewTitle] = useState(
    diaryAPI.selectedNote?.note?.metadata?.title || ""
  );
  const [newContent, setNewContent] = useState("");
  const [newReadOnly, setNewReadOnly] = useState(
    diaryAPI.selectedNote?.note?.metadata?.readOnly || false
  );
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const db = useSQLiteContext();
  useEffect(() => {
    if (diaryAPI.groups === null || diaryAPI.notes === null) {
      setReady(false);
    } else {
      if (diaryAPI.selectedNote === null) {
      } else {
        setNewContent(diaryAPI.selectedNote.note.metadata.content);
        setNewTitle(diaryAPI.selectedNote.note.metadata.title);
        setNewReadOnly(diaryAPI.selectedNote.note.metadata.readOnly);
        setReady(true);
      }
    }
  }, [diaryAPI.groups, diaryAPI.notes, diaryAPI.selectedNote]);

  useEffect(() => {
    const encoded = JSON.parse(
      diaryAPI.selectedNote?.note?.metadata?.content || ""
    );
    setNewContent(charCodeArrayToString(encoded));
  }, [diaryAPI.selectedNote]);

  function saveNewNoteChunk(
    newNoteChunk: SID_ChunksType,
    updatedNote: { note: SIDNoteType; chunkID: string }
  ) {
    db.runAsync(`INSERT OR REPLACE INTO sidChunks VALUES (?, ?, ?, ?, ?)`, [
      newNoteChunk.id,
      newNoteChunk.userID,
      newNoteChunk.encryptedContent,
      newNoteChunk.tx,
      newNoteChunk.version,
    ])
      .then((r) => {
        if (diaryAPI.notes === null) {
          return;
        }
        const updatedNoteIndex = diaryAPI.notes?.findIndex(
          (noteGPair) => noteGPair.note.noteID === updatedNote.note.noteID
        );
        if (updatedNoteIndex === -1) {
          console.log("failed to find updated note index");
          return;
        }
        const newNotes = diaryAPI.notes;
        newNotes[updatedNoteIndex].note = updatedNote.note;
        diaryAPI.setNotes(newNotes);
        const newNotesInChunk = diaryAPI.notes.filter(
          (note) => note.chunkID === newNoteChunk.id
        );
        const newLastNotesChunk: SID_ChunksType = {
          ...newNoteChunk,
          encryptedContent: JSON.stringify(newNotesInChunk),
        };
        diaryAPI.setLastNotesChunk(newLastNotesChunk);
        statusIndicatorAPI.setEncrypting(false);
        navigation.goBack();
      })
      .catch((e) => {
        console.log(e, "Failed to insert new group chunk [new]");
      });
  }

  function saveNoteState() {
    if (
      diaryAPI.selectedGroup === null ||
      diaryAPI.notes === null ||
      diaryAPI.selectedNote === null
    ) {
      return;
    }
    if (
      newTitle === diaryAPI.selectedNote.note.metadata.title &&
      JSON.stringify(stringToCharCodeArray(newContent)) ===
        diaryAPI.selectedNote.note.metadata.content &&
      newReadOnly === diaryAPI.selectedNote.note.metadata.readOnly
    ) {
      navigation.goBack();
      return;
    }
    statusIndicatorAPI.setEncrypting(true);
    try {
      const chunkID = diaryAPI.selectedNote.chunkID;
      const allNotesInChunk = diaryAPI.notes.filter(
        (noteChunkPair) => noteChunkPair.chunkID === chunkID
      );
      const updatedNoteIndex = allNotesInChunk.findIndex(
        (noteChunkPair) =>
          noteChunkPair.note.noteID === diaryAPI.selectedNote?.note?.noteID
      );
      if (updatedNoteIndex === -1) {
        console.log("failed to find updated note index");
        return;
      }
      allNotesInChunk[updatedNoteIndex].note.metadata.title = newTitle;
      allNotesInChunk[updatedNoteIndex].note.metadata.content = JSON.stringify(
        stringToCharCodeArray(newContent)
      );
      allNotesInChunk[updatedNoteIndex].note.metadata.readOnly = newReadOnly;
      allNotesInChunk[updatedNoteIndex].note.metadata.updatedAt = Date.now();
      const mappedNotes = allNotesInChunk.map((noteChunkPair) => {
        return noteChunkPair.note;
      });
      const transactionID = newChunkID("TXID");
      symmetricEncrypt(JSON.stringify(mappedNotes), transactionID)
        .then((updatedEncryptedContent) => {
          const updatedNoteChunk: SID_ChunksType = {
            id: chunkID,
            userID: localUsersAPI.getActiveUserID() as string,
            encryptedContent: updatedEncryptedContent,
            tx: Date.now(),
            version: "0.1.1",
          };
          saveNewNoteChunk(updatedNoteChunk, allNotesInChunk[updatedNoteIndex]);
        })
        .catch((e) => {
          console.log(e, "Failed to encrypt updated note chunk");
        });
    } catch (e) {
      console.log(e, " error creating new note");
    }
  }

  return ready ? (
    <EmptyView navigation={navigation} showHeader={true} showMenu={false}>
      <RLabel
        verticalAlign="center"
        align="left"
        backgroundColor={globalStyle.color + "20"}
        text={diaryAPI.selectedNote?.note.metadata.title}
        figmaImport={{
          mobile: { top: 28, left: 3, width: 354, height: 33 },
        }}
      ></RLabel>
      <RLabel
        verticalAlign="center"
        align="left"
        backgroundColor={globalStyle.color + "20"}
        text={"Title"}
        fontSize={globalStyle.mediumMobileFont}
        figmaImport={{
          mobile: { top: 68, left: 3, width: 104, height: 39 },
        }}
      ></RLabel>
      <RTextInput
        align="left"
        defaultValue={newTitle}
        value={newTitle}
        readOnly={newReadOnly}
        onInput={(e) => {
          setNewTitle(e);
        }}
        fontSize={globalStyle.mediumMobileFont}
        figmaImport={{
          mobile: { top: 68, left: 112, width: 245, height: 39 },
        }}
      ></RTextInput>
      <RTextInput
        value={newContent}
        align="left"
        multiline={true}
        readOnly={newReadOnly}
        onInput={(e) => {
          setNewContent(e);
        }}
        fontSize={globalStyle.smallMobileFont}
        figmaImport={{
          mobile: { top: 114, left: 3, width: 354, height: 420 },
        }}
      ></RTextInput>
      <RLabel
        backgroundColor={globalStyle.color + "20"}
        text="Read-only"
        align="left"
        verticalAlign="center"
        alignPadding={3}
        figmaImport={{ mobile: { left: 3, width: 354, height: 39, top: 541 } }}
      ></RLabel>
      <RToggle
        defaultToggled={newReadOnly}
        value={newReadOnly}
        onToggle={(e) => {
          setNewReadOnly(e);
        }}
        figmaImport={{ mobile: { left: 298, width: 52, height: 22, top: 550 } }}
      ></RToggle>
      <RButton
        alignPadding="2%"
        align="left"
        onClick={() => {
          saveNoteState();
        }}
        label={"Save"}
        figmaImport={{
          mobile: {
            left: 3,
            width: 354,
            height: 48,
            top: 587,
          },
        }}
      >
        <RBox width="15%" left="84%" height="100%">
          <ArrowDeco width="70%" height="50%"></ArrowDeco>
        </RBox>
      </RButton>
    </EmptyView>
  ) : (
    <DayPlannerLoadingScreen></DayPlannerLoadingScreen>
  );
}

export { PersonalDiaryNoteView };
