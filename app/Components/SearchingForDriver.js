import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { colors } from "../ReusableTools/css";

const SearchingForDriver = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={"large"} color={colors.primary} />

      <Text className="font-regular">Looking for a driver...</Text>
    </View>
  );
};

export default SearchingForDriver;
