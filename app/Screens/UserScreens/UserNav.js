import { View, StyleSheet } from "react-native";
import Map from "./Map";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./Login";
import DrawerContent from "./DrawerContent";

const Drawer = createDrawerNavigator();

const UserNav = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: "#DCDFE4",
        headerStyle: {
          backgroundColor: "#212429",
        },
        drawerStyle: {
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
      drawerContent={() => <DrawerContent />}
    >
      <Drawer.Screen
        name="Map"
        options={{ headerTitle: "Book a Taxi" }}
        component={Map}
      />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
};

export default UserNav;
