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
import Animated, { FadeInDown } from "react-native-reanimated";

function DayPlannerActiveDayView({ navigation }) {
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
    console.log(dayPlannerAPI.lastChunk);
  }, [dayPlannerAPI.lastChunk]);

  return tessFeatureConfig !== null &&
    dayPlannerAPI.hasLoadedData === true &&
    dayPlannerAPI.days !== null ? (
    <EmptyView navigation={navigation} showMenu={false}>
      <RLabel
        align="left"
        figmaImport={{
          mobile: {
            left: 2,
            width: 180,
            height: 20,
            top: 32,
          },
        }}
        text="Day Planner / Today"
      ></RLabel>
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
            onClick={() => {}}
            figmaImportConfig={{ containerHeight: 48, containerWidth: 356 }}
            borderColor={globalStyle.colorAccent}
            figmaImport={{
              mobile: { left: 2, width: 174, height: 48, top: "0" },
            }}
          >
            <RLabel
              text="Add Task"
              width="58%"
              height="100%"
              left="40%"
              align="right"
              verticalAlign="center"
            ></RLabel>
            <RBox
              width="42%"
              height="100%"
              style={{ transform: "rotate(180deg)" }}
              left="0%"
            >
              <AddIcon
                style={{ left: "25%" }}
                width="60%"
                height="40%"
              ></AddIcon>
            </RBox>
          </RButton>
        </Animated.View>
      </RBox>
    </EmptyView>
  ) : (
    <DayPlannerLoadingScreen navigation={navigation}></DayPlannerLoadingScreen>
  );
}

export { DayPlannerActiveDayView };
