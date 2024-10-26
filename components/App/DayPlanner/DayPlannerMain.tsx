import { AddIcon } from "@/components/common/deco/AddIcon";
import { DayPlannerIcon } from "@/components/common/deco/DayPlannerIcon";
import { EditDeco } from "@/components/common/deco/EditDeco";
import { StatsDeco } from "@/components/common/deco/StatsDeco";
import { EmptyView } from "@/components/common/EmptyView";
import QuickNavMain from "@/components/common/QuickNav/QuickNavMain";
import RBox from "@/components/common/RBox";
import RButton from "@/components/common/RButton";
import RLabel from "@/components/common/RLabel";
import { useTessFeatureConfigStore } from "./tessFeatureConfigStore";
import { ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useDayPlannerStore } from "./daysStore";
import { Tess_ChunksType, TessDayLogType } from "@/app/config/commonTypes";
import { newChunkID } from "@/fn/newChunkID";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { symmetricEncrypt } from "../encryptors/symmetricEncrypt";
import { randomUUID } from "expo-crypto";
import { useSQLiteContext } from "expo-sqlite";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";
import { useActiveDayStore } from "./activeDayStore";
import { DayPlannerLoadingScreen } from "./DayPlannerLoadingScreen";
import { MaxDaysInTessChunk } from "@/app/config/chunking";
import * as Updates from "expo-updates";
function DayPlannerMain({ navigation }) {
  const tessFeatureConfig = useTessFeatureConfigStore(
    (store) => store.tessFeatureConfig
  );
  const db = useSQLiteContext();
  const activeDayAPI = useActiveDayStore();
  const activeUserID = useLocalUserIDsStore((store) => store.getActiveUserID());
  const dayPlannerAPI = useDayPlannerStore();
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [hasOngoingDay, setHasOngoingDay] = useState<boolean>(false);
  useEffect(() => {
    if (dayPlannerAPI.days === null) return;
    const currentDayIndex = dayPlannerAPI.days?.findIndex((day) => {
      return day.day === new Date().toDateString();
    });
    const newHasOngoingDays = currentDayIndex === -1 ? false : true;
    setHasOngoingDay(newHasOngoingDays);
    // console.log(
    //   "currentDayIndex",
    //   dayPlannerAPI.days[currentDayIndex].tasks[1].description
    // );
    activeDayAPI.setActiveDay(dayPlannerAPI.days[currentDayIndex]);
  }, [tessFeatureConfig, dayPlannerAPI.days]);

  function updateTessChunk(
    tessChunk: Tess_ChunksType,
    onSuccess: Function,
    onError: Function
  ) {
    db.runAsync(
      `INSERT OR REPLACE INTO tessChunks (id, userID, encryptedContent, tx, version) VALUES (?, ?, ?, ?, ?)`,
      [
        tessChunk.id,
        tessChunk.userID,
        tessChunk.encryptedContent,
        tessChunk.tx,
        tessChunk.version,
      ]
    )
      .then((rx) => {
        if (onSuccess) {
          onSuccess(rx);
        }
      })
      .catch((e) => {
        console.log(e, "e");
        if (onError) {
          onError(e);
        }
      });
  }

  function createEmptyChunk() {
    const newDay: TessDayLogType = {
      day: new Date().toDateString(),
      tasks: [],
    };
    const transactionID = randomUUID();
    symmetricEncrypt(JSON.stringify([newDay]), transactionID).then(
      (encryptedContent) => {
        const newTessChunk: Tess_ChunksType = {
          id: newChunkID("TESS"),
          userID: activeUserID,
          encryptedContent: encryptedContent,
          tx: Date.now(),
          version: "0.1.1",
        };
        activeDayAPI.setActiveDay(newDay);
        updateTessChunk(
          newTessChunk,
          (rx) => {
            dayPlannerAPI.setLastChunk({
              ...newTessChunk,
              encryptedContent: JSON.stringify([newDay]),
            });
            setHasOngoingDay(true);
            navigation.navigate("dayPlannerActiveDayView", {
              name: "dayPlannerActiveDayView",
            });
          },
          (e) => {
            console.log(e, "e");
          }
        );
      }
    );
  }

  function handleDayView() {
    if (hasOngoingDay) {
      navigation.navigate("dayPlannerActiveDayView", {
        name: "dayPlannerActiveDayView",
      });
    } else {
      const newDay: TessDayLogType = {
        day: new Date().toDateString(),
        tasks: [],
      };
      try {
        const lastChunkData = JSON.parse(
          dayPlannerAPI.lastChunk?.encryptedContent
        );
        activeDayAPI.setActiveDay(newDay);
        const transactionID = randomUUID();
        const newDay: TessDayLogType = {
          day: new Date().toDateString(),
          tasks: [],
        };
        const currentDayFromLastChunk = lastChunkData.indexOf(
          (day) => day.day === newDay.day
        );
        if (currentDayFromLastChunk !== -1) {
          return;
        }
        if (lastChunkData.length > MaxDaysInTessChunk) {
          createEmptyChunk();
        } else {
          const newDays = [...lastChunkData, newDay];
          symmetricEncrypt(JSON.stringify(newDays), transactionID)
            .then((encryptedContent) => {
              const updatedTessChunk: Tess_ChunksType = {
                ...dayPlannerAPI.lastChunk,
                encryptedContent: encryptedContent,
              };
              updateTessChunk(
                updatedTessChunk,
                (rx) => {
                  dayPlannerAPI.setLastChunk({
                    ...updatedTessChunk,
                    encryptedContent: JSON.stringify(newDays),
                  });
                  navigation.navigate("dayPlannerActiveDayView", {
                    name: "dayPlannerActiveDayView",
                  });
                },
                (e) => {
                  Updates.reloadAsync();
                  console.log(e, "e");
                }
              );
            })
            .catch((e) => {
              createEmptyChunk();
              console.log(e);
            });
        }
      } catch (e) {
        createEmptyChunk();
        console.log(e);
      }
    }
  }

  return tessFeatureConfig !== null &&
    dayPlannerAPI.hasLoadedData === true &&
    dayPlannerAPI.days !== null ? (
    <EmptyView navigation={navigation} showMenu={true}>
      <RLabel
        align="left"
        figmaImport={{
          mobile: {
            left: 2,
            width: 120,
            height: 20,
            top: 32,
          },
        }}
        text="Day Planner"
      ></RLabel>
      <RButton
        figmaImport={{
          mobile: {
            left: 234,
            width: 59,
            height: 26,
            top: 29,
          },
        }}
      >
        <StatsDeco width="90%" height="55%"></StatsDeco>
      </RButton>
      <RButton
        onClick={() => {
          navigation.navigate("dayPlannerSettings", {
            name: "dayPlannerSettings",
          });
        }}
        figmaImport={{
          mobile: {
            left: 299,
            width: 59,
            height: 26,
            top: 29,
          },
        }}
      >
        <EditDeco width="90%" height="70%"></EditDeco>
      </RButton>
      <RButton
        onClick={handleDayView}
        alignPadding="2%"
        align="left"
        label={hasOngoingDay ? "View On-going Day" : "Start Day"}
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
          {!hasOngoingDay ? (
            <AddIcon width="70%" height="50%"></AddIcon>
          ) : (
            <ArrowDeco width="65%" height="50%"></ArrowDeco>
          )}
        </RBox>
      </RButton>
    </EmptyView>
  ) : (
    <DayPlannerLoadingScreen navigation={navigation}></DayPlannerLoadingScreen>
  );
}

export { DayPlannerMain };
