import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import LocationStore from "../../MobX/LocationStore";
import { observer } from "mobx-react";
import { colors } from "../../ReusableTools/css";
import InputAutoComplete from "../../Components/InputAutoComplete";
import { Entypo } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import Geocoder from "react-native-geocoding";

const Map = observer(() => {
  const {
    locationNotGranted,
    currentLocation,
    requestLocationPermissions,
    loading,
  } = LocationStore;

  const [pickup, setPickup] = useState("");

  const [pickupAddress, setPickupAddress] = useState(""); // State to store pickup address

  const [destination, setDestination] = useState("");

  const [showDirections, setShowDirections] = useState(false);

  const [distance, setDistance] = useState(0);

  const [duration, setDuration] = useState(0);

  const mapRef = useRef(MapView);

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        // Check if currentLocation exists
        if (!currentLocation) return;

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.latitude},${currentLocation.longitude}&key=${process.env.EXPO_PUBLIC_MAP_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch address. HTTP status ${response.status}`
          );
        }

        const responseJson = await response.json();
        console.log(
          "ADDRESS GEOCODE is BACK!! => ",
          JSON.stringify(
            responseJson.results[0].address_components[1].long_name
          )
        );
        const city = JSON.stringify(
          responseJson.results[0].address_components[1].long_name
        );
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    requestLocationPermissions();

    fetchAddress();
  }, [currentLocation]);

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
      onPlaceSelected: (details) => {
        onPlaceSelected(details, "pickup");
      },
    },
    {
      icon: <Entypo name="location" size={15} color="white" />,
      label: "Destination",
      placeholder: "Destination location",
      onPlaceSelected: async (details) => {
        onPlaceSelected(details, "destination");
        traceRoute();
      },
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

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  // Function to fetch the pickup address from latitude and longitude
  const fetchPickupAddress = async (latitude, longitude) => {
    try {
      const response = await Geocoder.from({ latitude, longitude });
      const address = response.results[0].formatted_address;
      setPickupAddress(address);
    } catch (error) {
      console.error("Error fetching pickup address:", error.message);
    }
  };

  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const traceRouteOnReady = (args) => {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const traceRoute = () => {
    if (pickup && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([pickup, destination], { edgePadding });
    }
  };

  const onPlaceSelected = (details, flag) => {
    const set = flag === "pickup" ? setPickup : setDestination;

    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };

    set(position);
    moveTo(position);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled={false}
    >
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={INITIAL_POSITION}
          showsUserLocation={true}
          followsUserLocation={true}
          style={styles.map}
          ref={mapRef}
        >
          {pickup && <Marker coordinate={pickup} />}
          {destination && <Marker coordinate={destination} />}
          {showDirections && pickup && destination && (
            <MapViewDirections
              origin={pickup}
              destination={destination}
              apikey={process.env.EXPO_PUBLIC_MAP_API_KEY}
              strokeColor={colors.primary}
              strokeWidth={4}
              onReady={traceRouteOnReady}
            />
          )}
        </MapView>
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
    </KeyboardAvoidingView>
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
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
    position: "absolute",
  },
});
