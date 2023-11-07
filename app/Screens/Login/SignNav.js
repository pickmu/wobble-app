import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { colors, fonts } from "../../ReusableTools/css";
import { i18nStore } from "../../MobX/I18nStore";

const Stack = createStackNavigator();

const SignNav = () => {
  const { i18n } = i18nStore;

  return (
    <Stack.Navigator
      initialRouteName={`${i18n.t("signNav.signIn")}`}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondaryYellow,
        },
        headerTitleStyle: {
          fontFamily: fonts.regular,
        },
        cardStyle: {
          backgroundColor: "white",
        },
        headerTintColor: "black",
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
