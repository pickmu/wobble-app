import { Text, Alert, TouchableOpacity } from "react-native";
import { i18nStore } from "../MobX/I18nStore";
import { authStore } from "../MobX/AuthStore";
import Toast from "react-native-toast-message";
import axios from "axios";
import { observer } from "mobx-react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeleteAccount = () => {
  const { i18n } = i18nStore;
  const { userInfo, setUserToken, setUserInfo, setLoading, logout } = authStore;

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
      setLoading(true);

      await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}user/deleteUser/${userInfo._id}`
      );

      logout();

      setUserToken(null);

      setUserInfo(null);

      setLoading(false);
    } catch (error) {
      console.log("handel submit sign up error", error);
      Toast.show({
        type: "error",
        text1: error.message,
      });
    }
  };
  return (
    <TouchableOpacity onPress={handleAlertDeleteAccount}>
      <Text className="text-base font-regular p-4 text-red-500">
        Delete Account
      </Text>
    </TouchableOpacity>
  );
};

export default observer(DeleteAccount);
