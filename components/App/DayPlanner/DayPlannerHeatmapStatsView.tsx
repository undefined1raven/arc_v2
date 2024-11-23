import RBox from "@/components/common/RBox";
import { useEffect, useState } from "react";
import { useDayPlannerStore } from "./daysStore";
import RFlatList from "@/components/common/RFlatList";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import RLabel from "@/components/common/RLabel";
import RButton from "@/components/common/RButton";

function DayPlannerHeatmapStatsView() {
  const [heatmapColumns, setHeatmapColumns] = useState([]);
  const dayPlannerAPI = useDayPlannerStore();
  const globalStyles = useGlobalStyleStore().globalStyle;
  let colorScheme = useColorScheme();
  useEffect(() => {
    const daysByMonth = dayPlannerAPI.derivedDays.daysByMonth;
    const completionScores = dayPlannerAPI.derivedDays.completionScore;
    if (completionScores === undefined || daysByMonth === undefined) {
      return;
    }

    const newHeatmapColumns = [...Object.keys(daysByMonth)];
    const actual = [];
    for (let ix = 0; ix < newHeatmapColumns.length; ix++) {
      const month = newHeatmapColumns[ix];
      const days = daysByMonth[month];
      const daysWithClassification = [];
      for (let ix = 0; ix < days.length; ix++) {
        const day = days[ix];
        if (day === null) {
          daysWithClassification.push(null);
        } else {
          const completion = completionScores[day.day];
          daysWithClassification.push(completion);
        }
      }
      actual.push(daysWithClassification);
    }
    setHeatmapColumns(actual);
  }, [dayPlannerAPI.derivedDays]);

  useEffect(() => {
    console.log(heatmapColumns);
  }, [heatmapColumns]);

  const renderItem = ({ item, index }: { item: any }) => {
    if (item === undefined) {
      return;
    }
    const backgroundColor =
      item === null
        ? globalStyles.colorInactive
        : item?.currentDayClass?.colors[colorScheme]?.color ||
          globalStyles.color;

    const opacity = item === null ? 0.2 : item.completionPercentage / 100;
    const label = item === null ? "---" : item.completionPercentage + "%";
    return (
      <Animated.View
        style={{
          position: "relative",
          paddingBottom: "1%",
          alignItems: "center",
          justifyContent: "center",
          width: 50,
          left: 0,
          height: 23,
        }}
      >
        <RBox
          backgroundColor={backgroundColor}
          width="100%"
          opacity={opacity}
          height="100%"
        >
          <RLabel
            left="0%"
            width="100%"
            height="100%"
            color="#000"
            fontSize={globalStyles.smallMobileFont}
            text={label}
          ></RLabel>
        </RBox>
      </Animated.View>
    );
  };
  return (
    <>
      <RBox
        figmaImport={{
          mobile: {
            left: 3,
            top: 70,
            width: 308,
            height: 516,
          },
        }}
      >
        {heatmapColumns.map((month, index) => {
          return (
            <>
              <RFlatList
                width="100%"
                height="100%"
                key={month}
                left={index * 55}
                renderItem={renderItem}
                data={heatmapColumns[index]}
              ></RFlatList>
            </>
          );
        })}
      </RBox>
     
    </>
  );
}

export { DayPlannerHeatmapStatsView };
