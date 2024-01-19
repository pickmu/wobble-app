import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { colors, fonts } from "./css";

export const Button = ({ text, onPress, disabled, isTransparent }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [pressed && styles.buttonPressed]}
        android_ripple={{ color: "#ccc" }}
        onPress={onPress}
        disabled={disabled}
      >
        <View
          style={[
            styles.buttonContainer,
            disabled && { backgroundColor: colors.accent },
            isTransparent && styles.transparent,
          ]}
        >
          <Text style={styles.text}>{text}</Text>
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
  },
  buttonContainer: {
    backgroundColor: colors.accent,
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 15,
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
    borderColor: "white",
  },
});
