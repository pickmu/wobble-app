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
import AnimatedComponent from "../../Components/AnimatedComponent";

const Map = observer(() => {
  const {
    locationNotGranted,
    currentLocation,
    requestLocationPermissions,
    loading,
  } = LocationStore;

  const [destination, setDestination] = useState("");

  const [showDirections, setShowDirections] = useState(false);

  const [distance, setDistance] = useState(0);

  const [duration, setDuration] = useState(0);

  const [animateOut, setAnimateOut] = useState(false);

  const [showComponent, setShowCustomComponent] = useState(false);

  const mapRef = useRef(MapView);

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
        <ActivityIndicator size={"large"} color={colors.primary} />
      </View>
    );
  }

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
    if (currentLocation && destination) {
      setShowDirections(true);
      const userPickup = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
      mapRef.current?.fitToCoordinates([userPickup, destination], {
        edgePadding,
      });
    }
  };

  const onPlaceSelected = async (details, flag) => {
    const set = flag === "destination" && setDestination;

    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };

    set(position);
    await moveTo(position);
    handleOpenCarTypes();
  };

  const handleOpenCarTypes = () => {
    setShowCustomComponent(true);
    setAnimateOut(false);
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
          {destination && <Marker coordinate={INITIAL_POSITION} />}
          {destination && <Marker coordinate={destination} />}
          {showDirections && currentLocation && destination && (
            <MapViewDirections
              origin={INITIAL_POSITION}
              destination={destination}
              apikey={process.env.EXPO_PUBLIC_MAP_API_KEY}
              strokeColor={colors.primary}
              strokeWidth={4}
              onReady={traceRouteOnReady}
            />
          )}
        </MapView>
        <View style={styles.searchContainer}>
          <InputAutoComplete
            icon={<Entypo name="location" size={15} color="white" />}
            label="Destination"
            placeholder="Destination location"
            onPlaceSelected={(details) => {
              onPlaceSelected(details, "destination");
              traceRoute();
            }}
          />
        </View>
        <AnimatedComponent
          animateOut={animateOut}
          showComponent={showComponent}
        />
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
