import { Entypo } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { initializeOneSignal } from "../../../InitializeOneSignal";
import AnimatedComponent from "../../Components/AnimatedComponent";
import CarTypes from "../../Components/CarTypes";
import DestinationContainer from "../../Components/DestinationContainer";
import DriverData from "../../Components/DriverData";
import SearchingForDriver from "../../Components/SearchingForDriver";
import { authStore } from "../../MobX/AuthStore";
import { i18nStore } from "../../MobX/I18nStore";
import LocationStore from "../../MobX/LocationStore";
import { orderAcceptedStore } from "../../MobX/OrderAcceptedStore";
import { hasArrived } from "../../ReusableTools/Functions/Haversine";
import { sendNotification } from "../../ReusableTools/Functions/SendNotification";
import useFetch from "../../ReusableTools/UseFetch";
import { colors } from "../../ReusableTools/css";

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

  const {
    orderAccepted,
    setOrderAccepted,
    setShowComponent,
    showComponent,
    orderCanceled,
    setDriverDistance,
    setDriverDuration,
    setOrderCanceled,
  } = orderAcceptedStore;

  const insets = useSafeAreaInsets();

  const animatedHeightComponent = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const [destination, setDestination] = useState("");

  const [showDirections, setShowDirections] = useState(false);

  const [notificationSent, setNotificationSent] = useState(false);

  const [distance, setDistance] = useState(0);

  const [duration, setDuration] = useState(0);

  const [showAnimatedComponent, setShowAnimatedComponent] = useState(false);

  const [showCarTypes, setShowCarTypes] = useState(false);

  const [typeCar, setTypeCar] = useState("");

  const [nearbyDriver, setNearbyDriver] = useState();

  const [isOrderSending, setIsOrderSending] = useState(false);

  const [orderData, setOrderData] = useState();

  const [itsNotEnted, setIsNotEnded] = useState(false);

  const [driverLocation, setDriverLocation] = useState({
    lat: "",
    long: "",
  });

  let liveLoactionInterval = useRef(null);

  let intervalId = useRef(null);

  const { data, reFetch } = useFetch(
    `location/getLocationDriverByTypeCar/${typeCar}`
  );

  const { data: orderNotEnded } = useFetch(
    `order/getUserIsNotEndedOrder/${userInfo?._id}`
  );

  const changeComponentHeight = (height) => {
    Animated.timing(animatedHeightComponent, {
      toValue: height,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

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
    requestLocationPermissions().then(() => {
      userInfo && initializeOneSignal(userInfo?.phone_number);
    });

    if (showComponent) {
      changeComponentHeight(250);
    }
  }, []);

  useEffect(() => {
    if (
      hasArrived(
        driverLocation?.lat,
        driverLocation?.long,
        currentLocation?.lat,
        currentLocation?.long,
        0.1
      )
    ) {
      if (notificationSent) return;

      sendNotification();

      setNotificationSent(true);
    }
  }, [driverLocation, currentLocation]);

  useEffect(() => {
    const checkOrder = async () => {
      if (orderCanceled === true) {
        setShowDirections(false);

        setOrderData("");

        setIsNotEnded(false);

        setOrderAccepted(false);

        setDestination("");

        setShowComponent(true);

        setDriverLocation("");

        changeComponentHeight(250);

        clearInterval(liveLoactionInterval.current);
      } else if (orderNotEnded?.is_ended == false) {
        setIsNotEnded(true);

        setShowComponent(false);

        changeComponentHeight(360);

        setDestination({
          latitude: orderNotEnded?.toCoordinates.lat || 0,
          longitude: orderNotEnded?.toCoordinates.long || 0,
          name: orderNotEnded?.to,
        });

        setShowDirections(true);

        setOrderData(orderNotEnded);

        clearInterval(intervalId?.current);

        // Set up interval to fetch location every 2 seconds
        liveLoactionInterval.current = setInterval(() => {
          DriverLiveLocation(orderNotEnded?.driver_id?._id);
        }, 2000);
      }
    };

    checkOrder();
  }, [orderNotEnded, orderCanceled]);

  const DriverLiveLocation = async (id) => {
    try {
      const resp = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}location/getLocationDriver/${id}`
      );

      setDriverLocation({
        lat: resp.data?.lat,
        long: resp.data?.long,
      });
    } catch (error) {
      console.log("DriverLiveLocation error", error.message);
    }
  };

  const fetchOrderStatus = async (orderId, currentDriverIndex = 0) => {
    intervalId.current = setInterval(async () => {
      try {
        if (orderId) {
          const resp = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}order/getOrderById/${orderId}`
          );

          if (resp.data?.status === "Accepted") {
            clearInterval(intervalId.current);

            setOrderData(resp.data);

            setIsOrderSending(false);

            changeComponentHeight(360);

            setOrderAccepted(true);

            setDriverLocation({
              lat: nearbyDriver[0].lat,
              long: nearbyDriver[0].long,
            });

            // Set up interval to fetch location every 2 seconds
            liveLoactionInterval.current = setInterval(() => {
              DriverLiveLocation(resp.data?.driver_id?._id);
            }, 2000);

            // Clear interval on component unmount
            return () => {
              if (liveLoactionInterval.current) {
                clearInterval(liveLoactionInterval.current);
              }
            };
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
            clearInterval(intervalId.current);

            setIsOrderSending(false);

            setShowCarTypes(true);

            changeComponentHeight(340);
          }
        }
      } catch (error) {
        console.log("fetchOrderStatus error", error.message);
      }
    }, 2000); // Check the status every 5 seconds (adjust the interval as needed)
  };

  const driverCancelRide = async () => {
    try {
      const resp = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}order/getOrderById/${orderData?._id}`
      );

      if (resp.data.is_ended === true) {
        setOrderCanceled(true);
      }
    } catch (error) {
      console.log("driverCancelRide error", error.message);
    }
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
    latitude: currentLocation?.latitude,
    longitude: currentLocation?.longitude,
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

  const traceRouteOnReadyForDriver = (args) => {
    if (args) {
      setDriverDistance(args.distance);

      setDriverDuration(args.duration);
    }
  };

  const traceRoute = () => {
    setShowDirections(true);
    const userPickup = {
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
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

  const DRIVER_POSITION = {
    latitude: driverLocation?.lat,
    longitude: driverLocation?.long,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
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

            {showDirections && currentLocation && destination && orderData && (
              <MapViewDirections
                origin={DRIVER_POSITION}
                destination={INITIAL_POSITION}
                apikey={process.env.EXPO_PUBLIC_MAP_API_KEY}
                onReady={traceRouteOnReadyForDriver}
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
            changeComponentHeight={changeComponentHeight}
          />

          <Animated.View
            style={[
              styles.destinationContainer,
              { height: animatedHeightComponent },
            ]}
          >
            {itsNotEnted ? (
              <DriverData
                driver_id={orderNotEnded.driver_id}
                user_id={orderNotEnded.user_id}
                _id={orderNotEnded._id}
                handleShowAutoComplete={handleShowAutoComplete}
                destination={{ name: orderNotEnded?.to }}
                setDestination={setDestination}
              />
            ) : (
              orderAccepted && (
                <DriverData
                  {...orderData}
                  handleShowAutoComplete={handleShowAutoComplete}
                  destination={destination}
                />
              )
            )}

            {showComponent && (
              <DestinationContainer
                handleShowAutoComplete={handleShowAutoComplete}
                destination={destination}
              />
            )}

            {showCarTypes && (
              <CarTypes
                setTypeCar={setTypeCar}
                typeCar={typeCar}
                nearbyDriver={nearbyDriver}
                destination={destination}
                currentLocation={currentLocation}
                setIsOrderSending={setIsOrderSending}
                changeComponentHeight={changeComponentHeight}
                setShowCarTypes={setShowCarTypes}
                fetchOrderStatus={fetchOrderStatus}
                reFetch={reFetch}
              />
            )}

            {isOrderSending && <SearchingForDriver />}
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
