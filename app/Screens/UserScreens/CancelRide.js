import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../../ReusableTools/css";
import { Button } from "../../ReusableTools/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CancelRide = () => {
  const cancelTexts = [
    {
      text: "Pickup took too long",
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

  const [selectedReasonIndex, setSelectedReasonIndex] = useState(null);

  const [cancelReason, setCancelReason] = useState("");

  const [otherText, setOtherText] = useState("");

  const handleTextOptionPress = (text, index) => {
    setSelectedReasonIndex(index === selectedReasonIndex ? null : index);

    setCancelReason(text);
  };

  const handleTextChange = (text) => {
    setOtherText(text);
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {cancelTexts.map((text, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTextOptionPress(text.text, index)}
          >
            <View style={styles.textOption}>
              <View
                style={[
                  styles.checkCircle,
                  selectedReasonIndex === index && {
                    backgroundColor: colors.yellow,
                  },
                ]}
              >
                {selectedReasonIndex === index && (
                  <Entypo name="check" size={10} color="black" />
                )}
              </View>
              <Text style={styles.text}>{text.text}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TextInput
          style={styles.inputField}
          multiline
          numberOfLines={10}
          value={otherText}
          onChangeText={handleTextChange}
          editable={selectedReasonIndex === cancelTexts.length - 1 }
        />

        <Button text={"Done"} />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkCircle: {
    width: 15,
    height: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
  },
  text: {
    fontFamily: "regular",
    fontSize: 20,
  },
  inputField: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderTopLeftRadius: 15,
    textAlignVertical: "top",
    padding: 10,
    marginBottom: 10,
  },
});

export default CancelRide;
