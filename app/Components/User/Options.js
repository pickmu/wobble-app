import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { i18nStore } from "../../MobX/I18nStore";

const Option = ({ onPress, title, subTitle }) => {
  const { i18n } = i18nStore;
  const isArabic = i18n.locale.includes("ar");

  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <View className="absolute bottom-0 right-0 h-[1] w-full bg-gray-300 ml-5" />
        <View className="flex-row justify-between py-4 px-4 border-gray">
          <View className="items-center flex-row gap-4">
            <Text className="text-base">{title}</Text>
            {subTitle && (
              <Text className="text-sm text-gray-500">{subTitle}</Text>
            )}
          </View>
          <MaterialIcons
            name="navigate-next"
            size={36}
            color="gray"
            style={{ transform: [{ rotate: isArabic ? "180deg" : "0deg" }] }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Option;
