import * as React from "react";
import { LogBox } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateAccountMainActual from "./CreateAccountMainActual";
import LandingScreen from "./LandingScreen";
import CreateAccountOnline from "@/components/CreateAccount/CreateAccountOnline";
import { Appearance, useColorScheme } from "react-native";
import CreateAccountOnlineEmail from "@/components/CreateAccount/CreateAccountOnlineEmail";
import { SQLiteProvider } from "expo-sqlite";
import OTSOne from "@/components/OneTimeSetup/OTSOne";
import OTSTwo from "@/components/OneTimeSetup/OTSTwo";
import OTSThree from "@/components/OneTimeSetup/OTSThree";
import Home from "@/components/App/Home/Home";
import themeColors, { ThemeColorsType } from "@/app/config/colors";
import LoadingScreen from "@/components/common/LoadingScreen";
import KeysLoadingScreen from "@/components/CreateAccount/KeysLoadingScreen";
import CreateAccountKeyFile from "@/components/CreateAccount/CreateAccountKeyFile";
import CreateAccountOffline from "@/components/CreateAccount/CreateAccountOffline";
import { useGlobalStyleStore } from "@/stores/globalStyles";
import { InitializeApp } from "@/components/App/logic/InitializeApp";
import TimeStatsMain from "@/components/App/TimeStats/TimeStatsMain";
import { DayView } from "@/components/App/TimeStats/DayView";
import { ActivitiesSettingsMain } from "@/components/App/Settings/Activities/ActivitiesSettingsMain";
import { EditActivities } from "@/components/App/Settings/Activities/EditActivities";
import { EditCategories } from "@/components/App/Settings/Activities/EditCategories";
import { useNewAccountStore } from "@/stores/newAccountStore";
import { DecryptionScreen } from "@/components/App/Home/DecryptScreen";
import { DayPlannerMain } from "@/components/App/DayPlanner/DayPlannerMain";
import { DayPlannerSettings } from "@/components/App/DayPlanner/DayPlannerSettings";
import { DayPlannerActiveDayView } from "@/components/App/DayPlanner/DayPlannerActiveDayView";
import { DayPlannerTaskEditor } from "@/components/App/DayPlanner/DayPlannerTaskEditor";
import LoginMain from "@/components/Login/LoginMain";
import LoginOffline from "@/components/Login/LoginOffline";
import { DayPlannerStatusSettings } from "@/components/App/Settings/DayPlanner/DayPlannerStatusSettings";
import { PersonalDiaryMain } from "@/components/App/PersonalDiary/PersonalDiaryMain";
import { PersonalDiaryGroupView } from "@/components/App/PersonalDiary/PersonalDiaryGroupView";
import { PersonalDiaryNoteView } from "@/components/App/PersonalDiary/PersonalDiaryNoteView";
import { PersonalDiaryGroupSettings } from "@/components/App/PersonalDiary/PersonalDiaryGroupSettings";
import * as SecureStore from "expo-secure-store";
import SettingsMainMenu from "@/components/App/Settings/SettingsMainMenu";
import { ThemeSettings } from "@/components/App/Settings/Account/ThemeSettings";
import { DayPlannerStatsMain } from "@/components/App/DayPlanner/DayPlannerStatsMain";
import { SettingsCommonMenu } from "@/components/App/Settings/SettingsCommonMenu";
import { AccountType } from "@/components/App/Settings/Account/AccoutType";
import { DayPlannerDayClassifierSettings } from "@/components/App/Settings/DayPlanner/DayPlannerDayClassifierSettings";
import { DayPlannerDayView } from "@/components/App/DayPlanner/DayPlannerDayView";
const Stack = createNativeStackNavigator();

type handleAccountInfoEventReturnSig = {
  status: "failed" | "success";
  error: null | string | object;
  taskID: "accountGen";
  symkey?: string;
  pk?: string;
  arcFeatureConfig?: string;
  tessFeatureConfig?: string;
  SIDFeatureConfig?: string;
  publicKey?: string;
};

