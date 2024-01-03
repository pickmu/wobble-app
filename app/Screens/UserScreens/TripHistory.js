import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { i18nStore } from "../../MobX/I18nStore";
import { authStore } from "../../MobX/AuthStore";
import { colors } from "../../ReusableTools/css";
import TripCard from "../../Components/TripCard";
import useFetch from "../../ReusableTools/UseFetch";

const TripHistory = () => {
  const { i18n } = i18nStore;

  const { userInfo } = authStore;

  const { data, isLoading } = useFetch(`userInfo/tripHistory/${userInfo?._id}`);

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={colors.primary} />
      </View>
    );

  if (data.length == 0)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-regular p-5 text-gray-500 text-base">
          {`${i18n.t("tripHistory.noTrips")}`}
        </Text>
      </View>
    );

  const renderItem = ({ item }) => {
    return <TripCard {...item} />;
  };

  return (
    <View>
      <Text className="px-5 py-3 text-3xl font-boldText">
        {`${i18n.t("tripHistory.title")}`}
      </Text>

      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};

export default TripHistory;
