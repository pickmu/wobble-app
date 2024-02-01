import { Image, Text, TouchableOpacity, View } from "react-native";

const DestinationContainer = ({ handleShowAutoComplete, destination }) => {
  return (
    <View className="bg-[#9EC4F7] py-4 pl-4 self-center rounded-[25px] mt-6 mx-5">
      <View className="flex-row items-center gap-4">
        <Image
          source={require("../Images/Icons/currentLocation.png")}
          className="w-[20px] h-[20px] pl-6"
          style={{ resizeMode: "contain" }}
        />

        <Text className="text-[#4048A2] text-[19px] flex-1">
          Current Location
        </Text>
      </View>

      <View className="border-l-2 border-dashed border-white ml-3">
        <View className="border-b-[1px] border-white w-[90%] self-end my-4 border-l-2" />
      </View>

      <View className="flex-row items-center gap-4">
        <Image
          source={require("../Images/Icons/location.png")}
          className="w-[20px] h-[20px] pl-6"
          style={{ resizeMode: "contain" }}
        />

        <TouchableOpacity
          onPress={handleShowAutoComplete}
          style={{ width: "80%" }}
        >
          <Text className="text-white text-[19px]">
            {destination ? `${destination?.name}` : "Select destination"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DestinationContainer;
