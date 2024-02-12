import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../../ReusableTools/css";
import { Button } from "../../ReusableTools/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CancelRide = () => {
  const cancelTexts = [
    {
      text: "Pickup took to long",
    },
    {
      text: "Driver isn't moving",
    },
    {
      text: "The driver has not arrived at the pickup location",
    },
    {
      text: "Driver asked to cancel",
    },
    {
      text: "Other",
    },
  ];
  return (
    <KeyboardAwareScrollView className="flex-1">
      <View className="px-10 py-10">
        {cancelTexts.map((text, index) => {
          return (
            <View key={index} className="flex-row items-center gap-4 mb-10">
              <View
                className="rounded-full w-[15px] h-[15px] items-center justify-center"
                style={{ backgroundColor: colors.yellow }}
              >
                <Entypo name="check" size={10} color="black" />
              </View>
              <Text className="font-regular text-[20px]">{text.text}</Text>
            </View>
          );
        })}

        <TextInput style={styles.inputField} multiline numberOfLines={10} />

        <Button text={"Done"} />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default CancelRide;

const styles = StyleSheet.create({
  inputField: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderTopLeftRadius: 15,
    textAlignVertical: "top",
    padding: 10
  },
});
