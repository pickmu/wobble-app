import { StyleSheet, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { fonts } from "../ReusableTools/css";
import LocationStore from "../MobX/LocationStore";

const InputAutoComplete = ({
  icon,
  label,
  placeholder,
  onPlaceSelected,
  onSearchError,
  value = "",
}) => {
  const { currentLocation } = LocationStore;

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
        onPress={(data, details) => onPlaceSelected(details)}
        onSearchError={onSearchError}
        query={{
          key: process.env.EXPO_PUBLIC_MAP_API_KEY,
          language: "en",
          components: "country:LB",
          location: `${currentLocation.latitude},${currentLocation.longitude}`,
          radius: 10000,
        }}
        fetchDetails={true}
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
