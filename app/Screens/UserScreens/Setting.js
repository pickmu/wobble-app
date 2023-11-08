import { View, Text, Alert, TouchableOpacity } from "react-native";
import Option from "../../Components/Options.js";
import { i18nStore } from "../../MobX/I18nStore.js";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from "axios";
import { authStore } from "../../MobX/AuthStore.js";

const Setting = () => {
  const { i18n } = i18nStore;
  const { userInfo, setUserToken, setUserInfo, setLoading } = authStore;

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

  const handleAlertDeleteAccount = () => {
    Alert.alert(
      `${i18n.t("setting.deleteAccount.titleAlert")}`,
      `${i18n.t("setting.deleteAccount.subTitleAlert")}`,
      [
        {
          text: `${i18n.t("cancel")}`,
          style: "cancel",
        },
        {
          text: `${i18n.t("setting.deleteAccount.AlertButtons")}`,
          onPress: async () => {
            await handleDeleteAccount();
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true)
      await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}user/deleteUser/${userInfo._id}`
      );

      setUserToken(null);

      setUserInfo(null);
      
      setLoading(false)
    } catch (error) {
      console.log("handel submit sign up error", error);
      Toast.show({
        type: "error",
        text1: error.message,
      });
    }
  };

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
      <TouchableOpacity onPress={handleAlertDeleteAccount}>
        <Text className="text-base font-regular p-4 text-red-500">
          Delete Account
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default Setting;
