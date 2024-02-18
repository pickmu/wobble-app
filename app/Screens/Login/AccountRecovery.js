import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { i18nStore } from "../../MobX/I18nStore";
import { Button } from "../../ReusableTools/Button";
import { colors } from "../../ReusableTools/css";

const AccountRecovery = () => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const { i18n } = i18nStore;

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
            <TextInput style={styles.input} placeholder="Full Name" />

            <TextInput style={styles.input} placeholder="Phone Number" />
          </KeyboardAvoidingView>
        </View>

        <View className="mb-16">
          <Button text={`${i18n.t("submit")}`} />
        </View>
      </View>
    </View>
  );
};

export default AccountRecovery;

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
