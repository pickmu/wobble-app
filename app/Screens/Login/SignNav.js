import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { colors, fonts } from "../../ReusableTools/css";

const Stack = createStackNavigator();

const SignNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
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
      }}
    >
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default SignNav;
