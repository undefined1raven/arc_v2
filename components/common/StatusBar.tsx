import Animated from "react-native-reanimated";

function StatusBar() {
  return (
    <Animated.View
      style={{ width: "100%", height: "100%", top: 0, left: 0 }}
    ></Animated.View>
  );
}

export { StatusBar };
