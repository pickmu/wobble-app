import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import LocationStore from "../../MobX/LocationStore";
import { observer } from "mobx-react";
import { colors } from "../../ReusableTools/css";
import InputAutoComplete from "../../Components/InputAutoComplete";
import { Entypo } from "@expo/vector-icons";

const Map = observer(() => {
  const {
    locationNotGranted,
    currentLocation,
    requestLocationPermissions,
    loading,
  } = LocationStore;

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  if (loading) {
    // Loading state while waiting for location data
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size={"large"} color={colors.primaryYellow} />
        <Text>Loading map...</Text>
      </View>
    );
  }

  if (locationNotGranted) {
    // Handle the case where location permission is not granted
    return (
      <View style={styles.indicator}>
        <Text>Location permission not granted</Text>
      </View>
    );
  }

  if (!currentLocation) {
    // Handle the case where location data is not available
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size={"large"} color={"black"} />
      </View>
    );
  }

  const inputAutoComplete = [
    {
      icon: <Entypo name="location-pin" size={15} color="white" />,
      label: "Pickup",
      placeholder: "Pick up location",
      onPlaceSelected: () => {},
    },
    {
      icon: <Entypo name="location" size={15} color="white" />,
      label: "Destination",
      placeholder: "Destination location",
      onPlaceSelected: () => {},
    },
  ];

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const INITIAL_POSITION = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const onSearchError = (error) => {
    console.log(error);
  };

  const onPlaceSelected = (place) => {
    console.log(place);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
        showsUserLocation={true}
        followsUserLocation={true}
        style={styles.map}
      ></MapView>
      <View style={styles.searchContainer}>
        {inputAutoComplete.map((input, index) => {
          return (
            <InputAutoComplete
              key={index}
              icon={input.icon}
              label={input.label}
              placeholder={input.placeholder}
              onPlaceSelected={input.onPlaceSelected}
            />
          );
        })}
      </View>
    </View>
  );
});

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: colors.primary,
    top: 0,
    padding: 8,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
});
