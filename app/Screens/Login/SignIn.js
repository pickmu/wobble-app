import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { colors } from "../../ReusableTools/css";
import { ReusableInput } from "../../ReusableTools/ReusableInput";
import { Button } from "../../ReusableTools/Button";
import { i18nStore } from "../../MobX/I18nStore";
import { authStore } from "../../MobX/AuthStore";
import Toast from "react-native-toast-message";

const SignIn = ({ navigation, route }) => {
  const { login, loginResponse } = authStore;
  const { i18n, changeLocale, locale } = i18nStore;

  useEffect(() => {
    // Check if there are route.params for phone and password and set them as initial values.
    if (route.params) {
      const { phone, password } = route.params;
      setData({
        phone_number: phone || "",
        password: password || "",
      });
    }
  }, [route.params]);

  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    phone_number: "",
    password: "",
  });

  const passwordRef = useRef();

  const handleInputChange = (label, value) => {
    setData((prevData) => ({
      ...prevData,
      [label]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      if (!data.phone_number && !data.password) {
        Toast.show({
          type: "error",
          text1: `${i18n.t("toast.error.emptyFields")}`,
        });
        return;
      }

      // Remove spaces and other non-digit characters from the phone number
      const formattedPhoneNumber = data.phone_number.replace(/\D/g, "");

      setSubmitting(true);

      await login({
        phone_number: formattedPhoneNumber,
        password: data.password,
      });

      if (loginResponse.has_access === false) {
        navigation.navigate("otp", {
          phone: loginResponse.phone_number,
          user_id: loginResponse._id,
          login: true,
        });
      }

      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.log("handel submit sign up error", error);
      Toast.show({
        type: "error",
        text1: error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={false}
      >
        <View style={styles.contentView}>
          <View style={styles.roundedLogo}>
            <Image
              source={require("../../Images/Icons/Untitled-5.png")}
              style={styles.image}
              accessibilityLabel="Logo of the app"
            />
          </View>
          <View>
            <ReusableInput
              value={data.phone_number}
              label={`${i18n.t("signUpUser.input.phone.label")}`}
              placeholder={`${i18n.t("signUpUser.input.phone.placeholder")}`}
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange("phone_number", value)}
              onSubmitEditing={() => passwordRef.current.focus()}
            />

            <ReusableInput
              value={data.password}
              label={`${i18n.t("signUpUser.input.password.label")}`}
              placeholder={`${i18n.t("signUpUser.input.password.placeholder")}`}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry={true}
              ref={passwordRef}
              onSubmitEditing={handleLogin}
              returnKeyType={"done"}
            />
          </View>

          <View>
            <View className="flex-1 items-center mb-1 justify-center flex-row">
              <View className="h-[1px] bg-white w-[100px]" />

              <View className="bg-white w-[5px] h-[5px] rounded-full mx-2" />

              <View className="h-[1px] bg-white w-[100px]" />
            </View>

            <Button
              text={
                submitting
                  ? `${i18n.t("signUpUser.button.submitting")}`
                  : `${i18n.t("signInUser.signIn")}`
              }
              onPress={handleLogin}
              disabled={submitting}
            />

            <Button
              text={`${i18n.t("signInUser.signUp")}`}
              onPress={() => navigation.navigate(`${i18n.t("signNav.signUp")}`)}
              disabled={submitting}
              isTransparent={true}
            />

            <TouchableOpacity onPress={() => navigation.navigate("recovery")}>
              <Text className="text-white text-center my-2 text-base">
                {`${i18n.t("signInUser.forgotPass")}`}
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-1 items-center justify-center mt-1">
              <TouchableOpacity onPress={() => changeLocale("en")}>
                <Text
                  style={[locale.includes("en") && styles.activeLanguageButton]}
                >
                  English
                </Text>
              </TouchableOpacity>

              <Text>|</Text>

              <TouchableOpacity onPress={() => changeLocale("ar")}>
                <Text
                  style={[locale.includes("ar") && styles.activeLanguageButton]}
                >
                  العربية
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  backgroundView: {
    backgroundColor: "transparent",
    flex: 1,
  },
  contentView: {
    flex: 5,
    justifyContent: "space-evenly",
    backgroundColor: colors.primary,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  roundedLogo: {
    width: 200,
    height: 100,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  activeLanguageButton: {
    color: colors.secondary,
  },
});

export default SignIn;
