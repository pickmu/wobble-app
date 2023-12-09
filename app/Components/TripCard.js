import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import Car from "../Images/car.png";
import Bus from "../Images/bus.png";
import Moto from "../Images/moto.png";
import Bicycle from "../Images/bicycle.png";

const TripCard = ({ from, to, status, typeOfOrder, createdAt }) => {
    const checkType = () => {
        if (typeOfOrder === "Car") {
            return Car;
        }
        if (
            typeOfOrder === "Bus" ||
            typeOfOrder === "2x Bus" ||
            typeOfOrder === "3x Bus"
        ) {
            return Bus;
        }
        if (typeOfOrder === "Motorcycle") {
            return Moto;
        }
        if (typeOfOrder === "Bicycle") {
            return Bicycle;
        }
    };

    const originalDateString = createdAt;
    const originalDate = new Date(originalDateString);

    const formattedDate = originalDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const formattedTime = originalDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const result = `${formattedDate} ${formattedTime}`;

    return (
        <View className="w100 h-16  border-b-[1px] border-gray-300 flex flex-row items-center mb-5">
            <View className="w-1/6 p-2 ">
                <View className="bg-slate-200 w-12 h-12 rounded-full flex justify-center items-center ">
                    <Image source={checkType()} className="w-10 h-10" />
                </View>
            </View>
            <View className="w-3/6 p-2 ">
                <Text
                    className="text-[15px] mb-1 w-full "
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {from} to {to}
                </Text>
                <Text className="text-[12px] text-gray-500">{result}</Text>
            </View>
            <View className="flex flex-col items-center justify-end w-2/6 ">
                {/* <Text className="font-bold text-xl">{total} LL</Text> */}
                {status && (
                    <Text className="text-[12px] text-red-500">
                        Ride Canceled
                    </Text>
                )}
                {!status && (
                    <Text className="text-[12px] text-green-500">
                        Ride Completed
                    </Text>
                )}
            </View>
        </View>
    );
};

export default TripCard;
