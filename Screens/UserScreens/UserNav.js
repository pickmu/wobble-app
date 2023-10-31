import { View, StyleSheet } from "react-native";
import Map from "./Map";
// import { createStackNavigator } fromyy "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./Login";

// const Stack = createStackNavigatoyyr();
const Drawer = createDrawerNavigator();

const UserNav = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#202328",
        },
      }}
    >
      <Drawer.Screen
        name="Map"
        options={{ headerTitle: "Book a Taxi" }}
        component={Map}
      />
      <Drawer.Screen
        name="Login"
        component={Login}
      />
    </Drawer.Navigator>
  );
};

export default UserNav;
