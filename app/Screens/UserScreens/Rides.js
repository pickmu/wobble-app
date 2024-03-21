import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { useState } from "react";
import { i18nStore } from "../../MobX/I18nStore";
import { authStore } from "../../MobX/AuthStore";
import { colors } from "../../ReusableTools/css";
import TripCard from "../../Components/TripCard";
import useFetch from "../../ReusableTools/UseFetch";

const Rides = () => {
  const { i18n } = i18nStore;

  const { userInfo } = authStore;

  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, reFetch } = useFetch(
    `order/getOrdersByUser/${userInfo?._id}`
  );

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
          {`${i18n.t("rides.noRides")}`}
        </Text>
      </View>
    );

  // refresh funtion
  const handleRefresh = () => {
    setRefreshing(true);
    reFetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    return <TripCard {...item} />;
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

export default Rides;
