import Option from "../../Components/Options.js";
import { i18nStore } from "../../MobX/I18nStore.js";
import { useNavigation } from "@react-navigation/native";
import DeleteAccount from "../../Components/DeleteAccount.js";

const Setting = () => {
  const { i18n } = i18nStore;

  const navigation = useNavigation();

  const lang = i18n.locale.includes("en") ? "English" : "العربية";

  const options = [
    {
      title: `${i18n.t("setting.lang")}`,
      subTitle: lang,
      onPress: () => {
        navigation.navigate("switchLang");
      },
    },
  ];

  return (
    <>
      {options.map((option, index) => {
        return (
          <Option
            key={index}
            title={option.title}
            subTitle={option.subTitle}
            onPress={option.onPress}
          />
        );
      })}
      <DeleteAccount />
    </>
  );
};

export default Setting;
