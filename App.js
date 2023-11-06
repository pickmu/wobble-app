import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import UserNav from "./app/Screens/UserScreens/UserNav";
import SignNav from "./app/Screens/Login/SignNav";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {/* <UserNav /> */}
      <SignNav />
      <Toast />
    </NavigationContainer>
  );
}
