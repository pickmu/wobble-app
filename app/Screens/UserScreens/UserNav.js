import { View, StyleSheet, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { i18nStore } from "../../MobX/I18nStore";

import { colors, fonts } from "../../ReusableTools/css";

import DrawerContent from "../../Components/DrawerContent";

// import screens
import Map from "./Map";
import Rides from "./Rides";
import Setting from "./Setting";
import SwitchLang from "./SwitchLang";
import EditProfile from "./EditProfile";
import Notifications from "./Notifications";
import Chat from "./Chat";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const UserNav = () => {
  const { i18n } = i18nStore;

  if (i18n === null) return;

  const DrawersScreens = ({ navigation }) => {
    return (
      <Drawer.Navigator
        initialRouteName="Map"
        screenOptions={{
          headerTintColor: colors.secondary,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTitleStyle: {
            fontFamily: fonts.regular,
          },
          drawerStyle: {
            borderBottomRightRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#E3E5EB",
          },
          drawerActiveBackgroundColor: colors.primary,
          // header: () => null,
        }}
        drawerContent={() => <DrawerContent />}
      >
        <Drawer.Screen
          name="Map"
          component={Map}
          options={{
            headerTitle: `${i18n.t("userNav.homeTitle")}`,
            headerRight: () => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    `${i18n.t("userNav.screens.notifications")}`
                  )
                }
              >
                <View style={styles.headerRight}>
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color={colors.secondary}
                  />
                </View>
              </TouchableOpacity>
            ),
            header: () => null,
          }}
        />

        <Drawer.Screen
          name={i18n.t("userNav.screens.rides")}
          component={Rides}
        />

        <Drawer.Screen
          name={`${i18n.t("userNav.screens.settings")}`}
          component={Setting}
        />

        <Drawer.Screen
          name={`${i18n.t("userNav.screens.chat")}`}
          component={Chat}
        />
      </Drawer.Navigator>
    );
  };

  return (
    <Stack.Navigator
      initialRouteName={`${i18n.t("userNav.screens.back")}`}
      screenOptions={{
        headerTintColor: colors.secondary,
        headerStyle: {
          backgroundColor: colors.primary,
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
        name={`${i18n.t("userNav.screens.back")}`}
        options={{ headerShown: false }}
        component={DrawersScreens}
      />

      <Stack.Screen
        name="switchLang"
        options={{
          headerTitle: `${i18n.t("userNav.screens.switchLang")}`,
        }}
        component={SwitchLang}
      />

      <Stack.Screen
        name="EditProfile"
        options={{
          headerTitle: `${i18n.t("userNav.screens.editProfile")}`,
        }}
        component={EditProfile}
      />

      <Stack.Screen
        name={`${i18n.t("userNav.screens.notifications")}`}
        component={Notifications}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 10,
  },
});

export default UserNav;
