import { EmptyView } from "@/components/common/EmptyView";
import useDiaryStore from "./state/groups";
import { useEffect, useState } from "react";
import { DayPlannerLoadingScreen } from "../DayPlanner/DayPlannerLoadingScreen";
import RButton from "@/components/common/RButton";
import RBox from "@/components/common/RBox";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { SIDGroups_ChunksType, SIDGroupType } from "@/app/config/commonTypes";
import { newChunkID } from "@/fn/newChunkID";
import { symmetricEncrypt } from "../encryptors/symmetricEncrypt";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { useSQLiteContext } from "expo-sqlite";
import RFlatList from "@/components/common/RFlatList";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { emptyRenderItem } from "@/components/common/EmptyListItem";
import { randomUUID } from "expo-crypto";
import { SingleEncrypt } from "@/components/common/crypto/SingleEncrypt";
import { useHasLoadedUserDataStore } from "../Home/hasLoadedUserData";
import { getInsertStringFromObject } from "@/fn/dbUtils";
import useStatusIndicatorsStore from "@/stores/statusIndicators";

function PersonalDiaryMain({ navigation }) {
  const diaryAPI = useDiaryStore();
  const localUsersAPI = useLocalUserIDsStore();
  const [ready, setReady] = useState(false);
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const db = useSQLiteContext();
  const hasLoadedUserDataAPI = useHasLoadedUserDataStore();
  const localUserIDs = useLocalUserIDsStore();
  const statusIndicatorAPI = useStatusIndicatorsStore();
  useEffect(() => {
    if (diaryAPI.groups === null || diaryAPI.notes === null) {
      setReady(false);
    } else {
      setReady(true);
    }
  }, [diaryAPI.groups, diaryAPI.notes]);

  const renderItem = ({ item, index }: { item: SIDGroupType }) => {
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
          onClick={(e) => {
            diaryAPI.setSelectedGroup(item);
            setTimeout(() => {
              navigation.navigate("diaryGroupView", {
                name: "diaryGroupView",
              });
            }, 50);
          }}
          label={item.name}
          width="100%"
          height="100%"
          style={{ overflow: "hidden" }}
          verticalAlign="center"
        ></RButton>
      </Animated.View>
    );
  };

  function saveNewGroupChunk(
    newGroupChunk: SIDGroups_ChunksType,
    newGroupContent: SIDGroupType[]
  ) {
    db.runAsync(`INSERT OR REPLACE INTO sidGroups VALUES (?, ?, ?, ?, ?)`, [
      newGroupChunk.id,
      newGroupChunk.userID,
      newGroupChunk.encryptedContent,
      newGroupChunk.tx,
      newGroupChunk.version,
    ])
      .then((r) => {
        statusIndicatorAPI.setEncrypting(false);
        diaryAPI.setGroups(newGroupContent);
        diaryAPI.setLastGroupsChunk({
          ...newGroupChunk,
          encryptedContent: JSON.stringify(newGroupContent),
        });
      })
      .catch((e) => {
        console.log(e, "Failed to insert new group chunk [new]");
      });
  }

  function makeNewGroup() {
    if (diaryAPI.groups === null || localUsersAPI.getActiveUserID() === null) {
      return;
    }
    statusIndicatorAPI.setEncrypting(true);
    if (diaryAPI.groups?.length === 0) {
      const newGroupContent: SIDGroupType[] = [
        {
          version: "0.1.1",
          groupID: `SGID-${randomUUID()}`,
          type: "person",
          name: "New Group " + Date.now().toString().slice(-3),
          metadata: {
            ring: 0,
            alias: "New Group",
            SID: "XL-4",
          },
        },
      ];
      const transactionID = newChunkID("TXID");
      symmetricEncrypt(JSON.stringify(newGroupContent), transactionID)
        .then((encryptedContent) => {
          const newGroupChunk: SIDGroups_ChunksType = {
            id: newChunkID("SGCID"),
            userID: localUsersAPI.getActiveUserID() as string,
            encryptedContent: encryptedContent,
            tx: Date.now(),
            version: "0.1.1",
          };
          saveNewGroupChunk(newGroupChunk, newGroupContent);
        })
        .catch((e) => {
          console.log(e, "Failed to encrypt new group chunk [new]");
        });
    } else {
      if (diaryAPI.lastGroupsChunk === null) {
        return;
      }
      try {
        if (diaryAPI.lastGroupsChunk.encryptedContent) {
          const lastState = JSON.parse(
            diaryAPI.lastGroupsChunk.encryptedContent
          );
          const newGroup: SIDGroupType = {
            groupID: `SGID-${randomUUID()}`,
            type: "person",
            version: "0.1.1",
            name: "New Group " + Date.now().toString().slice(-3),
            metadata: {
              ring: 0,
              alias: "New Group",
              SID: "XL-4",
            },
          };
          const newState = [...lastState, newGroup];
          const transactionID = newChunkID("TXID");
          symmetricEncrypt(JSON.stringify(newState), transactionID)
            .then((encryptedContent) => {
              const updatedChunk = {
                ...diaryAPI.lastGroupsChunk,
                encryptedContent: encryptedContent,
              };
              saveNewGroupChunk(updatedChunk, newState);
            })
            .catch((e) => {
              console.log(
                e,
                "Failed to encrypt new group chunk [json parse old chunk]"
              );
            });
        } else {
          console.log("Invalid last group chunk");
        }
      } catch (e) {
        console.log(e, "Error creating new group [json parse old chunk]");
      }
    }
  }

  return ready ? (
    <EmptyView navigation={navigation} showHeader={true} showMenu={true}>
      <RFlatList
        renderItem={renderItem}
        emptyComponent={emptyRenderItem(globalStyle, "No notes groups found")}
        data={diaryAPI.groups}
        figmaImport={{
          mobile: {
            top: 30,
            left: 3,
            width: 354,
            height: 506,
          },
        }}
      ></RFlatList>
      <RButton
        onClick={() => {
          makeNewGroup();
        }}
        alignPadding="2%"
        align="left"
        label="New Notes Group"
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

export { PersonalDiaryMain };
