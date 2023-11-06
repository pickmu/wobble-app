import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { colors, fonts } from "../../ReusableTools/css";
import { FieldsetInput } from "../../ReusableTools/FieldsetInput";
import { useFonts } from "expo-font";
import { Button } from "../../ReusableTools/Button";
import { i18nStore } from "../../MobX/I18nStore";

const SignIn = ({ navigation }) => {
  const { i18n } = i18nStore;

  const [fontsLoaded] = useFonts({
    "Agrandi-Regular": require("../../Fonts/Agrandir-Regular.otf"),
    "Agrandi-TextBold": require("../../Fonts/Agrandir-TextBold.otf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundView} />
      <View style={styles.contentView}>
        <View style={styles.roundedLogo}>
          <Image
            source={require("../../Images/logo.png")}
            style={styles.image}
            accessibilityLabel="Logo of your app"
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
          label={`${i18n.t("signUpUser.input.phone.label")}`}
          placeholder={`${i18n.t("signUpUser.input.phone.placeholder")}`}
          keyboardType="numeric"
        />
        <FieldsetInput
          label={`${i18n.t("signUpUser.input.password.label")}`}
          placeholder={`${i18n.t("signUpUser.input.password.placeholder")}`}
        />
        <Text className="text-yellow-400 text-center my-2">
          Forgot password?
        </Text>
        <Button
          text={"Sign In"}
          onPress={() => navigation.navigate("SignUp")}
        />
        <View className="self-center pt-4 flex-row gap-1">
          <Text style="text-center">{`${i18n.t("signInUser.noAccount")}`}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text className="text-yellow-400">{`${i18n.t(
              "signInUser.signUp"
            )}`}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});

export default SignIn;
