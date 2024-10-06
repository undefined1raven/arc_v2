import Animated, { FadeInUp } from "react-native-reanimated";
import RLabel from "./RLabel";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { GlobalStyleType } from "@/hooks/globalStyles";

const emptyRenderItem = (globalStyle: GlobalStyleType, label?: string) => {
  return (
    <Animated.View
      entering={FadeInUp.duration(75).damping(30)}
      style={{
        position: "relative",
        marginTop: "3%",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        left: "10%",
        height: 50,
      }}
    >
      <RLabel
        width="100%"
        verticalAlign="center"
        height="100%"
        backgroundColor={globalStyle.color + "20"}
        text={typeof label === "string" ? label : "No data"}
      ></RLabel>
    </Animated.View>
  );
};

export { emptyRenderItem };
