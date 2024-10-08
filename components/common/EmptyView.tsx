import MenuList from "@/components/common/menu/MenuList";
import MenuMain from "@/components/common/menu/MenuMain";
import RBox from "@/components/common/RBox";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";
import { ActivityIndicator, BackHandler, View } from "react-native";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useMenuConfigStore } from "@/stores/mainMenu";
import {
  getVal,
  globalEnteringConfig,
} from "@/app/config/defaultTransitionConfig";
import RLabel from "@/components/common/RLabel";
import RButton from "@/components/common/RButton";
import RFlatList from "@/components/common/RFlatList";
import { useArcCurrentActivitiesStore } from "@/stores/arcCurrentActivities";
import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import {
  ARCCategoryType,
  ArcTaskLogType,
  ARCTasksType,
  FeatureConfigArcType,
} from "@/app/config/commonTypes";
import { AddIcon } from "@/components/common/deco/AddIcon";
import { ArrowDeco } from "@/components/common/deco/ArrowDeco";
import { transform } from "@babel/core";
import { emptyRenderItem } from "@/components/common/EmptyListItem";
import { EditDeco } from "@/components/common/deco/EditDeco";
import { TrashIcon } from "@/components/common/deco/TrashIcon";
import { fullStyle } from "@/fn/fullStyle";
import { Header } from "../App/Home/Header";

function EmptyView({ navigation, showMenu, navBack, children }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (navBack && navigation) {
        navigation.navigate(navBack, { name: navBack });
      } else {
        navigation.goBack();
      }
      return true;
    });
    setHasMounted(true);
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <StatusBar backgroundColor={globalStyle.statusBarColor}></StatusBar>
      <LinearGradient
        colors={globalStyle.pageBackgroundColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 0.7 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <Header show={true}></Header>
      {hasMounted && (
        <Animated.View
          entering={globalEnteringConfig(150, 20)}
          style={fullStyle}
        >
          {children}
        </Animated.View>
      )}
      {getVal(showMenu, true) && (
        <>
          <MenuMain></MenuMain>
          <MenuList></MenuList>
        </>
      )}
    </Animated.View>
  );
}

export { EmptyView };
