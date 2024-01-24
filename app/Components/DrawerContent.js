import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import { colors } from "../ReusableTools/css";
import { useNavigation } from "@react-navigation/native";
import { i18nStore } from "../MobX/I18nStore";
import { authStore } from "../MobX/AuthStore";
import profile from "../Images/Icons/profilee.png";

const DrawerContent = () => {
  const { i18n } = i18nStore;
  const { userInfo, logout } = authStore;

  const [activeScreen, setActiveScreen] = useState("Map");

  const navigation = useNavigation();

  const menuItems = [
    {
      screenName: "Map",
      icon: (
        <AntDesign
          name="home"
          size={24}
          color={activeScreen === "Map" ? "white" : "#A2A3A8"}
        />
      ),
      text: `${i18n.t("drawerContent.home")}`,
      onPress: () => {
        navigation.navigate("Map");
        setActiveScreen("Map");
      },
    },
    {
      screenName: `Rides`,
      icon: (
        <Image
          source={require("../Images/distance.png")}
          className="w-6 h-6"
          style={{
            tintColor: activeScreen === `Rides` ? "white" : "#A2A3A8",
          }}
        />
      ),
      text: `${i18n.t("drawerContent.rides")}`,
      onPress: () => {
        navigation.navigate(`${i18n.t("userNav.screens.rides")}`);
        setActiveScreen("Rides");
      },
    },
    {
      screenName: "Setting",
      icon: (
        <Feather
          name="settings"
          size={24}
          color={activeScreen === "Setting" ? "white" : "#A2A3A8"}
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
        <View
          className="flex-col items-start gap-2 border-b border-[#e4e4e4] pb-4"
          style={styles.borderBottom} 
        >
          <View className="flex-row items-center rounded-full">
            {userInfo?.image && userInfo?.image !== null ? (
              <View className="mr-2 p-3">
                <Image
                  source={{
                    uri:
                      `${process.env.EXPO_PUBLIC_API_URL}${userInfo.image}` ||
                      imageData?.uri,
                  }}
                  className="w-11 h-11 rounded-full "
                />
              </View>
            ) : (
              <View className="bg-[#F2F2F2] rounded-full p-3 mr-2">
                <Image
                  source={profile}
                  className="w-11 h-11"
                  style={{
                    resizeMode: "contain",
                  }}
                />
              </View>
            )}

            <View>
              <Text className="font-regular">{`${userInfo?.first_name} ${userInfo?.last_name}`}</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate(`EditProfile`)}
              >
                <Text className="text-Primary">View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center">
            <Text className="text-[17px] mr-1">⭐</Text>

            <Text className="font-bold mr-1">5.00</Text>

            <Text className="text-gray-600">Rating</Text>
          </View>
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

      <TouchableOpacity onPress={logout} className="self-start">
        <View className="flex-row px-7 py-4 items-center">
          <Ionicons name="log-out-outline" size={34} color="#A2A3A8" />

          <Text className="text-base ml-4 font-regular">{`${i18n.t(
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
    width: 60,
    height: 60,
  },
  borderBottom: {
    borderBottomWidth: 0.9,
    borderBottomColor: "black",
    marginLeft: 20,
    marginRight: 20,
  },
});
