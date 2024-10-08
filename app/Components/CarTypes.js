import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../ReusableTools/css";
import { Button } from "../ReusableTools/Button";
import { i18nStore } from "../MobX/I18nStore";
import { showToast } from "../ReusableTools/ShowToast";
import axios from "axios";
import { authStore } from "../MobX/AuthStore";

const CarTypes = ({
  setTypeCar,
  typeCar,
  nearbyDriver,
  destination,
  currentLocation,
  changeComponentHeight,
  setIsOrderSending,
  setShowCarTypes,
  fetchOrderStatus,
  reFetch,
}) => {
  const { i18n } = i18nStore;

  const { userInfo } = authStore;

  const [selectedCard, setSelectedCard] = useState(null);

  const [selectedType, setSelectedType] = useState("taxi");

  let city;

  const getGeolocation = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.latitude},${currentLocation.longitude}&key=${process.env.EXPO_PUBLIC_MAP_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch address. HTTP status ${response.status}`
        );
      }

      const responseJson = await response.json();

      city = JSON.stringify(
        responseJson.results[0].address_components[1].long_name
      );
    } catch (error) {
      console.error("Error fetching geolocation data:", error.message);
    }
  };

  const taxiTypes = [
    {
      price: "7",
      imagePath: require("../Images/Icons/car.png"),
      type: "Car",
      duration: "7",
    },
    {
      price: "7",
      imagePath: require("../Images/Icons/moto.png"),
      type: "Moto",
      duration: "7",
    },
    {
      price: "7",
      imagePath: require("../Images/Icons/335071.png"),
      type: "TukTuk",
      duration: "7",
    },
  ];

  // const deliveryTypes = [
  //   {
  //     price: "7",
  //     imagePath: require("../Images/Icons/bike.png"),
  //     type: "Bike",
  //     duration: "7",
  //   },
  //   {
  //     price: "7",
  //     imagePath: require("../Images/Icons/moto.png"),
  //     type: "Moto",
  //     duration: "7",
  //   },
  //   {
  //     price: "7",
  //     imagePath: require("../Images/Icons/335071.png"),
  //     type: "TukTuk",
  //     duration: "7",
  //   },
  // ];

  const handleCardPress = (index, type) => {
    setSelectedCard(index === selectedCard ? null : index);

    setTypeCar(type);
  };

  const handleSendOrder = async () => {
    if (typeCar === "") {
      showToast("error", "Please select a type");
      return;
    }

    changeComponentHeight(180);

    setShowCarTypes(false);

    setIsOrderSending(true);

    await reFetch();

    await getGeolocation();

    if (nearbyDriver?.length === 0) {
      Alert.alert(
        `Sorry`,
        `All the drivers are busy at the moment, try again later`,
        [
          {
            text: `${i18n.t("ok")}`,
            onPress: async () => {
              setIsOrderSending(false);

              setShowCarTypes(true);

              changeComponentHeight(230);
            },
          },
        ]
      );
      return;
    }

    const requestData = {
      user_id: userInfo?._id,
      driver_id: nearbyDriver[0]?.driver_id?._id,
      from: city,
      to: destination?.name,
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

      fetchOrderStatus(resp.data?._id);
    } catch (error) {
      console.log("handleSendOrder error", error.message);
    }
  };

  const carTypes = taxiTypes;

  return (
    <>
      <View className="flex-row justify-between pt-2 px-10">
        <TouchableOpacity onPress={() => setSelectedType("taxi")}>
          <Text style={selectedType === "taxi" && styles.selectedType}>
            Taxi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedType("delivery")}>
          <Text style={selectedType === "delivery" && styles.selectedType}>
            Delivery
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {selectedType === "taxi" &&
          carTypes.map((car, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                selectedCard === index && {
                  shadowColor: colors.yellow,
                  elevation: 10,
                },
              ]}
              onPress={() => handleCardPress(index, car.type)}
            >
              <View
                style={[
                  styles.checkContainer,
                  selectedCard === index && { backgroundColor: colors.yellow },
                ]}
              >
                {selectedCard === index && (
                  <Entypo name="check" size={10} color="black" />
                )}
              </View>

              <Image source={car.imagePath} style={styles.image} />

              <Text
                style={styles.title}
                className="text-[10px] my-2 font-regular"
              >
                Wobble {car.type}
              </Text>
            </TouchableOpacity>
          ))}

        {selectedType !== "taxi" && (
          <Text className="font-regular p-2 text-[18px] leading-7">
            {i18n.t("carTypes.deliveryText")}
          </Text>
        )}

        <Button
          text={i18n.t("map.letsGo")}
          cars={true}
          onPress={handleSendOrder}
        />
      </View>
    </>
  );
};

export default CarTypes;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  card: {
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
    backgroundColor: "white",
    elevation: 10,
    width: 100,
  },
  checkContainer: {
    width: 13,
    height: 13,
    backgroundColor: "white",
    borderRadius: 6.5,
    position: "absolute",
    top: 5,
    right: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  price: {
    fontWeight: "bold",
  },
  image: {
    width: 70,
    height: 40,
    resizeMode: "contain",
  },
  selectedType: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
});
