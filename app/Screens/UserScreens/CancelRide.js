import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors, fonts } from "../../ReusableTools/css";
import { Button } from "../../ReusableTools/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { showToast } from "../../ReusableTools/ShowToast";
import { observer } from "mobx-react";
import { orderAcceptedStore } from "../../MobX/OrderAcceptedStore";
import { orderStore } from "../../MobX/OrderStore";

const CancelRide = ({ route, navigation }) => {
  const { order_id } = route.params;

  const { setOrderAccepted, setShowComponent, setOrderCanceled } =
    orderAcceptedStore;

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

  const handleCancelRide = async () => {
    try {
      if (!cancelReason) {
        showToast("error", "Please select a reason");
        return;
      }

      const requestData = {
        ride_status: "Canceled",
        cancel_reason: cancelReason ? cancelReason : otherText,
        is_ended: true,
      };

      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}order/updateOrder/${order_id}`,
        requestData
      );

      navigation.navigate("Map");

      setOrderAccepted(false);

      setShowComponent(true);

      // setDestination("");

      setOrderCanceled(true);

      showToast("success", "Your ride has been canceled");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <KeyboardAwareScrollView>
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
          editable={selectedReasonIndex === cancelTexts.length - 1}
        />
      </View>

      <Button text={"Done"} onPress={handleCancelRide} />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
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
    fontFamily: fonts.regular,
    fontSize: 20,
  },
  inputField: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderTopLeftRadius: 15,
    textAlignVertical: "top",
    padding: 10,
    marginBottom: 10,
    fontSize: 18,
  },
});

export default observer(CancelRide);
