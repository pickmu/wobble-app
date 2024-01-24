import Option from "../../Components/Options.js";
import DeleteAccount from "../../Components/DeleteAccount.js";
import { i18nStore } from "../../MobX/I18nStore.js";
import { useNavigation } from "@react-navigation/native";
import { Image, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const Setting = () => {
  const { i18n } = i18nStore;

  const navigation = useNavigation();

  const options = [
    {
      title: `${i18n.t("setting.about")}`,
      icon: (
        <AntDesign name="exclamationcircleo" size={30} color="#7a7979" />
      ),
      onPress: () => {
        navigation.navigate(`${i18n.t("userNav.screens.switchLang")}`);
      },
    },
    {
      title: `${i18n.t("setting.support")}`,
      icon: (
        <AntDesign name="questioncircleo" size={30} color="#7a7979" />
      ),
      onPress: () => {
        navigation.navigate(`${i18n.t("userNav.screens.switchLang")}`);
      },
    },
    {
      title: `${i18n.t("setting.lang")}`,
      icon: (
        <Image
          source={require("../../Images/Icons/language.png")}
          className="w-[30px] h-[30px]"
        />
      ),
      onPress: () => {
        navigation.navigate(`${i18n.t("userNav.screens.switchLang")}`);
      },
    },
  ];

  return (
    <View className="flex-1 justify-center">
      {options.map((props, index) => {
        return <Option key={index} {...props} />;
      })}
      <DeleteAccount />
    </View>
  );
};

export default Setting;