export default function App() {
  LogBox.ignoreAllLogs();
  const newAccountAPI = useNewAccountStore();
  const updateGlobalStyle = useGlobalStyleStore(
    (store) => store.updateGlobalStyle
  );
  let colorScheme = useColorScheme();

  React.useEffect(() => {
    SecureStore.getItemAsync("theme")
      .then((theme) => {
        if (theme === null) {
          SecureStore.setItemAsync("theme", "cloudy");
          updateGlobalStyle({ ...themeColors["cloudy"][colorScheme] });
        } else {
          if (Object.keys(themeColors).includes(theme)) {
            updateGlobalStyle({ ...themeColors[theme][colorScheme] });
          } else {
            updateGlobalStyle({ ...themeColors["cloudy"][colorScheme] });
          }
        }
      })
      .catch((err) => {
        updateGlobalStyle({ ...themeColors["cloudy"][colorScheme] });
      });
  }, []);

  return (
    <SQLiteProvider databaseName="localCache">
      <InitializeApp></InitializeApp>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: "#000000" },
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
        ></Stack.Screen>
        <Stack.Screen
          name="landingScreen"
          component={LandingScreen}
        ></Stack.Screen>
        <Stack.Screen
          name="createAccountMain"
          component={CreateAccountMainActual}
        ></Stack.Screen>
        <Stack.Screen
          name="createAccountOnline"
          component={CreateAccountOnline}
        ></Stack.Screen>
        <Stack.Screen
          name="createAccountOnlineEmail"
          component={CreateAccountOnlineEmail}
        ></Stack.Screen>
        <Stack.Screen name="OTSOne" component={OTSOne}></Stack.Screen>
        <Stack.Screen name="OTSTwo" component={OTSThree}></Stack.Screen>
        <Stack.Screen name="OTSThree" component={OTSTwo}></Stack.Screen>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
        <Stack.Screen name="timeStats" component={TimeStatsMain}></Stack.Screen>
        <Stack.Screen
          name="editActivities"
          component={EditActivities}
        ></Stack.Screen>
        <Stack.Screen
          name="editCategories"
          component={EditCategories}
        ></Stack.Screen>
        <Stack.Screen
          name="timeStatsDayView"
          component={DayView}
        ></Stack.Screen>
        <Stack.Screen
          name="activitiesSettingsMain"
          component={ActivitiesSettingsMain}
        ></Stack.Screen>
        <Stack.Screen
          name="createAccountKeyFile"
          component={CreateAccountKeyFile}
        ></Stack.Screen>
        <Stack.Screen
          name="createAccountOffline"
          component={CreateAccountOffline}
        ></Stack.Screen>
        <Stack.Screen
          name="dayPlanner"
          component={DayPlannerMain}
        ></Stack.Screen>
        <Stack.Screen
          name="dayPlannerSettings"
          component={DayPlannerSettings}
        ></Stack.Screen>
        <Stack.Screen
          name="dayPlannerTaskEditor"
          component={DayPlannerTaskEditor}
        ></Stack.Screen>
        <Stack.Screen
          name="dayPlannerActiveDayView"
          component={DayPlannerActiveDayView}
        ></Stack.Screen>
        <Stack.Screen
          name="loginOffline"
          component={LoginOffline}
        ></Stack.Screen>
        <Stack.Screen
          name="diaryMain"
          component={PersonalDiaryMain}
        ></Stack.Screen>
        <Stack.Screen
          name="dayPlannerStatusSettings"
          component={DayPlannerStatusSettings}
        ></Stack.Screen>
        <Stack.Screen
          name="dayPlannerDayClassifierSettings"
          component={DayPlannerDayClassifierSettings}
        ></Stack.Screen>
        <Stack.Screen
          name="diaryGroupView"
          component={PersonalDiaryGroupView}
        ></Stack.Screen>
        <Stack.Screen
          name="personalDiaryGroupSettings"
          component={PersonalDiaryGroupSettings}
        ></Stack.Screen>
        <Stack.Screen
          name="dayPlannerStatsMain"
          component={DayPlannerStatsMain}
        ></Stack.Screen>
        <Stack.Screen
          name="diaryNoteView"
          component={PersonalDiaryNoteView}
        ></Stack.Screen>
        <Stack.Screen
          name="settingsCommonMenu"
          component={SettingsCommonMenu}
        ></Stack.Screen>
        <Stack.Screen
          name="dayPlannerDayView"
          component={DayPlannerDayView}
        ></Stack.Screen>
        <Stack.Screen
          name="themeSettings"
          component={ThemeSettings}
        ></Stack.Screen>
        <Stack.Screen name="accountType" component={AccountType}></Stack.Screen>
        <Stack.Screen name="loginMain" component={LoginMain}></Stack.Screen>
        <Stack.Screen
          name="SettingsMain"
          component={SettingsMainMenu}
        ></Stack.Screen>
      </Stack.Navigator>
    </SQLiteProvider>
  );
}
