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
import { colors } from "../../ReusableTools/css";
import { FieldsetInput } from "../../ReusableTools/FieldsetInput";
import { Button } from "../../ReusableTools/Button";
import { i18nStore } from "../../MobX/I18nStore";
import Toast from "react-native-toast-message";
import { useEffect, useRef, useState } from "react";
import { authStore } from "../../MobX/AuthStore";

const SignIn = ({ navigation, route }) => {
  const { login } = authStore;
  const { i18n, changeLocale, locale } = i18nStore;
  // const { i18n, changeLocale, locale } = useContext(I18nContext);

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

      setSubmitting(true);

      await login({
        phone_number: data.phone_number,
        password: data.password,
      });

      setSubmitting(false);
    } catch (error) {
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
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={styles.backgroundView} />
          <View style={styles.contentView}>
            <View style={styles.roundedLogo}>
              <Image
                source={require("../../Images/logo.png")}
                style={styles.image}
                accessibilityLabel="Logo of the app"
              />
            </View>

            <View className="my-6 items-center">
              <Text className="font-boldText text-3xl">{`${i18n.t(
                "signInUser.title"
              )}`}</Text>
              <Text className="font-regular mt-2 text-gray-500">
                {`${i18n.t("signInUser.text")}`}
              </Text>
            </View>

            <FieldsetInput
              value={data.phone_number}
              label={`${i18n.t("signUpUser.input.phone.label")}`}
              placeholder={`${i18n.t("signUpUser.input.phone.placeholder")}`}
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange("phone_number", value)}
              onSubmitEditing={() => passwordRef.current.focus()}
            />

            <FieldsetInput
              value={data.password}
              label={`${i18n.t("signUpUser.input.password.label")}`}
              placeholder={`${i18n.t("signUpUser.input.password.placeholder")}`}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry={true}
              ref={passwordRef}
              onSubmitEditing={handleLogin}
              returnKeyType={"done"}
            />

            <Text className="text-yellow-400 text-center my-2">
              {`${i18n.t("signInUser.forgotPass")}`}
            </Text>

            <Button
              text={
                submitting
                  ? `${i18n.t("signUpUser.button.submitting")}`
                  : `${i18n.t("signInUser.signIn")}`
              }
              onPress={handleLogin}
              disabled={submitting}
            />

            <View className="self-center pt-4 flex-row gap-1">
              <Text style="text-center">{`${i18n.t(
                "signInUser.noAccount"
              )}`}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(`${i18n.t("signNav.signUp")}`)
                }
              >
                <Text className="text-yellow-400">{`${i18n.t(
                  "signInUser.signUp"
                )}`}</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-1 items-center justify-center mt-10">
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
        </ScrollView>
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
    position: "relative",
    flex: 5,
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  roundedLogo: {
    position: "absolute",
    top: -50,
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    borderRadius: 100,
    height: "100%",
  },
  activeLanguageButton: {
    color: colors.primaryYellow,
  },
});

export default SignIn;
