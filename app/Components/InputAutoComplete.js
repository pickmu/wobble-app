import { StyleSheet, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { fonts } from "../ReusableTools/css";

const InputAutoComplete = ({
  icon,
  label,
  placeholder,
  onPlaceSelected,
  onSearchError,
}) => {
  return (
    <>
      <View className="flex-row gap-1 items-center my-2">
        <Text>{icon}</Text>
        <Text className="text-white font-regular">{label}</Text>
      </View>
      <GooglePlacesAutocomplete
        apiKey={process.env.EXPO_PUBLIC_MAP_API_KEY}
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        requestConfig={{ countries: ["LB"] }}
        onPlaceSelected={onPlaceSelected}
        onSearchError={onSearchError}
        query={{
          key: process.env.EXPO_PUBLIC_MAP_API_KEY,
          language: "en",
        }}
        fetchDetails
      />
    </>
  );
};

export default InputAutoComplete;

const styles = StyleSheet.create({
  input: {
    borderColor: "#888",
    borderWidth: 1,
    fontFamily: fonts.regular,
  },
});
