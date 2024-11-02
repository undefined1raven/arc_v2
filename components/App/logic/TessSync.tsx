import { useSQLiteContext } from "expo-sqlite";
import { useActiveDayStore } from "../DayPlanner/activeDayStore";
import { useEffect } from "react";
import { act } from "react-test-renderer";
import { useDayPlannerStore } from "../DayPlanner/daysStore";
import { randomUUID } from "expo-crypto";
import { symmetricDecrypt } from "../decryptors/symmetricDecrypt";
import { symmetricEncrypt } from "../encryptors/symmetricEncrypt";
import { Tess_ChunksType, TessDayLogType } from "@/app/config/commonTypes";
import useStatusIndicatorsStore from "@/stores/statusIndicators";
import { useTessFeatureConfigStore } from "../DayPlanner/tessFeatureConfigStore";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { getInsertStringFromObject } from "@/fn/dbUtils";
import { newChunkID } from "@/fn/newChunkID";
import * as SQLite from "expo-sqlite";

function TessSync() {
  const localUsersAPI = useLocalUserIDsStore();
  const tessFeatureConfigAPI = useTessFeatureConfigStore();
  const db = useSQLiteContext();
  const activeDayAPI = useActiveDayStore();
  const statusIndicatorsAPI = useStatusIndicatorsStore();
  const dayPlannerAPI = useDayPlannerStore();
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
  // useEffect(() => {
  //   console.log(
  //     activeDayAPI.activeDay,
  //     dayPlannerAPI.hasLoadedData,
  //     dayPlannerAPI.lastChunk,
  //     tessFC,
  //     dayPlannerAPI.days
  //   );
  // }, [
  //   activeDayAPI.activeDay,
  //   dayPlannerAPI.hasLoadedData,
  //   dayPlannerAPI.lastChunk,
  //   tessFC,
  //   dayPlannerAPI.days,
  // ]);

  useEffect(() => {
    console.log("tess update triggered");
    if (
      activeDayAPI.activeDay === null ||
      dayPlannerAPI.hasLoadedData === false ||
      dayPlannerAPI.lastChunk === null
    ) {
      return;
    }

    try {
      const lastData = JSON.parse(dayPlannerAPI.lastChunk?.encryptedContent);
      const lastDayIndex = lastData.findIndex(
        (day) => day.day === activeDayAPI.activeDay.day
      );
      if (lastDayIndex !== -1) {
        lastData[lastDayIndex] = activeDayAPI.activeDay;
        const transactionID = randomUUID();
        statusIndicatorsAPI.setEncrypting(true);
        symmetricEncrypt(JSON.stringify(lastData), transactionID)
          .then((updatedEncryptedData) => {
            const updatedChunk: Tess_ChunksType = {
              ...dayPlannerAPI.lastChunk,
              encryptedContent: updatedEncryptedData,
            };
            updateTessChunk(
              updatedChunk,
              () => {
                statusIndicatorsAPI.setEncrypting(false);
                console.log("Updated chunk successfully");
              },
              (e) => {
                statusIndicatorsAPI.setEncrypting(false);
                console.log("Error updating chunk", e);
              }
            );
          })
          .catch((e) => {
            statusIndicatorsAPI.setEncrypting(false);
            console.log("Error encrypting updated data", e);
          });
      }
    } catch (e) {
      statusIndicatorsAPI.setEncrypting(false);
      console.log("Error parsing last chunk", e);
    }
  }, [activeDayAPI, dayPlannerAPI.hasLoadedData, dayPlannerAPI.lastChunk]);

  useEffect(() => {
    if (tessFeatureConfigAPI.tessFeatureConfig === null) {
      return;
    }
    console.log("tess update triggered");
    statusIndicatorsAPI.setEncrypting(true);
    const tid = randomUUID();
    symmetricEncrypt(
      JSON.stringify(tessFeatureConfigAPI.tessFeatureConfig),
      tid
    )
      .then((encryptedData) => {
        db.getFirstAsync(`SELECT * FROM users WHERE id = ?`, [
          localUsersAPI.getActiveUserID(),
        ])
          .then((rx) => {
            const userData = rx;
            if (userData === null) {
              return;
            }
            userData["tessFeatureConfig"] = encryptedData;
            const insertString = getInsertStringFromObject(userData);
            db.runAsync(
              `INSERT OR REPLACE INTO users ${insertString.queryString}`,
              insertString.values
            )
              .then((rr) => {
                console.log(rr, "from tess update");
                statusIndicatorsAPI.setEncrypting(false);
              })
              .catch((e) => {
                statusIndicatorsAPI.setEncrypting(false);
              });
          })
          .catch((e) => {
            statusIndicatorsAPI.setEncrypting(false);
          });
      })
      .catch((e) => {
        statusIndicatorsAPI.setEncrypting(false);
      });
  }, [tessFeatureConfigAPI]);

  return null;
}

async function updateTessFeatureConfig() {
  const tessFeatureConfigAPI = useTessFeatureConfigStore.getState();
  const statusIndicatorsAPI = useStatusIndicatorsStore.getState();
  const localUsersAPI = useLocalUserIDsStore.getState();
  const db = await SQLite.openDatabaseAsync("localCache");

  if (tessFeatureConfigAPI.tessFeatureConfig === null) {
    return;
  }
  console.log("tess update triggered");
  statusIndicatorsAPI.setEncrypting(true);
  const tid = randomUUID();
  symmetricEncrypt(JSON.stringify(tessFeatureConfigAPI.tessFeatureConfig), tid)
    .then((encryptedData) => {
      db.getFirstAsync(`SELECT * FROM users WHERE id = ?`, [
        localUsersAPI.getActiveUserID(),
      ])
        .then((rx) => {
          const userData = rx;
          if (userData === null) {
            return;
          }
          userData["tessFeatureConfig"] = encryptedData;
          const insertString = getInsertStringFromObject(userData);
          db.runAsync(
            `INSERT OR REPLACE INTO users ${insertString.queryString}`,
            insertString.values
          )
            .then((rr) => {
              console.log(rr, "from tess update");
              statusIndicatorsAPI.setEncrypting(false);
            })
            .catch((e) => {
              statusIndicatorsAPI.setEncrypting(false);
            });
        })
        .catch((e) => {
          statusIndicatorsAPI.setEncrypting(false);
        });
    })
    .catch((e) => {
      statusIndicatorsAPI.setEncrypting(false);
    });
}

export { TessSync };
