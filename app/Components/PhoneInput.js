import { StyleSheet, Text, View } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { fonts } from "../ReusableTools/css";

const PhoneInputComponent = ({ phoneInput, value, setValue, error }) => {
  return (
    <View className="justify-center w-[100%] mx-[15px] mb-[20px]">
      <View className="flex-row items-center">
        <View className="pr-2 mr-2" style={styles.square}>
          <View
            className="w-[10px] h-[10px] mt-[7px] rotate-45"
            style={{ backgroundColor: "white" }}
          />
        </View>

        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="LB"
          layout="first"
          onChangeFormattedText={(text = "") => {
            setValue(text);
          }}
          textContainerStyle={{
            backgroundColor: "transparent",
            width: "100%",
            fontFamily: fonts.regular,
          }}
          containerStyle={{
            borderWidth: 1,
            borderRadius: 10,
            width: "85%",
            alignItems: "center",
            justifyContent: "center",
          }}
          codeTextStyle={{
            fontFamily: fonts.regular,
          }}
        />
      </View>

      {error !== "" && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: 12,
    marginHorizontal: 5,
  },
  square: {
    borderRightWidth: 1,
    borderRightColor: "#9DC2F4",
    height: "75%",
    paddingTop: 10,
  },
});

export default PhoneInputComponent;
