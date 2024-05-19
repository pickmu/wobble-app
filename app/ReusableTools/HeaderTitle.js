import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const HeaderTitle = ({ title, isDrawer, isChat, cancel }) => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  return (
    <View className="w-[50%]" style={{ paddingTop: insets.top }}>
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
        <MaterialIcons
          name="arrow-back-ios"
          size={30}
          color="black"
          style={{ marginStart: 12, marginBottom: 10 }}
        />
      </TouchableOpacity>

      <View
        className="bg-headers rounded-r-full py-5 items-center"
        style={{ width: cancel ? "150%" : "100%" }}
      >
        <Text
          className="font-bold"
          style={{ fontSize: title.length > 13 ? 22 : 25 }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({});
