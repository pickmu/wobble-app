import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { colors } from "../../ReusableTools/css";
import { useNavigation } from "@react-navigation/native";
import { i18nStore } from "../../MobX/I18nStore";

const DrawerContent = () => {
  const [activeScreen, setActiveScreen] = useState("Map");
  const { i18n } = i18nStore;
  const isArabic = i18n.locale.includes("ar");

  const navigation = useNavigation();

  const menuItems = [
    {
      screenName: "Map",
      icon: (
        <AntDesign
          name="home"
          size={24}
          color={activeScreen === "Map" ? "white" : "black"}
        />
      ),
      text: `${i18n.t("drawerContent.home")}`,
      onPress: () => {
        navigation.navigate("Map");
        setActiveScreen("Map");
      },
    },
    {
      screenName: "Payment",
      icon: (
        <MaterialIcons
          name="payment"
          size={24}
          color={activeScreen === "Payment" ? "white" : "black"}
        />
      ),
      text: `${i18n.t("drawerContent.payment")}`,
      onPress: () => {
        navigation.navigate(`${i18n.t("userNav.screens.payment")}`);
        setActiveScreen("Payment");
      },
    },
    {
      screenName: "Trip",
      icon: (
        <Image
          source={require("../../Images/distance.png")}
          className="w-6 h-6"
          style={{
            tintColor: activeScreen === "Trip" ? "white" : "black",
          }}
        />
      ),
      text: `${i18n.t("drawerContent.tripHistory")}`,
      onPress: () => {
        navigation.navigate("Trip");
        setActiveScreen("Trip");
      },
    },
    {
      screenName: "Help",
      icon: (
        <Feather
          name="help-circle"
          size={24}
          color={activeScreen === "Help" ? "white" : "black"}
        />
      ),
      text: `${i18n.t("drawerContent.help")}`,
      onPress: () => {
        navigation.navigate(`${i18n.t("userNav.screens.help")}`);
        setActiveScreen("Help");
      },
    },
    {
      screenName: "Privacy",
      icon: (
        <Image
          source={require("../../Images/insurance.png")}
          className="w-6 h-6"
          style={{
            tintColor: activeScreen === "Privacy" ? "white" : "black",
          }}
        />
      ),
      text: `${i18n.t("drawerContent.privacy")}`,
      onPress: () => {
        navigation.navigate(`${i18n.t("userNav.screens.privacy")}`);
        setActiveScreen("Privacy");
      },
    },
    {
      screenName: "Setting",
      icon: (
        <Feather
          name="settings"
          size={24}
          color={activeScreen === "Setting" ? "white" : "black"}
        />
      ),
      text: `${i18n.t("drawerContent.settings")}`,
      onPress: () => {
        navigation.navigate(`${i18n.t("userNav.screens.settings")}`);
        setActiveScreen("Setting");
      },
    },
  ];

  return (
    <View className="flex-1 items-center justify-between mb-10">
      <View className="w-full mt-20">
        <View className="flex-col items-center gap-2 border-b border-[#e4e4e4] pb-4">
          <View className="relative">
            <FontAwesome name="user-circle-o" size={50} color="gray" />
            <View style={styles.editIcon}>
              <MaterialIcons name="edit" size={12} color="white" />
            </View>
          </View>
          <Text className="font-regular">James Jakob</Text>
          <Text className="font-regular">JamesJakob@gmail.com</Text>
        </View>
        <View className="m-5">
          {menuItems.map((item, index) => (
            <TouchableOpacity onPress={item.onPress} key={index}>
              <View
                className="my-1"
                style={
                  item.screenName === activeScreen && styles.activeMenuItem
                }
              >
                <View className="flex-row items-center gap-5 p-2">
                  {item.icon}
                  <Text
                    className="text-base font-regular"
                    style={
                      item.screenName === activeScreen && styles.activeMenuText
                    }
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.logOut} className="flex-row  bg-Primary px-7 py-4">
        <Ionicons
          name="power-outline"
          size={24}
          color="white"
          style={{ transform: [{ rotate: isArabic ? "-90deg" : "90deg" }] }}
        />
        <Text className="text-white text-base ml-4 font-regular">{`${i18n.t(
          "drawerContent.logOut"
        )}`}</Text>
      </View>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  activeMenuItem: {
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  activeMenuText: {
    color: "white",
  },
  logOut: {
    borderRadius: 15,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    paddingLeft: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
