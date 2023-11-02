import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import UserNav from "./app/Screens/UserScreens/UserNav";

export default function App() {
  return (
      <NavigationContainer>
        <StatusBar style="light" />
        <UserNav />
      </NavigationContainer>
  );
}
