import themeColors, { themeColorKeyToDisplayName } from "@/app/config/colors";
import { EmptyView } from "@/components/common/EmptyView";
import RBox from "@/components/common/RBox";
import RButton from "@/components/common/RButton";
import RFlatList from "@/components/common/RFlatList";
import RLabel from "@/components/common/RLabel";
import { indexAnimationDelay } from "@/constants/indexAnimationDelay";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
function AccountType({ navigation }) {
  const globalStyle = useGlobalStyleStore((store) => store.globalStyle);
  const activeUserID = useLocalUserIDsStore.getState().getActiveUserID();
  const [isLocalAccout, setIsLocalAccount] = React.useState(false);
  useEffect(() => {
    if (!activeUserID) {
      return;
    }
    setIsLocalAccount(activeUserID?.split(".local").length === 2);
  }, [activeUserID]);

  return (
    <EmptyView navigation={navigation} showMenu={false}>
      <RLabel
        align="left"
        verticalAlign="center"
        backgroundColor={globalStyle.color + "20"}
        text="Config / Account Settings / Account Type"
        figmaImport={{
          mobile: {
            top: 28,
            left: 5,
            width: 350,
            height: 38,
          },
        }}
      ></RLabel>
      <RLabel
        width="100%"
        text="Your account is"
        figmaImport={{
          mobile: { top: 90, left: 0, width: "100%", height: 30 },
        }}
      ></RLabel>
      <RLabel
        backgroundColor={globalStyle.color + "20"}
        verticalAlign="center"
        text={isLocalAccout ? "Offline" : "Online"}
        figmaImport={{ mobile: { top: 123, left: 95, width: 169, height: 38 } }}
      ></RLabel>
      <RLabel
        fontSize={globalStyle.mediumMobileFont}
        verticalAlign="center"
        align="left"
        text={
          isLocalAccout
            ? "Making your account online doesn’t affect your privacy or security in any way. The encrypted data saved on this device would also be sent to a remote location, letting you login with your key file"
            : "Making your account offline means that you can log into other devices just by manually transferring a backup file of your account to the other device"
        }
        figmaImport={{ mobile: { top: 202, left: 63, width: 248, height: 78 } }}
      ></RLabel>
      <RLabel
        fontSize={globalStyle.mediumMobileFont}
        verticalAlign="center"
        align="left"
        text={
          isLocalAccout
            ? "You can still use the app while we’re copying your encrypted data. You can switch back to an offline account at any time"
            : "This mode is perfect if you’d rather take care of backing up your account yourself. You can switch back to an online account at any point"
        }
        figmaImport={{ mobile: { top: 303, left: 63, width: 248, height: 78 } }}
      ></RLabel>
      <RButton
        verticalAlign="center"
        label={isLocalAccout ? "Go Online" : "Go Offline"}
        figmaImport={{ mobile: { top: 480, left: 63, width: 248, height: 44 } }}
      ></RButton>
      <RButton
        onClick={() => navigation.goBack()}
        verticalAlign="center"
        label="Back"
        figmaImport={{ mobile: { top: 543, left: 63, width: 248, height: 44 } }}
      ></RButton>
    </EmptyView>
  );
}

export { AccountType };
