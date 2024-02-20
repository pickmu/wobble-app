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

const OTP = ({ route }) => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const { i18n } = i18nStore;

  const { phone, user_id } = route.params;

  const [focusedInput, setFocusedInput] = useState(0);

  const [resend, setResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    const sendWhatsappOtp = async () => {
      try {
        let otp = ""; // Initialize otp as an empty string

        for (let i = 0; i < 4; i++) {
          otp += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
        }

        await axios.get(
          `https://www.bestsmsbulk.com/bestsmsbulkapi/common/sendSmsWpAPI.php?username=wobbleapi&password=Wobl45!3&message=${otp}&route=wp&senderid=WOBBLE&destination=${phone}`
        );

        await axios.patch(
          `${process.env.EXPO_PUBLIC_API_URL}user/updateUser/${user_id}`,
          {
            otp: otp,
          }
        );
      } catch (error) {}
    };

    sendWhatsappOtp();
  }, [phone]);

  const fields = [1, 2, 3, 4];

  const handleOtpChange = (index, text) => {
    if (text === "" && index > 0) {
      // If backspace is pressed in the first field, do nothing
      inputRefs.current[index - 1].focus(); // Shift focus to the previous input field
    } else if (index < fields.length - 1 && text !== "") {
      inputRefs.current[index + 1].focus(); // Shift focus to the next input field
    }
  };

  const handleResend = () => {
    setResend(true);
  };

  return (
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
            <Text className="text-Primary">{i18n.t("otp.resendCode")}</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-16">
          <Button text={`${i18n.t("submit")}`} />
        </View>
      </View>
    </View>
  );
};

export default OTP;

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
