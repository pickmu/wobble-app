import { createStackNavigator } from "@react-navigation/stack";
import { colors, fonts } from "../../ReusableTools/css";
import { i18nStore } from "../../MobX/I18nStore";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Stack = createStackNavigator();

const SignNav = () => {
  const { i18n } = i18nStore;

  return (
    <Stack.Navigator
      initialRouteName={`${i18n.t("signNav.signIn")}`}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          fontFamily: fonts.regular,
        },
        cardStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name={`${i18n.t("signNav.signIn")}`}
        component={SignIn}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={`${i18n.t("signNav.signUp")}`}
        component={SignUp}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default SignNav;
