import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const HeaderTitle = ({ title, isDrawer, isChat, cancel }) => {
  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView />
      <View className="w-[50%]">
        <TouchableOpacity
          onPress={
            () =>
              isChat
                ? navigation.navigate("Map") // Navigate to the Home screen if isChat is true
                : isDrawer
                ? navigation.dispatch(DrawerActions.openDrawer())
                : navigation.goBack() // Otherwise, go back
          }
        >
          <Image
            source={require("../Images/Icons/arrow.png")}
            className="w-[50px] h-[20px] mb-3 self-center"
          />
        </TouchableOpacity>

        <View
          className="bg-headers rounded-r-full py-5 items-center"
          style={{ width: cancel ? "150%" : "100%" }}
        >
          <Text className="text-[25px] font-bold">{title}</Text>
        </View>
      </View>
    </>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({});
