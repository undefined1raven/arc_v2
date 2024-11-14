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
import useStatusIndicatorsStore from "@/stores/statusIndicators";
import { stringToCharCodeArray } from "@/fn/stringToCharCode";
import RLabel from "@/components/common/RLabel";
import { EditDeco } from "@/components/common/deco/EditDeco";

function PersonalDiaryGroupView({ navigation }) {
  const diaryAPI = useDiaryStore();
  const localUsersAPI = useLocalUserIDsStore();
  const [ready, setReady] = useState(false);
  const statusIndicatorAPI = useStatusIndicatorsStore();
  const [relevantNotes, setRelevantNotes] = useState<
    { note: SIDNoteType; chunkID: string }[] | null
  >(null);
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const db = useSQLiteContext();
  useEffect(() => {
    if (diaryAPI.groups === null || diaryAPI.notes === null) {
      setReady(false);
    } else {
      if (relevantNotes === null) {
        setRelevantNotes(
          diaryAPI.notes.filter(
            (noteKeyPair) =>
              noteKeyPair.note?.groupID === diaryAPI.selectedGroup?.groupID ||
              ""
          )
        );
      } else {
        setReady(true);
      }
    }
  }, [diaryAPI.groups, diaryAPI.notes, relevantNotes]);

  const renderItem = ({
    item,
    index,
  }: {
    item: { note: SIDNoteType; chunkID: string };
  }) => {
    return (
      <Animated.View
        entering={FadeInDown.duration(75)
          .damping(30)
          .delay(indexAnimationDelay * index)}
        style={{
          position: "relative",
          paddingBottom: "3%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 80,
        }}
      >
        <RButton
          onClick={() => {
            diaryAPI.setSelectedNote(item);
            setTimeout(() => {
              navigation.navigate("diaryNoteView", {
                name: "diaryNoteView",
              });
            }, 50);
          }}
          label={item.note.metadata?.title}
          width="100%"
          height="100%"
          style={{ overflow: "hidden" }}
          verticalAlign="center"
        ></RButton>
      </Animated.View>
    );
  };

  function saveNewNoteChunk(
    newNoteChunk: SID_ChunksType,
    newNotesContent: SIDNoteType[]
  ) {
    statusIndicatorAPI.setEncrypting(true);
    db.runAsync(`INSERT OR REPLACE INTO sidChunks VALUES (?, ?, ?, ?, ?)`, [
      newNoteChunk.id,
      newNoteChunk.userID,
      newNoteChunk.encryptedContent,
      newNoteChunk.tx,
      newNoteChunk.version,
    ])
      .then((r) => {
        setRelevantNotes(
          newNotesContent.filter(
            (noteKeyPair) =>
              noteKeyPair.note.groupID === diaryAPI.selectedGroup?.groupID || ""
          )
        );
        diaryAPI.setNotes(newNotesContent);
        diaryAPI.setLastNotesChunk({
          ...newNoteChunk,
          encryptedContent: JSON.stringify(newNotesContent),
        });
        diaryAPI.setSelectedNote(newNotesContent[newNotesContent.length - 1]);
        statusIndicatorAPI.setEncrypting(false);
        setTimeout(() => {
          navigation.navigate("diaryNoteView", {
            name: "diaryNoteView",
          });
        }, 50);
      })
      .catch((e) => {
        statusIndicatorAPI.setEncrypting(false);
        console.log(e, "Failed to insert new group chunk [new]");
      });
  }

  function makeNewChunkForNote() {
    statusIndicatorAPI.setEncrypting(true);
    const newEmptyNote: SIDNoteType = {
      metadata: {
        readOnly: false,
        title: "New Note " + Date.now().toString().slice(-4),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: JSON.stringify(
          stringToCharCodeArray("Write your note here...")
        ),
      },
      version: "0.1.1",
      groupID: diaryAPI.selectedGroup.groupID,
      noteID: `SNID-${randomUUID()}`,
    };
    const newChunkContent = [newEmptyNote];
    symmetricEncrypt(JSON.stringify(newChunkContent), newChunkID("SNETID"))
      .then((encryptedContent) => {
        const newChunkIDActual = newChunkID("SNCID");
        const newSIDChunk: SID_ChunksType = {
          id: newChunkIDActual,
          userID: localUsersAPI.getActiveUserID() as string,
          encryptedContent: encryptedContent,
          tx: Date.now(),
          version: "0.1.1",
        };
        const newNotesContent = [
          ...diaryAPI.notes,
          { note: newEmptyNote, chunkID: newChunkIDActual },
        ];
        statusIndicatorAPI.setEncrypting(false);
        saveNewNoteChunk(newSIDChunk, newNotesContent);
      })
      .catch((e) => {
        statusIndicatorAPI.setEncrypting(false);
        console.log(e, "error encrypting new note [new chunk]");
      });
  }

  function makeNewNote() {
    if (diaryAPI.selectedGroup === null || diaryAPI.notes === null) {
      return;
    }
    try {
      if (diaryAPI.lastNotesChunk === null) {
        console.log("no last notes chunk");
        makeNewChunkForNote();
      } else {
        const lastNotes = JSON.parse(
          diaryAPI.lastNotesChunk.encryptedContent
        ) as SIDNoteType[];
        if (lastNotes.length > MaxSIDNotesInChunk) {
          ////create new notes chunk
          makeNewChunkForNote();
        } else {
          ////add to last notes chunk
          const newEmptyNote: SIDNoteType = {
            metadata: {
              readOnly: false,
              title: "New Note " + Date.now().toString().slice(-4),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              content: JSON.stringify(
                stringToCharCodeArray("Write your note here...")
              ),
            },
            version: "0.1.1",
            groupID: diaryAPI.selectedGroup.groupID,
            noteID: `SNID-${randomUUID()}`,
          };
          const newChunkContent = [...lastNotes, newEmptyNote];
          symmetricEncrypt(
            JSON.stringify(newChunkContent),
            newChunkID("SNETID")
          )
            .then((encryptedContent) => {
              const updatedSIDChunk: SID_ChunksType = {
                ...diaryAPI.lastNotesChunk,
                encryptedContent: encryptedContent,
              };
              const newNotesContent = [
                ...diaryAPI.notes,
                { note: newEmptyNote, chunkID: diaryAPI.lastNotesChunk?.id },
              ];
              saveNewNoteChunk(updatedSIDChunk, newNotesContent);
            })
            .catch((e) => {
              console.log(e, "error encrypting new note [new chunk w history]");
            });
        }
      }
    } catch (e) {
      console.log(e, " error creating new note");
    }
  }

  return ready ? (
    <EmptyView navigation={navigation} showHeader={true} showMenu={true}>
      <RLabel
        backgroundColor={globalStyle.color + "20"}
        verticalAlign="center"
        align="left"
        figmaImport={{ mobile: { left: 3, width: 274, height: 33, top: 28 } }}
        text={diaryAPI.selectedGroup?.name || "Unknown group"}
      ></RLabel>
      <RButton
        onClick={() => {
          if (diaryAPI.selectedGroup !== null) {
            navigation.navigate("personalDiaryGroupSettings", {
              name: "personalDiaryGroupSettings",
            });
          }
        }}
        figmaImport={{ mobile: { left: 281, width: 77, height: 33, top: 28 } }}
      >
        <EditDeco width="90%" height="70%"></EditDeco>
      </RButton>
      <RFlatList
        renderItem={renderItem}
        emptyComponent={emptyRenderItem(globalStyle, "No notes found")}
        data={relevantNotes}
        figmaImport={{
          mobile: {
            top: 68,
            left: 3,
            width: 354,
            height: 468,
          },
        }}
      ></RFlatList>
      <RButton
        alignPadding="2%"
        align="left"
        onClick={() => {
          makeNewNote();
        }}
        label="New Note"
        figmaImport={{
          mobile: {
            left: 3,
            width: 352,
            height: 39,
            top: 543,
          },
        }}
      >
        <RBox width="15%" left="87%" height="100%">
          <AddIcon width="70%" height="50%"></AddIcon>
        </RBox>
      </RButton>
    </EmptyView>
  ) : (
    <DayPlannerLoadingScreen></DayPlannerLoadingScreen>
  );
}

export { PersonalDiaryGroupView };
