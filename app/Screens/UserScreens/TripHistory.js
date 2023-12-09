import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import TripCard from "../../Components/TripCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { i18nStore } from "../../MobX/I18nStore";
import { authStore } from "../../MobX/AuthStore";
import { colors } from "../../ReusableTools/css";

const TripHistory = () => {
  const { i18n } = i18nStore;
  const { userInfo } = authStore;
  const [dataHistory, setDataHistory] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.EXPO_PUBLIC_API_URL}userInfo/tripHistory/${userInfo._id}`
      )
      .then((response) => {
        setDataHistory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!dataHistory)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={colors.primary} />
      </View>
    );

  if (dataHistory.length == 0)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-regular p-5 text-gray-500 text-base">
          {`${i18n.t("tripHistory.noTrips")}`}
        </Text>
      </View>
    );

  return (
    <View>
      <Text className="px-5 py-3 text-3xl font-boldText">
        {`${i18n.t("tripHistory.title")}`}
      </Text>
      <ScrollView className=" w-full p-5 h-full">
        {dataHistory.map((history, index) => (
          <TripCard key={index} {...history} />
        ))}
      </ScrollView>
    </View>
  );
};

export default TripHistory;
