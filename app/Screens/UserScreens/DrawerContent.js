import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";

const DrawerContent = () => {
  const menuItems = [
    {
      icon: <AntDesign name="home" size={24} color="black" />,
      text: "Home",
    },
    {
      icon: <MaterialIcons name="payment" size={24} color="black" />,
      text: "Paymend",
    },
    {
      icon: (
        <Image
          source={require("../../Images/distance.png")}
          className="w-6 h-6"
        />
      ),
      text: "Trip History",
    },
    {
      icon: <Feather name="help-circle" size={24} color="black" />,
      text: "Help",
    },
    {
      icon: (
        <Image
          source={require("../../Images/insurance.png")}
          className="w-6 h-6"
        />
      ),
      text: "Privacy",
    },
    {
      icon: <Feather name="settings" size={24} color="black" />,
      text: "Setting",
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
          <Text>James Jakob</Text>
          <Text>JamesJakob@gmail.com</Text>
        </View>
        <View className="m-5">
          {menuItems.map((item, index) => (
            <View className="flex-row items-center py-2 gap-5" key={index}>
              {item.icon}
              <Text className="text-base">{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.logOut} className="flex-row  bg-Primary px-7 py-4">
        <Ionicons
          name="power-outline"
          size={24}
          color="white"
          style={{ transform: [{ rotate: "90deg" }] }}
        />
        <Text className="text-white text-base ml-4">Log Out</Text>
      </View>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  logOut: {
    borderRadius: 15,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1F2325",
    width: 20,
    height: 20,
    borderRadius: 10,
    paddingTop: 4,
    paddingLeft: 1,
    overflow: "hidden",
    alignItems: "center",
  },
});
