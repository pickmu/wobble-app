import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import UserNav from "./app/Screens/UserScreens/UserNav";
import SignNav from "./app/Screens/Login/SignNav";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { I18nProvider } from "./app/Context/I18n.js";
import { authStore } from "./app/MobX/AuthStore.js";
import { observer } from "mobx-react";
import { View, ActivityIndicator } from "react-native";
import { colors } from "./app/ReusableTools/css.js";

export default App = observer(() => {
  const { token, loading } = authStore;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <I18nProvider>
        {token ? <UserNav /> : <SignNav />}
        <Toast />
      </I18nProvider>
    </NavigationContainer>
  );
});
