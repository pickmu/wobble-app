import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import UserNav from "./app/Screens/UserScreens/UserNav";
import SignNav from "./app/Screens/Login/SignNav";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { I18nProvider } from "./app/Context/I18n.js";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <I18nProvider>
        {/* <UserNav /> */}
        <SignNav />
        <Toast />
      </I18nProvider>
    </NavigationContainer>
  );
}
