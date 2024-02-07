import { View, Text, Image, Linking, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { i18nStore } from "../MobX/I18nStore";
import { authStore } from "../MobX/AuthStore";

const DriverData = ({ driver_id }) => {
  const navigation = useNavigation();

  const { i18n } = i18nStore;

  const { userInfo } = authStore;

  const handlePhoneCall = () => {
    if (driver_id.phone_number) {
      Linking.openURL(`tel:${driver_id.phone_number}`);
    } else {
      console.log("Phone number is not available.");
    }
  };

  const handleOpenChat = () => {
    // if (driver_id.phone_number) {
    //   Linking.openURL(`whatsapp://send?phone=${driver_id.phone_number}`);
    // } else {
    //   console.log("WhatsApp number is not available.");
    // }
    navigation.navigate(`${i18n.t("userNav.screens.chat")}`, {
      driver_id: driver_id?._id,
      user_id: userInfo?._id,
    });
  };

  return (
    <View className="flex-1 items-center py-5 px-10">
      <View className="flex-row justify-between items-center w-full">
        <Text className="font-regular text-Primary">Rider Details</Text>

        <View className="flex-row items-center gap-5">
          <TouchableOpacity onPress={handlePhoneCall}>
            <View className="bg-[#9EC4F7] p-3 rounded-full">
              <Image
                source={require("../Images/Icons/phone.png")}
                className="w-[24px] h-[24px]"
                style={{ resizeMode: "contain" }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenChat}>
            <View className="bg-[#9EC4F7] p-3 rounded-full">
              <FontAwesome name="envelope" size={24} color="#273992" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DriverData;
