import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import UserNav from "./app/Screens/UserScreens/UserNav";
import { I18nProvider } from "./app/Context/I18nContext";

export default function App() {
  return (
    <I18nProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <UserNav />
      </NavigationContainer>
    </I18nProvider>
  );
}
