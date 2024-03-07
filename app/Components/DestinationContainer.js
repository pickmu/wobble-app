import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { i18nStore } from "../MobX/I18nStore";

const DestinationContainer = ({
  handleShowAutoComplete,
  destination,
  driverData,
  isOrder,
}) => {
  const { i18n } = i18nStore;

  return (
    <View className="bg-[#9EC4F7] py-4 pl-4 self-center rounded-[25px] mt-6 mx-5">
      <View className="flex-row items-center gap-4">
        <Image
          source={require("../Images/Icons/currentLocation.png")}
          className={`pl-6`}
          style={{
            resizeMode: "contain",
            width: driverData ? 15 : 20,
            height: driverData ? 15 : 20,
          }}
        />

        <Text
          className={`text-[#4048A2] flex-1`}
          style={{ fontSize: driverData ? 15 : 19 }}
        >
          {i18n.t("destinationContainer.currentLocation")}
        </Text>
      </View>

      <View className="border-l-2 ml-3" style={styles.dashedBorder}>
        <View className="border-b-[1px] border-white w-[90%] self-end my-4 border-l-2" />
      </View>

      <View className="flex-row items-center gap-4">
        <Image
          source={require("../Images/Icons/location.png")}
          className={`pl-6`}
          style={{
            resizeMode: "contain",
            width: driverData ? 15 : 20,
            height: driverData ? 15 : 20,
          }}
        />

        <TouchableOpacity
          onPress={handleShowAutoComplete}
          style={{ width: "80%" }}
          disabled={isOrder}
        >
          <Text
            className={`text-white`}
            style={{ fontSize: driverData ? 15 : 19 }}
          >
            {destination ? `${destination?.name}` : `${i18n.t("destinationContainer.destination")}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DestinationContainer;

const styles = StyleSheet.create({
  dashedBorder: {
    borderStyle: Platform.OS === "android" ? "dashed" : "solid",
    borderColor: "white",
  },
});
