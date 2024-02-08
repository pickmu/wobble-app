import { StyleSheet, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { fonts } from "../ReusableTools/css";
import LocationStore from "../MobX/LocationStore";
import { useEffect, useRef } from "react";

const InputAutoComplete = ({
  icon,
  label,
  placeholder,
  onPlaceSelected,
  onSearchError,
  destination,
}) => {
  const { currentLocation } = LocationStore;
  const ref = useRef();

  useEffect(() => {
    ref.current?.setAddressText(`${destination ? destination?.name : ""}`);
  }, [destination]);

  return (
    <>
      <View className="flex-row gap-1 items-center my-2">
        <Text>{icon}</Text>

        <Text className="font-regular">{label}</Text>
      </View>

      <GooglePlacesAutocomplete
        ref={ref}
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
        autoFillOnNotFound={true}
        predefinedPlacesAlwaysVisible={true}
        minLength={2}
        debounce={200}
        nearbyPlacesAPI="GooglePlacesSearch"
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
