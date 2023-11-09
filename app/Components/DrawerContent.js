import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { colors } from "../ReusableTools/css";
import { useNavigation } from "@react-navigation/native";
import { i18nStore } from "../MobX/I18nStore";
import { authStore } from "../MobX/AuthStore";

const DrawerContent = () => {
  const { i18n } = i18nStore;
  const { userInfo, logout } = authStore;

  const [activeScreen, setActiveScreen] = useState("Map");
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
      screenName: "Chat",
      icon: (
        <Image
          source={require("../Images/chat.png")}
          className="w-6 h-6"
          style={{
            tintColor: activeScreen === "Chat" ? "white" : "black",
          }}
        />
      ),
      text: `${i18n.t("drawerContent.chat")}`,
      onPress: () => {
        navigation.navigate(`${i18n.t("userNav.screens.chat")}`);
        setActiveScreen("Chat");
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
          source={require("../Images/distance.png")}
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
            {userInfo?.image && userInfo?.image !== null ? (
              <View>
                <Image
                  source={{
                    uri:
                      `${process.env.EXPO_PUBLIC_API_URL}${userInfo.image}` ||
                      imageData?.uri,
                  }}
                  style={styles.image}
                />
              </View>
            ) : (
              <FontAwesome name="user-circle-o" size={75} color="gray" />
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
            >
              <View style={styles.editIcon}>
                <MaterialIcons name="edit" size={16} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <Text className="font-regular">{`${userInfo?.first_name} ${userInfo?.last_name}`}</Text>
          <Text className="font-regular">{userInfo?.email}</Text>
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

      <TouchableOpacity onPress={logout}>
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
      </TouchableOpacity>
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
    width: 25,
    height: 25,
    borderRadius: 12.5,
    paddingLeft: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
  },
});
