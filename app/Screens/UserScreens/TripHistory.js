import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import TripCard from "../../Components/TripCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { i18nStore } from "../../MobX/I18nStore";
import { authStore } from "../../MobX/AuthStore";

const TripHistory = () => {
    const { i18n } = i18nStore;
    const [dataHistory, setDataHistory] = useState(null);

    useEffect(() => {
        axios
            .get(`${process.env.EXPO_PUBLIC_API_URL}userInfo/tripHistory/${authStore.userInfo._id}`)
            .then((response) => {
                setDataHistory(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    if (!dataHistory) return <Text> Lodinggg </Text>;
    if (dataHistory.length == 0) return <Text className="w-full p-5 text-gray-500 text-center text-l"> No History Yet </Text>
    return (
        <View>
            <Text className="px-5 py-3 text-3xl font-bold"> {`${i18n.t("tripHistory.title")}`} </Text>
            <ScrollView className=" w-full p-5 h-full">
                {dataHistory.map((history, index) => (
                    <TripCard key={index} {...history} />
                ))}
            </ScrollView>
        </View>
    );
};

export default TripHistory;
