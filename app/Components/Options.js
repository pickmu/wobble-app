import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { i18nStore } from "../MobX/I18nStore";

const Option = ({ onPress, title, icon }) => {
  const { i18n } = i18nStore;
  const isArabic = i18n.locale.includes("ar");

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.shadow}
      className="bg-headers w-[65%] rounded-r-full mb-7"
    >
      <View className="flex-row p-4 items-center">
        {icon}

        <View className="pl-2">
          <Text className="text-[22px] font-regular">{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Option;

const styles = StyleSheet.create({
  shadow: {
    elevation: 10,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
});
