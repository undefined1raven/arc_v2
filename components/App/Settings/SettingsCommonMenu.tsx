import { EmptyView } from "@/components/common/EmptyView";
import { IMenu, useSettingsMenus } from "./settingsMenus";
import RLabel from "@/components/common/RLabel";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import Animated, { FadeInDown } from "react-native-reanimated";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import RButton from "@/components/common/RButton";
import RBox from "@/components/common/RBox";
import React from "react";
import RFlatList from "@/components/common/RFlatList";
import { act } from "react-test-renderer";

function SettingsCommonMenu({ navigation }) {
  const settingsMenuAPI = useSettingsMenus();
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const activeMenu: IMenu = settingsMenuAPI.getActiveMenu();

  const renderItem = ({ item, index }: { item: IMenu["options"] }) => {
    return (
      <Animated.View
        entering={FadeInDown.duration(25)
          .damping(30)
          .delay(indexAnimationDelay * index)}
        style={{
          position: "relative",
          paddingBottom: "3%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 130,
        }}
      >
        <RButton
          onClick={() => {
            if (navigation !== null) {
              navigation.navigate(item.screenName, {
                name: item.screenName,
              });
            }
          }}
          width="100%"
          height="100%"
          verticalAlign="center"
        >
          {item.showIcon && (
            <RBox width="15%" height="100%">
              {React.createElement(item.icon)}
            </RBox>
          )}
          <RLabel
            align="left"
            width="70%"
            left={item.showIcon ? "15%" : "1.5%"}
            top="25%"
            height="30%"
            verticalAlign="center"
            text={item.label}
          ></RLabel>
          <RLabel
            fontSize={globalStyle.smallMobileFont}
            align="left"
            width="70%"
            left={item.showIcon ? "15%" : "1.5%"}
            top="55%"
            height="30%"
            verticalAlign="top"
            text={item.description}
          ></RLabel>
        </RButton>
      </Animated.View>
    );
  };

  return (
    <EmptyView showMenu={true} navigation={navigation} showHeader={true}>
      <RLabel
        backgroundColor={globalStyle.color + "20"}
        align="left"
        alignPadding={5}
        verticalAlign="center"
        text={activeMenu.title}
        figmaImport={{ mobile: { left: 5, width: 350, top: 28, height: 36 } }}
      ></RLabel>
      <RFlatList
        renderItem={renderItem}
        data={activeMenu.options}
        figmaImport={{ mobile: { left: 5, width: 350, height: 516, top: 70 } }}
      ></RFlatList>
    </EmptyView>
  );
}

export { SettingsCommonMenu };
