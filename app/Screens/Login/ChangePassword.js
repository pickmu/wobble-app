import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { i18nStore } from "../../MobX/I18nStore";
import { Button } from "../../ReusableTools/Button";
import { colors } from "../../ReusableTools/css";
import axios from "axios";
import { showToast } from "../../ReusableTools/ShowToast";
import Loading from "../../ReusableTools/Loading";

const ChangePassword = ({ route }) => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const { user_id } = route.params;

  const { i18n } = i18nStore;

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    password: "",
    confirm_password: "",
  });

  const ChangeUserPassword = async () => {
    try {
      if (!data.password || !data.confirm_password) {
        showToast("error", `${i18n.t("toast.error.emptyFields")}`);
        return;
      }

      if (data.password.trim() !== "") {
        // Validate password format
        const passwordRegex = /^(?=.*[A-Za-z\d]).{8,}$/;
        if (!passwordRegex.test(data.password)) {
          showToast("error", `${i18n.t("signUpUser.error.password.invalid")}`);

          return;
        }
      }

      if (data.password !== data.confirm_password) {
        showToast("error", `${i18n.t("toast.error.passwordNotMatch")}`);
        return;
      }

      setIsLoading(true);

      await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}user/updateUser/${user_id}`,
        {
          password: data.password,
        }
      );

      setIsLoading(false);

      showToast("success", `${i18n.t("toast.success.changePass")}`);

      navigation.navigate(`${i18n.t("signNav.signIn")}`);
    } catch (error) {
      console.log("check user", error.message);
      showToast("error", "User not found");
    }
  };

  const handleInputChange = (label, text) => {
    setData((prevData) => ({
      ...prevData,
      [label]: text,
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1">
      <View style={{ paddingTop: insets.top, width: "50%" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../Images/Icons/arrow.png")}
            style={{
              width: 50,
              height: 20,
              marginBottom: 3,
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 mx-10 mt-5 justify-between items-center">
        <View>
          <View className="bg-headers rounded-2xl py-5 items-center mb-10">
            <Text className="text-[25px] font-regular text-center px-5">
              {i18n.t("accRecovery.recovery")}{" "}
            </Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder={i18n.t("accRecovery.newPass")}
              value={data.password}
              onChangeText={(text) => handleInputChange("password", text)}
            />

            <TextInput
              style={styles.input}
              placeholder={i18n.t("accRecovery.confirmPass")}
              value={data.confirm_password}
              onChangeText={(text) =>
                handleInputChange("confirm_password", text)
              }
            />
          </KeyboardAvoidingView>
        </View>

        <View className="mb-16">
          <Button
            text={`${i18n.t("submit")}`}
            onPress={ChangeUserPassword}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  inputContainer: {
    gap: 20,
  },
});
