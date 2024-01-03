import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { authStore } from "../../MobX/AuthStore";
import { observer } from "mobx-react";
import { colors } from "../../ReusableTools/css";
import { Entypo } from "@expo/vector-icons";
import LocationStore from "../../MobX/LocationStore";
import InputAutoComplete from "../../Components/InputAutoComplete";
import MapViewDirections from "react-native-maps-directions";
import useFetch from "../../ReusableTools/UseFetch";
import axios from "axios";
import AnimatedComponent from "../../Components/AnimatedComponent";

const Map = observer(() => {
  const {
    locationNotGranted,
    currentLocation,
    requestLocationPermissions,
    loading,
  } = LocationStore;

  const { userInfo } = authStore;

  const [destination, setDestination] = useState("");

  const [showDirections, setShowDirections] = useState(false);

  const [isOrdered, setIsOrdered] = useState(false);

  const [distance, setDistance] = useState(0);

  const [duration, setDuration] = useState(0);

  const [animateOut, setAnimateOut] = useState(false);

  const [showComponent, setShowCustomComponent] = useState(false);

  const [typeCar, setTypeCar] = useState("Bicycle");

  const [nearbyDriver, setNearbyDriver] = useState([]);

  const [isOrderSending, setIsOrderSending] = useState(false);

  const { data, isLoading } = useFetch(
    `location/getLocationDriverByTypeCar/${typeCar}`
  );

  useEffect(() => {
    if (currentLocation) {
      // Filter nearby stadiums based on maximum distance (in kilometers)
      const maxDistance = 15;
      const nearbyDrivers = data.filter((driver) => {
        const lat = driver?.lat;
        const lon = driver?.long;
        const driverLatitude = parseFloat(lat);
        const driverLongitude = parseFloat(lon);
        const distance = calculateDistance(
          currentLocation?.latitude,
          currentLocation?.longitude,
          driverLatitude,
          driverLongitude
        );
        return distance <= maxDistance;
      });

      // Sort the nearby stadiums based on distance
      nearbyDrivers.sort((a, b) => {
        const latitudeA = a?.lat;
        const longitudeA = a?.long;

        const latitudeB = b?.lat;
        const longitudeB = b?.long;

        const distanceA = calculateDistance(
          currentLocation?.latitude,
          currentLocation?.longitude,
          latitudeA,
          longitudeA
        );
        const distanceB = calculateDistance(
          currentLocation?.latitude,
          currentLocation?.longitude,
          latitudeB,
          longitudeB
        );

        return distanceA - distanceB;
      });

      setNearbyDriver(nearbyDrivers);
    }
  }, [currentLocation, data]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude values from degrees to radians
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const degToRad = (degrees) => {
    return degrees * (Math.PI / 180);
  };

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

  const handleSendOrder = async () => {
    const requestData = {
      user_id: userInfo?._id,
      driver_id: nearbyDriver[0]?._id,
      from: "Tripoli",
      to: destination?.geoLoacation,
      typeOfOrder: typeCar,
      fromCoordinates: {
        long: currentLocation?.longitude,
        lat: currentLocation?.latitude,
      },
      toCoordinates: {
        long: destination?.longitude,
        lat: destination?.latitude,
      },
    };
    try {
      const resp = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}order/addOrder`,
        requestData
      );

      setIsOrderSending(true);
      console.log(resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const traceRouteOnReady = (args) => {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const traceRoute = () => {
    setShowDirections(true);
    const userPickup = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    };
    console.log("userPickup", userPickup);
    console.log("destination", destination);
    mapRef.current?.fitToCoordinates([userPickup, destination], {
      edgePadding,
    });
  };

  const handleOpenCarTypes = () => {
    setShowCustomComponent(true);
    setAnimateOut(false);
  };

  const onPlaceSelected = async (details, flag) => {
    const set = flag === "destination" && setDestination;
    console.log(details);
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
      // geoLoacation: details?.geometry.location,
    };

    await set(position);
    await moveTo(position);
    handleOpenCarTypes();
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
          {nearbyDriver.length > 0 && (
            <Marker
              coordinate={{
                latitude: parseFloat(nearbyDriver[0]?.lat),
                longitude: parseFloat(nearbyDriver[0]?.long),
              }}
              title="First Nearby Driver"
              description={`Distance: ${calculateDistance(
                currentLocation?.latitude,
                currentLocation?.longitude,
                parseFloat(nearbyDriver[0]?.lat),
                parseFloat(nearbyDriver[0]?.long)
              ).toFixed(2)} km`}
            />
          )}
        </MapView>
        {!isOrdered && (
          <View style={styles.searchContainer}>
            <InputAutoComplete
              icon={<Entypo name="location" size={15} color="white" />}
              label="Destination"
              placeholder="Destination location"
              onPlaceSelected={async (details) => {
                await onPlaceSelected(details, "destination");
                traceRoute();
              }}
            />
          </View>
        )}
        {/* <AnimatedComponent
          animateOut={animateOut}
          showComponent={showComponent}
        /> */}
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
    marginTop: 0,
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
