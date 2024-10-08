import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { colors, fonts } from "./css";

export const Button = ({
  text,
  onPress,
  disabled,
  isTransparent,
  cars,
  cancel,
  loading,
}) => {
  return (
    <View style={[styles.container, cars && { marginHorizontal: 20 }]}>
      <Pressable
        style={({ pressed }) => [
          pressed && styles.buttonPressed,
          styles.buttno,
        ]}
        android_ripple={{ color: "#ccc" }}
        onPress={onPress}
        disabled={disabled}
      >
        <View
          style={[
            styles.buttonContainer,
            disabled && { backgroundColor: colors.accent },
            isTransparent && styles.transparent,
            cancel && { borderRadius: 50 },
          ]}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.text}>{text}</Text>
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 40,
    marginVertical: 10,
    borderRadius: 15,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  buttonContainer: {
    backgroundColor: colors.accent,
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 15,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  text: {
    color: "white",
    fontFamily: fonts.regular,
    fontSize: 20,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  transparent: {
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1,
  },
});
