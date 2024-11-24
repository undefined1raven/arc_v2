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
import { DerivedDaysScoreType, useDayPlannerStore } from "./daysStore";
import {
  DayClassifierType,
  Tess_ChunksType,
  TessDayLogType,
  TessTaskType,
} from "@/app/config/commonTypes";
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
import RFlatList from "@/components/common/RFlatList";
import Animated, { FadeInDown } from "react-native-reanimated";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { ColorValueHex } from "@/components/common/CommonTypes";
import { defaultFeatureConfig } from "@/app/config/defaultFeatureConfig";
import { emptyRenderItem } from "@/components/common/EmptyListItem";
import { Pie, PolarChart } from "victory-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";
function DayPlannerMain({ navigation }) {
  const tessFeatureConfig = useTessFeatureConfigStore(
    (store) => store.tessFeatureConfig
  );
  const db = useSQLiteContext();
  const activeDayAPI = useActiveDayStore();
  const activeUserID = useLocalUserIDsStore((store) => store.getActiveUserID());
  const dayPlannerAPI = useDayPlannerStore();
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [hasOngoingDay, setHasOngoingDay] = useState<boolean | null>(null);
  useEffect(() => {
    if (
      dayPlannerAPI.days === null ||
      typeof dayPlannerAPI.days?.length !== "number"
    ) {
      return;
    }
    const currentDayIndex = dayPlannerAPI.days?.findIndex((day) => {
      return day.day === new Date().toDateString();
    });
    const newHasOngoingDays = currentDayIndex === -1 ? false : true;
    setHasOngoingDay(newHasOngoingDays);
    activeDayAPI.setActiveDay(dayPlannerAPI.days[currentDayIndex]);
  }, [tessFeatureConfig, dayPlannerAPI.days]);

  //////Days deriverer
  useEffect(() => {
    if (dayPlannerAPI.days === null || tessFeatureConfig === null) {
      return;
    }
    const daysByMonth: { [key: string]: (TessDayLogType | null)[] } = {};

    const allDaysInMonth = (year: number, month: number) => {
      const days = [];
      for (let i = 1; i <= 31; i++) {
        days.push(new Date(Date.UTC(year, month, i)).toUTCString());
      }
      return days;
    };
    dayPlannerAPI.days.forEach((dayLog) => {
      const date = new Date(dayLog.day);
      const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;

      if (!daysByMonth[monthKey]) {
        const daysInMonth = allDaysInMonth(
          date.getUTCFullYear(),
          date.getUTCMonth()
        );
        daysByMonth[monthKey] = daysInMonth.map((day) => null);
      }

      const dayIndex = new Date(dayLog.day).getUTCDate();
      daysByMonth[monthKey][dayIndex] = dayLog;
    });

    const scores: DerivedDaysScoreType = {};

    for (let ix = 0; ix < dayPlannerAPI.days.length; ix++) {
      const item = dayPlannerAPI.days[ix];
      const thresholds = tessFeatureConfig.dayClassifier.sort(
        (a, b) => a.threshold - b.threshold
      );
      const tasks: TessTaskType[] = item.tasks;
      let completionScore = 0;
      for (let ix = 0; ix < tasks.length; ix++) {
        const task = tasks[ix];
        const labels = task.labels;
        const status = tessFeatureConfig?.statusArray.find(
          (status) => status.statusID === task.statusID
        );
        if (status !== undefined) {
          if (labels.length === 0) {
            completionScore += status.completionEffect;
          } else {
            let newCompletionEffect = 0;
            for (let jx = 0; jx < labels.length; jx++) {
              const label = labels[jx];
              const labelConfig = tessFeatureConfig?.labelArray.find(
                (labelConfig) => labelConfig.labelID === label
              );
              if (labelConfig !== undefined) {
                newCompletionEffect = labelConfig.completionMultiplier(
                  status.completionEffect
                );
              }
            }
            completionScore += newCompletionEffect;
          }
        }
      }
      const completionPercentage = (
        (completionScore / tasks.length) *
        100
      ).toFixed(0);
      let currentDayClass = null;
      for (let ix = 0; ix < thresholds.length; ix++) {
        const threshold = thresholds[ix];
        if (parseInt(completionPercentage) >= threshold.threshold * 100) {
          currentDayClass = threshold;
        }
      }
      if (isNaN(parseInt(completionPercentage)) === false) {
        scores[item.day] = {
          completionPercentage: parseInt(completionPercentage),
          currentDayClass,
        };
      }
    }
    dayPlannerAPI.setDerivedDays({ completionScore: scores, daysByMonth });
  }, [dayPlannerAPI.days, tessFeatureConfig]);

  const renderItem = ({ item, index }: { item: TessDayLogType }) => {
    const completionPercentage = dayPlannerAPI.derivedDays.completionScore[
      item.day
    ]?.completionPercentage as number | undefined;

    const currentDayClass = dayPlannerAPI.derivedDays.completionScore[item.day]
      ?.currentDayClass as DayClassifierType | undefined;

    if (completionPercentage === undefined || currentDayClass === undefined) {
      return;
    }

    const HalfDonutChart = () => {
      const data = [
        {
          label: "",
          value: completionPercentage,
          color: currentDayClass?.colors[globalStyle.theme].color as string,
        },
      ];
      if (completionPercentage < 100) {
        if (completionPercentage === 0) {
          data.splice(0, 1);
          data.push({
            label: "",
            value: 100,
            color: currentDayClass?.colors[globalStyle.theme].color + "40",
          });
        }
        data.push({
          label: "",
          value: 100 - completionPercentage,
          color: currentDayClass?.colors[globalStyle.theme].color + "40",
        });
      }

      return (
        <PolarChart
          data={data}
          labelKey={"label"}
          valueKey={"value"}
          colorKey={"color"}
        >
          <Pie.Chart
            innerRadius={"80%"}
            circleSweepDegrees={-360}
            startAngle={0}
          >
            {() => {
              return (
                <>
                  <Pie.Slice />
                  <Pie.SliceAngularInset
                    angularInset={{
                      angularStrokeWidth: 2,
                      angularStrokeColor: globalStyle.textColor + "00",
                    }}
                  />
                </>
              );
            }}
          </Pie.Chart>
        </PolarChart>
      );
    };

    return currentDayClass?.label !== undefined ? (
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
          width="100%"
          borderColor={currentDayClass?.colors[globalStyle.theme].color}
          androidRippleColor={
            currentDayClass?.colors[globalStyle.theme].color + "20"
          }
          height="100%"
          style={{ overflow: "hidden" }}
          verticalAlign="center"
        >
          <RLabel
            align="left"
            color={currentDayClass?.colors[globalStyle.theme].color}
            width="70%"
            left="1%"
            fontSize={globalStyle.mediumMobileFont}
            height="100%"
            verticalAlign="center"
            text={item.day}
          ></RLabel>
          <RLabel
            backgroundColor={
              (currentDayClass?.colors[globalStyle.theme].color +
                "20") as ColorValueHex
            }
            color={
              currentDayClass?.colors[globalStyle.theme].color as ColorValueHex
            }
            align="center"
            width="40%"
            left="48%"
            top="25%"
            height="50%"
            text={`${completionPercentage}% | ${currentDayClass?.label}`}
            fontSize={globalStyle.mediumMobileFont}
            verticalAlign="center"
          ></RLabel>
          <RBox width="30%" top="10%" height="100%" left="79%">
            <Animated.View
              style={{
                position: "absolute",
                top: 10,
                left: 0,
                width: "100%",
                height: "50%",
              }}
            >
              <HalfDonutChart></HalfDonutChart>
            </Animated.View>
          </RBox>
        </RButton>
      </Animated.View>
    ) : null;
  };

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
            if (
              typeof dayPlannerAPI.days === "object" &&
              dayPlannerAPI.days !== null
            ) {
              dayPlannerAPI.setDays([...dayPlannerAPI.days, newDay]);
            }
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
                  if (
                    typeof dayPlannerAPI.days === "object" &&
                    dayPlannerAPI.days !== null
                  ) {
                    dayPlannerAPI.setDays([...dayPlannerAPI.days, newDay]);
                  }
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
    dayPlannerAPI.days !== null &&
    hasOngoingDay !== null ? (
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
        onClick={() => {
          navigation.navigate("dayPlannerStatsMain", {
            name: "dayPlannerStatsMain",
          });
        }}
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
      <RFlatList
        emptyComponent={emptyRenderItem(globalStyle, "No daily logs to show")}
        renderItem={renderItem}
        data={dayPlannerAPI.days.sort(
          (a, b) => new Date(b.day).getTime() - new Date(a.day).getTime()
        )}
        figmaImport={{
          mobile: {
            left: 2,
            width: 356,
            height: 475,
            top: 61,
          },
        }}
      ></RFlatList>
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
    <DayPlannerLoadingScreen></DayPlannerLoadingScreen>
  );
}

export { DayPlannerMain };
