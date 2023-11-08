import React, { forwardRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { fonts } from "./css";

export const FieldsetInput = forwardRef(
  (
    {
      label,
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
      onKeyPress = () => {}, // Default onKeyPress handler
      editable = true, // Default value is true
      multiline = false, // Default value is false
    },
    ref
  ) => {
    return (
      <>
        <View style={styles.fieldSet}>
          <Text style={styles.legend}>{label}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            ref={ref}
            keyboardType={keyboardType}
            maxLength={maxLength}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            autoCapitalize={autoCapitalize}
            clearButtonMode="while-editing"
            onKeyPress={onKeyPress}
            editable={editable}
            multiline={multiline}
            placeholderTextColor={"#ccc"}
          />
        </View>
        {error && (
          <Text className="text-red-500 text-xs mx-10 my-1">{error}</Text>
        )}
      </>
    );
  }
);

const styles = StyleSheet.create({
  fieldSet: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: "center",
    borderColor: "#ccc",
    marginVertical: 15,
    marginHorizontal: 20,
  },
  legend: {
    position: "absolute",
    top: -12,
    left: 25,
    backgroundColor: "#FFFFFF",
    maxWidth: 150,
    textAlign: "center",
    color: "#B1B1B1",
    fontSize: 15,
    paddingHorizontal: 5,
    fontFamily: fonts.regular,
  },
  input: {
    width: "100%",
    padding: 5,
    marginTop: 10,
  },
});
