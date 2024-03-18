import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../ReusableTools/Button";
import { i18nStore } from "../../MobX/I18nStore";
import axios from "axios";
import { showToast } from "../../ReusableTools/ShowToast";
import { authStore } from "../../MobX/AuthStore";
import { observer } from "mobx-react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const OTP = ({ route }) => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const [otp, setOtp] = useState("");

  const { i18n } = i18nStore;

  const { loginResponse, setUserInfo, setUserToken, setLoading } = authStore;

  const { phone, user_id, changePass, login } = route.params;

  const [focusedInput, setFocusedInput] = useState(0);

  const [resend, setResend] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    const sendWhatsappOtp = async () => {
      try {
        let generatedOtp = ""; // Declare variable to store generated OTP
        for (let i = 0; i < 4; i++) {
          generatedOtp += String(Math.floor(Math.random() * 10)); // Concatenate each digit to the OTP string
        }

        // Send OTP via WhatsApp API
        const resp = await axios.get(
          `https://www.bestsmsbulk.com/bestsmsbulkapi/common/sendSmsWpAPI.php?username=wobbleapi&password=Wobl45!3&message=${generatedOtp}&route=wp&senderid=WOBBLE&destination=${phone}`
        );

        // Update state with generated OTP
        setOtp(generatedOtp);

        // Update OTP in backend
        await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}user/updateUser/${user_id}`,
          {
            otp: generatedOtp,
          }
        );
      } catch (error) {
        console.log("sendWhatsappOtp error: " + error.message);
      }
    };

    sendWhatsappOtp();
  }, [phone, user_id]);

  const fields = [1, 2, 3, 4];

  const handleOtpChange = (index, text) => {
    if (text === "" && index > 0) {
      // If backspace is pressed in the first field, do nothing
      inputRefs.current[index - 1].focus(); // Shift focus to the previous input field
    } else if (index < fields.length - 1 && text !== "") {
      inputRefs.current[index + 1].focus(); // Shift focus to the next input field
    }
  };

  const handleResend = async () => {
    setResend(true);
  };

  console.log("otp", otp);
  const checkOtpValidation = async () => {
    try {
      setIsLoading(true);

      const resp = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}user/getUserByPhone/${phone}`
      );

      if (resp.data.otp == otp) {
        setIsLoading(false);

        await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}user/updateUser/${user_id}`,
          {
            has_access: true,
          }
        );

        if (changePass) {
          navigation.navigate("changePass", {
            user_id: user_id,
          });
        } else if (login) {
          setLoading(true);
          console.log("loginResponse in check otp validation", loginResponse);
          setUserInfo(loginResponse.findUser);

          setUserToken(loginResponse.token);

          setLoading(false);

          setIsLoading(false);
        }
      } else {
        setIsLoading(false);

        showToast("error", "Invalid otp");
      }
    } catch (error) {
      console.log("checkOtpValidation error", error.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20}
    >
      <View style={{ flex: 1 }}>
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
              <Text className="text-[25px] font-regular">
                {i18n.t("otp.enterCode")}
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              {fields.map((otp, index) => {
                return (
                  <TextInput
                    key={index}
                    style={styles.field}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    onChangeText={(text) => handleOtpChange(index, text)}
                    onFocus={() => setFocusedInput(index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace") {
                        handleOtpChange(index, "");
                      }
                    }}
                  />
                );
              })}
            </View>

            <TouchableOpacity onPress={handleResend}>
              <Text className="text-Primary text-center mt-5">
                {i18n.t("otp.resendCode")}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-16">
            <Button
              text={
                isLoading
                  ? `${i18n.t("signUpUser.button.submitting")}`
                  : ` ${i18n.t("submit")}`
              }
              onPress={checkOtpValidation}
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default observer(OTP);

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderRadius: 10,
    width: 50,
    height: 50,
    backgroundColor: "#F7F7F7",
    padding: 10,
    fontSize: 25,
    textAlign: "center",
  },
});
