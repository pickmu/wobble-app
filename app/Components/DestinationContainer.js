import { Image, Text, TouchableOpacity, View } from "react-native";

const DestinationContainer = ({
  handleShowAutoComplete,
  destination,
  driverData,
}) => {
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
          Current Location
        </Text>
      </View>

      <View className="border-l-2 border-dashed border-white ml-3">
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
        >
          <Text
            className={`text-white`}
            style={{ fontSize: driverData ? 15 : 19 }}
          >
            {destination ? `${destination?.name}` : "Select destination"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DestinationContainer;
