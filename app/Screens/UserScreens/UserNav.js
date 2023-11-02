import { View, StyleSheet } from "react-native";
import Map from "./Map";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { colors } from "../../ReusableTools/css";
import { Ionicons } from "@expo/vector-icons";
import { i18nStore } from "../../MobX/I18nStore";

// import screens
import DrawerContent from "../../Components/User/DrawerContent";
import Payment from "./Payment";
import TripHistory from "./TripHistory";
import Help from "./Help";
import Privacy from "./Privacy";
import Setting from "./Setting";
import { useContext } from "react";
import { I18nContext } from "../../Context/I18nContext";

const Drawer = createDrawerNavigator();

const UserNav = () => {
  // const { i18n } = useContext(I18nContext);
  const { i18n } = i18nStore;

  if (i18n === null) return;

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
          headerTitle: `${i18n.t("userNav.homeTitle")}`,
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
      <Drawer.Screen
        name={`${i18n.t("userNav.screens.payment")}`}
        component={Payment}
      />
      <Drawer.Screen
        name="Trip"
        options={{
          headerTitle: "Trip history",
        }}
        component={TripHistory}
      />
      <Drawer.Screen
        name={`${i18n.t("userNav.screens.help")}`}
        component={Help}
      />
      <Drawer.Screen
        name={`${i18n.t("userNav.screens.privacy")}`}
        component={Privacy}
      />
      <Drawer.Screen
        name={`${i18n.t("userNav.screens.setting")}`}
        component={Setting}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 10,
  },
});

export default UserNav;
