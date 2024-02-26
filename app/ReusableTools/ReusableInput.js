import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors } from "./css";

export const ReusableInput = React.forwardRef(
  (
    {
      value,
      placeholder,
      onChangeText,
      error,
      onSubmitEditing,
      maxLength = null, // Default value is null
      keyboardType = "default", // Default value is "default"
      secureTextEntry = false, // Default value is false
      returnKeyType = "next", // Default value is next
      autoCapitalize = "sentences", // Default value is sentences
      clearButtonMode = "while-editing", // Default value is while-editing
      onKeyPress = () => {}, // Default onKeyPress handler
      editable = true, // Default value is true
      multiline = false, // Default value is false
      onFocus = () => {}, // Default onFocus handler
      onBlur = () => {}, // Default onBlur handler
      isBlue,
    },
    ref
  ) => {
    return (
      <View style={styles.inputContainer}>
        <View className="flex-row">
          <View className="pr-2 mr-2" style={styles.square}>
            <View
              className="w-[10px] h-[10px] rotate-45"
              style={{ backgroundColor: isBlue ? colors.primary : "white" }}
            />
          </View>
          <TextInput
            style={styles.inputField}
            ref={ref}
            value={value}
            keyboardType={keyboardType}
            maxLength={maxLength}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            returnKeyType={returnKeyType}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            autoCapitalize={autoCapitalize}
            clearButtonMode={clearButtonMode}
            onKeyPress={onKeyPress}
            editable={editable}
            multiline={multiline}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    alignItems: "center",
    marginHorizontal: 15,
  },
  square: {
    borderRightWidth: 1,
    borderRightColor: "#9DC2F4",
    height: "75%",
    paddingTop: 10,
  },
  inputField: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flex: 1,
    borderWidth: 1,
    fontSize: 19,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginHorizontal: 5,
    marginVertical: 2,
  },
});
