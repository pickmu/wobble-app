import { View, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { i18nStore } from "../../MobX/I18nStore";
import { useFonts } from "expo-font";

import DrawerContent from "../../Components/DrawerContent";
import { colors, fonts } from "../../ReusableTools/css";

// import screens
import Map from "./Map";
import Payment from "./Payment";
import TripHistory from "./TripHistory";
import Setting from "./Setting";
import SwitchLang from "./SwitchLang";
import EditProfile from "./EditProfile";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const UserNav = () => {
  const [fontsLoaded] = useFonts({
    "Agrandi-Regular": require("../../Fonts/Agrandir-Regular.otf"),
    "Agrandi-TextBold": require("../../Fonts/Agrandir-TextBold.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const { i18n } = i18nStore;

  if (i18n === null) return;

  const DrawersScreens = () => {
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
            headerTitle: `${i18n.t("userNav.screens.tripHistory")}`,
          }}
          component={TripHistory}
        />
        <Drawer.Screen
          name={`${i18n.t("userNav.screens.settings")}`}
          component={Setting}
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
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 10,
  },
});

export default UserNav;
