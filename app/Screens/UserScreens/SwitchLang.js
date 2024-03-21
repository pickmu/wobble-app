import { Text, View, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { i18nStore } from "../../MobX/I18nStore";

const SwitchLang = () => {
  const { i18n, changeLocale } = i18nStore;
  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];

  return (
    <>
      {languages.map((language) => (
        <TouchableOpacity
          key={language.code}
          onPress={() => changeLocale(language.code)}
        >
          <View>
            <View className="absolute bottom-0 right-0 h-[1] w-full bg-gray-300 ml-5" />
            <View className="py-4 px-2">
              <View className="flex-row items-center gap-3">
                {i18n.locale.includes(language.code) ? (
                  <AntDesign name="check" size={26} color="black" />
                ) : (
                  <View className="w-[26px] h-[26px]" />
                )}
                <Text className="text-lg font-regular">{language.label}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

export default SwitchLang;
