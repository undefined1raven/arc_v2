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
import { Bar, CartesianChart, Line, Pie, PolarChart } from "victory-native";
import { useTessFeatureConfigStore } from "./tessFeatureConfigStore";

function DayPlannerPieChartView() {
  const [data, setData] = useState<
    { label: string; color: string; value: number; percentage?: number }[]
  >([]);
  const dayPlannerAPI = useDayPlannerStore();
  const globalStyles = useGlobalStyleStore().globalStyle;
  let colorScheme = useColorScheme();
  const tessFeatureConfig = useTessFeatureConfigStore(
    (store) => store.tessFeatureConfig
  );
  useEffect(() => {
    if (dayPlannerAPI.days === null) {
      return;
    }
    const keys = Object.keys(dayPlannerAPI.derivedDays.completionScore);

    const newData = [];
    const classCount: { [key: string]: number } = {};
    for (let ix = 0; ix < keys.length; ix++) {
      const key = keys[ix];
      const dayClass =
        dayPlannerAPI.derivedDays.completionScore[key].currentDayClass;

      if (dayClass?.dayClassID === undefined) {
        continue;
      }
      if (classCount[dayClass?.dayClassID] === undefined) {
        classCount[dayClass?.dayClassID] = 1;
      } else {
        classCount[dayClass?.dayClassID] += 1;
      }
    }
    const classKeys = Object.keys(classCount);
    for (let ix = 0; ix < classKeys.length; ix++) {
      const dayClass = tessFeatureConfig?.dayClassifier.find(
        (cls) => cls.dayClassID === classKeys[ix]
      );
      const key = classKeys[ix];
      const count = classCount[key];
      if (!colorScheme || !dayClass) {
        continue;
      }
      newData.push({
        label: dayClass?.label,
        value: count,
        color: dayClass?.colors[colorScheme].color || globalStyles.color,
      });
    }

    const totalCount = newData.reduce((acc, val) => acc + val.value, 0);

    for (let ix = 0; ix < newData.length; ix++) {
      newData[ix].percentage = Math.round(
        (newData[ix].value / totalCount) * 100
      );
    }
    setData(newData);
  }, [dayPlannerAPI.derivedDays]);

  const renderItem = ({
    item,
    index,
  }: {
    item: { label: string; color: string; value: number };
  }) => {
    if ((item === undefined) | (item.percentage === undefined)) {
      return;
    }
    return (
      <Animated.View
        style={{
          position: "relative",
          paddingBottom: "1%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          left: 0,
          height: 50,
        }}
      >
        <RBox
          width="20%"
          top="20%"
          height="20%"
          backgroundColor={item.color}
        ></RBox>
        <RLabel
          height="100%"
          verticalAlign="start"
          left="21%"
          width="75%"
          align="left"
          text={
            item.label + " | " + item.percentage + "%" + " (" + item.value + ")"
          }
        ></RLabel>
      </Animated.View>
    );
  };

  const HalfDonutChart = () => {
    return (
      <PolarChart
        data={data}
        labelKey={"label"}
        valueKey={"value"}
        colorKey={"color"}
      >
        <Pie.Chart innerRadius={"80%"} circleSweepDegrees={-360} startAngle={0}>
          {() => {
            return (
              <>
                <Pie.Slice>
                  <Pie.Label
                    color={globalStyles.textColor}
                    radiusOffset={0.5}
                  />
                </Pie.Slice>
                <Pie.SliceAngularInset
                  angularInset={{
                    angularStrokeWidth: 0,
                    angularStrokeColor: globalStyles.textColor,
                  }}
                />
              </>
            );
          }}
        </Pie.Chart>
      </PolarChart>
    );
  };
  return (
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
      <Animated.View style={{ height: "100%", width: "80%" }}>
        <HalfDonutChart></HalfDonutChart>
        <RFlatList
          renderItem={renderItem}
          data={data}
          figmaImport={{
            mobile: { left: 0, width: "100%", height: 170, top: 465 },
          }}
        ></RFlatList>
      </Animated.View>
    </RBox>
  );
}

export { DayPlannerPieChartView };
