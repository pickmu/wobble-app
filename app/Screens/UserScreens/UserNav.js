import { View, StyleSheet } from "react-native";
import Map from "./Map";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./Login";
import { useState } from "react";
import { colors } from "../../ReusableTools/css";
import { Ionicons } from "@expo/vector-icons";

// import screens
import DrawerContent from "../../Components/User/DrawerContent";
import Payment from "./Payment";
import TripHistory from "./TripHistory";
import Help from "./Help";
import Privacy from "./Privacy";
import Setting from "./Setting";

const Drawer = createDrawerNavigator();

const UserNav = () => {

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: colors.secondary,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        drawerStyle: {
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20,
        },
        drawerActiveBackgroundColor: colors.primary,
      }}
      drawerContent={() => <DrawerContent />}
    >
      <Drawer.Screen
        name="Map"
        component={Map}
        options={{
          headerTitle: "Book a Taxi",
          headerRight: () => (
            <View style={styles.headerRight}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.secondary}
              />
            </View>
          ),
        }}
      />
      <Drawer.Screen name="Payment" component={Payment} />
      <Drawer.Screen
        name="Trip"
        options={{
          headerTitle: "Trip history",
        }}
        component={TripHistory}
      />
      <Drawer.Screen name="Help" component={Help} />
      <Drawer.Screen name="Privacy" component={Privacy} />
      <Drawer.Screen name="Setting" component={Setting} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 10,
  },
});

export default UserNav;
