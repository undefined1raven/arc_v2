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
import { Bar, CartesianChart, Line } from "victory-native";
import { DashPathEffect } from "@shopify/react-native-skia";

function DayPlannerLineChartView() {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const dayPlannerAPI = useDayPlannerStore();
  const globalStyles = useGlobalStyleStore().globalStyle;
  let colorScheme = useColorScheme();

  useEffect(() => {
    if (dayPlannerAPI.days === null) {
      return;
    }
    const keys = Object.keys(dayPlannerAPI.derivedDays.completionScore);

    const newData = [];
    for (let ix = 0; ix < keys.length; ix++) {
      const key = keys[ix];
      const completion =
        dayPlannerAPI.derivedDays.completionScore[key].completionPercentage;
      newData.push({ x: ix, y: completion });
    }
    setData(newData);
    console.log(newData);
  }, [dayPlannerAPI.derivedDays]);

  function DashEffect() {
    return <DashPathEffect intervals={[15]} />;
  }

  function LineChart() {
    return (
      <CartesianChart
        frame={{
          lineColor: globalStyles.color,
          lineWidth: 1,
          linePathEffect: DashEffect(),
        }}
        xAxis={{
          lineWidth: 0,
          labelColor: globalStyles.textColor,
          formatXLabel(label) {
            return label.toString();
          },
        }}
        yAxis={[
          { lineWidth: 1, tickCount: 10, labelColor: globalStyles.textColor },
        ]}
        data={data}
        xKey="x"
        yKeys={["y"]}
      >
        {({ points }) => (
          <Bar
            points={points.y}
            chartBounds={{ left: 0, right: 200, top: 0, bottom: 100 }}
            color={globalStyles.color}
            barWidth={10}
            roundedCorners={{ topLeft: 10, topRight: 10 }}
          />
        )}
      </CartesianChart>
    );
  }
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
        <Animated.View style={{ height: "100%", width: "100%" }}>
          <LineChart></LineChart>
        </Animated.View>
      </RBox>
    </>
  );
}

export { DayPlannerLineChartView };
