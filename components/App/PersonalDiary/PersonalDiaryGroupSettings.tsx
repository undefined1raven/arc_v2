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
import RTextInput from "@/components/common/RTextInput";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";

function PersonalDiaryGroupSettings({ navigation }) {
  const diaryAPI = useDiaryStore();
  const localUsersAPI = useLocalUserIDsStore();
  const statusIndicatorAPI = useStatusIndicatorsStore();
  const [newGroupName, setNewGroupName] = useState(
    diaryAPI.selectedGroup?.name || ""
  );
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const db = useSQLiteContext();

  function saveNewGroupState() {
    const newGroup = diaryAPI.selectedGroup;
    if (newGroup === null || diaryAPI.groups === null) {
      navigation.goBack();
      return;
    }
    if (newGroupName !== newGroup?.name) {
      statusIndicatorAPI.setEncrypting(true);
      newGroup.name = newGroupName;
      const newGroups = diaryAPI.groups.map((group) => {
        if (group.groupID === newGroup.groupID) {
          return newGroup;
        } else {
          return group;
        }
      });
      const tid = randomUUID();
      symmetricEncrypt(JSON.stringify(newGroups), tid).then((encrypted) => {
        db.runAsync(
          `UPDATE sidGroups SET encryptedContent = ? WHERE userID = ?`, //////////WARNING: this only works right now because we're not chunking SID groups
          [encrypted, localUsersAPI.getActiveUserID()]
        )
          .then((r) => {
            diaryAPI.setGroups(newGroups);
            statusIndicatorAPI.setEncrypting(false);
            navigation.goBack();
          })
          .catch((e) => {
            console.log(e);
            statusIndicatorAPI.setEncrypting(false);
            navigation.goBack();
          });
      });
    } else {
      statusIndicatorAPI.setEncrypting(false);
      navigation.goBack();
    }
  }

  return (
    <EmptyView navigation={navigation} showHeader={true} showMenu={false}>
      <RLabel
        backgroundColor={globalStyle.color + "20"}
        verticalAlign="center"
        align="left"
        figmaImport={{ mobile: { left: 3, width: 354, height: 33, top: 28 } }}
        text={diaryAPI.selectedGroup?.name || "Unknown group"}
      ></RLabel>
      <RLabel
        backgroundColor={globalStyle.color + "20"}
        verticalAlign="center"
        align="left"
        figmaImport={{ mobile: { left: 3, width: 104, height: 39, top: 68 } }}
        fontSize={globalStyle.mediumMobileFont}
        text={"Name"}
      ></RLabel>
      <RTextInput
        onInput={(e) => {
          setNewGroupName(e);
        }}
        defaultValue={diaryAPI.selectedGroup?.name}
        value={newGroupName}
        align="left"
        alignPadding={5}
        fontSize={globalStyle.mediumMobileFont}
        figmaImport={{ mobile: { left: 112, width: 245, height: 39, top: 68 } }}
      ></RTextInput>
      <RBox
        figmaImport={{
          mobile: { left: 2, width: 356, height: 48, top: 589 },
        }}
      >
        <Animated.View
          entering={FadeInDown.duration(150).damping(15)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <RButton
            onClick={() => {
              saveNewGroupState();
            }}
            figmaImportConfig={{ containerHeight: 48, containerWidth: 356 }}
            figmaImport={{
              mobile: { left: 183, width: 174, height: 48, top: "0" },
            }}
          >
            <RLabel
              text="Save"
              width="80%"
              height="100%"
              left="2%"
              align="left"
              verticalAlign="center"
            ></RLabel>
            <RBox width="50%" height="100%" left="60%">
              <ArrowDeco width="50%" height="70%"></ArrowDeco>
            </RBox>
          </RButton>
          <RButton
            onClick={() => {
              navigation.goBack();
            }}
            figmaImportConfig={{ containerHeight: 48, containerWidth: 356 }}
            borderColor={globalStyle.colorAccent}
            androidRippleColor={globalStyle.colorAccent + "20"}
            figmaImport={{
              mobile: { left: 2, width: 174, height: 48, top: "0" },
            }}
          >
            <RLabel
              color={globalStyle.textColorAccent}
              text="Cancel"
              width="58%"
              height="100%"
              left="40%"
              align="right"
              verticalAlign="center"
            ></RLabel>
            <RBox
              width="50%"
              style={{ transform: "rotate(-180deg)" }}
              height="100%"
              left="-10%"
            >
              <ArrowDeco
                width="50%"
                height="70%"
                color={globalStyle.colorAccent}
              ></ArrowDeco>
            </RBox>
          </RButton>
        </Animated.View>
      </RBox>
    </EmptyView>
  );
}

export { PersonalDiaryGroupSettings };
