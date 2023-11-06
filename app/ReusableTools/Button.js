import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { fonts } from "./css";

export const Button = ({ text, onPress }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [pressed && styles.buttonPressed]}
        android_ripple={{ color: "#ccc" }}
        onPress={onPress}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.text} className="uppercase">
            {text}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 40,
    marginVertical: 10,
    elevation: 3,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    borderRadius: Platform.OS === "android" ? 100 : 0,
  },
  buttonContainer: {
    backgroundColor: "#ffd403",
    paddingHorizontal: 40,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: Platform.OS === "ios" ? 100 : 0,
  },
  text: {
    color: "black",
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
