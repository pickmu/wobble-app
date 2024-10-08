import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import UserNav from "./app/Screens/UserScreens/UserNav";
import SignNav from "./app/Screens/Login/SignNav";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { authStore } from "./app/MobX/AuthStore.js";
import { observer } from "mobx-react";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Loading from "./app/ReusableTools/Loading.js";
import { AppState } from "react-native";

export default App = observer(() => {
  const { token, globalLoading } = authStore;

  const [fontsLoaded] = useFonts({
    "Agrandi-Regular": require("./app/Fonts/Agrandir-Regular.otf"),
    "Agrandi-TextBold": require("./app/Fonts/Agrandir-TextBold.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  if (globalLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style={`${token ? "dark" : "light"}`} />
        {token ? <UserNav /> : <SignNav />}
        <Toast />
      </NavigationContainer>
    </SafeAreaProvider>
  );
});
