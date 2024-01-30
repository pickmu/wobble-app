import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../ReusableTools/css";
import { Button } from "../ReusableTools/Button";

const CarTypes = ({ setTypeCar }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const carTypes = [
    {
      price: "7",
      imagePath: require("../Images/Icons/car.png"),
      type: "Car",
      duration: "7",
    },
    {
      price: "7",
      imagePath: require("../Images/Icons/luxurycar.png"),
      type: "Comfort",
      duration: "7",
    },
    {
      price: "7",
      imagePath: require("../Images/Icons/bus.png"),
      type: "Van",
      duration: "7",
    },
    {
      price: "7",
      imagePath: require("../Images/Icons/bus.png"),
      type: "Bus",
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
    {
      price: "7",
      imagePath: require("../Images/Icons/335071.png"),
      type: "Bike",
      duration: "7",
    },
  ];

  const handleCardPress = (index) => {
    setSelectedCard(index === selectedCard ? null : index);
  };

  return (
    <View style={styles.container}>
      {carTypes.map((car, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.card,
            selectedCard === index && {
              shadowColor: colors.yellow,
              elevation: 10,
            },
          ]}
          onPress={() => handleCardPress(index)}
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

          <Text style={styles.price}>${car.price}</Text>

          <Image source={car.imagePath} style={styles.image} />

          <Text style={styles.title} className="text-[10px] font-regular">
            Wobble {car.type}
          </Text>
          <Text>{car.duration} min</Text>
        </TouchableOpacity>
      ))}

      <Button text={"Let's go"} cars={true} />
    </View>
  );
};

export default CarTypes;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
});
