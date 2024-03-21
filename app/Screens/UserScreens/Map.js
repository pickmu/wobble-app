import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { observer } from "mobx-react";
import { colors } from "../../ReusableTools/css";
import { Entypo } from "@expo/vector-icons";
import LocationStore from "../../MobX/LocationStore";
import MapViewDirections from "react-native-maps-directions";
import useFetch from "../../ReusableTools/UseFetch";
import AnimatedComponent from "../../Components/AnimatedComponent";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import DestinationContainer from "../../Components/DestinationContainer";
import CarTypes from "../../Components/CarTypes";
import SearchingForDriver from "../../Components/SearchingForDriver";
import axios from "axios";
import DriverData from "../../Components/DriverData";
import { authStore } from "../../MobX/AuthStore";
import { i18nStore } from "../../MobX/I18nStore";
import { orderAcceptedStore } from "../../MobX/OrderAccepted";

const { width, height } = Dimensions.get("window");

const Map = observer(() => {
  const {
    locationNotGranted,
    currentLocation,
    requestLocationPermissions,
    loading,
  } = LocationStore;

  const { userInfo } = authStore;

  const { i18n } = i18nStore;

  const { orderAccepted, setOrderAccepted, setShowComponent, showComponent } =
    orderAcceptedStore;

  const insets = useSafeAreaInsets();

  const animatedHeightComponent = useRef(new Animated.Value(height)).current;

  const navigation = useNavigation();

  const [destination, setDestination] = useState("");

  const [showDirections, setShowDirections] = useState(false);

  const [distance, setDistance] = useState(0);

  const [duration, setDuration] = useState(0);

  const [showAnimatedComponent, setShowAnimatedComponent] = useState(false);

  const [showCarTypes, setShowCarTypes] = useState(false);

  const [typeCar, setTypeCar] = useState("");

  const [nearbyDriver, setNearbyDriver] = useState();

  const [isOrderSending, setIsOrderSending] = useState(false);

  const [orderData, setOrderData] = useState();

  const [heightComponent, setHeightComponent] = useState(280);

  const { data, reFetch } = useFetch(
    `location/getLocationDriverByTypeCar/${typeCar}`
  );

  // useEffect(() => {
  //   reFetch();
  // }, [typeCar]);

  const { data: orderNotEnded } = useFetch(
    `order/getIsNotEndedOrder/${userInfo?._id}`
  );

  useEffect(() => {
    Animated.timing(animatedHeightComponent, {
      toValue: heightComponent,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [heightComponent]);

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

  useEffect(() => {
    requestLocationPermissions();

    if (!orderNotEnded.message === "All orders are ended") {
      setHeightComponent(380);
    }
  }, []);

  const fetchOrderStatus = async (orderId, currentDriverIndex = 0) => {
    const intervalId = setInterval(async () => {
      try {
        if (orderId) {
          const resp = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}order/getOrderById/${orderId}`
          );

          if (resp.data?.status === "Accepted") {
            clearInterval(intervalId);

            setOrderData(resp.data);

            setIsOrderSending(false);

            setHeightComponent(380);

            setOrderAccepted(true);
          } else if (nearbyDriver?.length >= currentDriverIndex) {
            // Order not accepted by the current driver, try sending to the next one
            const nextDriverIndex = currentDriverIndex + 1;
            const nextDriver = nearbyDriver[nextDriverIndex];

            if (nextDriver) {
              await axios.put(
                `${process.env.EXPO_PUBLIC_API_URL}order/updateOrder/${orderId}`,
                {
                  driver_id: nearbyDriver[1]?.driver_id?._id,
                }
              );
            }
          } else {
            clearInterval(intervalId);

            setIsOrderSending(false);

            setShowCarTypes(true);

            setHeightComponent(340);
          }
        }
      } catch (error) {
        console.log("fetchOrderStatus error", error.message);
      }
    }, 2000); // Check the status every 5 seconds (adjust the interval as needed)
  };

  // Loading state while waiting for location data
  if (loading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size={"large"} color={colors.primaryYellow} />
        <Text>{i18n.t("map.loadingMap")}</Text>
      </View>
    );
  }

  if (locationNotGranted) {
    // Handle the case where location permission is not granted
    return (
      <View style={styles.indicator}>
        <Text>{i18n.t("map.notGranted")}</Text>
      </View>
    );
  }

  if (!currentLocation) {
    // Handle the case where location data is not available
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size={"large"} color={colors.primary} />
        <Text>{i18n.t("map.fetchLocation")}</Text>
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
    setShowDirections(true);
    const userPickup = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    };

    {
      Platform.OS === "android" &&
        mapRef.current?.fitToCoordinates([userPickup, destination], {
          edgePadding,
        });
    }
  };

  const onPlaceSelected = async (details) => {
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
      name: details?.name,
    };

    setDestination(position);

    await moveTo(position);
  };

  const handleShowAutoComplete = () => {
    setShowAnimatedComponent(true);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, marginTop: insets.top }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={false}
      >
        <View style={styles.container}>
          <TouchableOpacity
            className="absolute top-[2%] left-[2%] z-10 bg-lightBlue p-3 rounded-full"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <View>
              <Entypo name="menu" size={24} color="black" />
            </View>
          </TouchableOpacity>

          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={INITIAL_POSITION}
            showsUserLocation={true}
            followsUserLocation={true}
            style={styles.map}
            ref={mapRef}
            mapType="standard"
          >
            {destination && (
              <Marker coordinate={destination}>
                <View className="bg-[#FAE90B] w-[35px] h-[35px] rounded-full z-10 justify-center items-center">
                  <Image
                    source={require("./../../Images/Icons/location.png")}
                    className="w-[20px] h-[20px] "
                    style={{ resizeMode: "contain" }}
                  />
                </View>
              </Marker>
            )}

            {showDirections && currentLocation && destination && (
              <MapViewDirections
                origin={INITIAL_POSITION}
                destination={destination}
                apikey={process.env.EXPO_PUBLIC_MAP_API_KEY}
                strokeColor={colors.primary}
                strokeWidth={8}
                onReady={traceRouteOnReady}
              />
            )}

            {orderAccepted && nearbyDriver?.length > 0 && (
              <Marker
                coordinate={{
                  latitude: parseFloat(nearbyDriver[0]?.lat),
                  longitude: parseFloat(nearbyDriver[0]?.long),
                }}
                title={`${nearbyDriver[0]?.driver_id?.first_name} ${nearbyDriver[0]?.driver_id?.last_name}`}
                description={`Distance: ${calculateDistance(
                  currentLocation?.latitude,
                  currentLocation?.longitude,
                  parseFloat(nearbyDriver[0]?.lat),
                  parseFloat(nearbyDriver[0]?.long)
                ).toFixed(2)} km`}
              >
                <View className="bg-Primary w-[35px] h-[35px] rounded-full z-10 justify-center items-center">
                  <Image
                    source={require("./../../Images/Icons/car.png")}
                    className="w-[30px] h-[30px]"
                    style={{ resizeMode: "contain", tintColor: "white" }}
                  />
                </View>
              </Marker>
            )}
          </MapView>

          <AnimatedComponent
            onPlaceSelected={onPlaceSelected}
            traceRoute={traceRoute}
            destination={destination}
            setShowCarTypes={setShowCarTypes}
            setShowComponent={setShowComponent}
            showAnimatedComponent={showAnimatedComponent}
            setShowAnimatedComponent={setShowAnimatedComponent}
            setHeightComponent={setHeightComponent}
          />

          <Animated.View
            style={[
              styles.destinationContainer,
              { height: animatedHeightComponent },
            ]}
          >
            {!orderNotEnded.message === "All orders are ended" ? (
              <DriverData
                driver_id={orderNotEnded.driver_id}
                user_id={orderNotEnded.user_id}
                _id={orderNotEnded._id}
                handleShowAutoComplete={handleShowAutoComplete}
                destination={{ name: orderNotEnded?.to }}
              />
            ) : (
              showComponent && (
                <DestinationContainer
                  handleShowAutoComplete={handleShowAutoComplete}
                  destination={destination}
                />
              )
            )}

            {showCarTypes && (
              <CarTypes
                setTypeCar={setTypeCar}
                typeCar={typeCar}
                nearbyDriver={nearbyDriver}
                destination={destination}
                currentLocation={currentLocation}
                setIsOrderSending={setIsOrderSending}
                setHeightComponent={setHeightComponent}
                setShowCarTypes={setShowCarTypes}
                fetchOrderStatus={fetchOrderStatus}
                reFetch={reFetch}
              />
            )}

            {isOrderSending && <SearchingForDriver />}

            {orderAccepted && (
              <DriverData
                {...orderData}
                handleShowAutoComplete={handleShowAutoComplete}
                destination={destination}
              />
            )}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
});

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: "100%",
    marginTop: 0,
    position: "relative",
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
  destinationContainer: {
    width: "100%",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    marginTop: "auto",
    backgroundColor: "white",
  },
});
