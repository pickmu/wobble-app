import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Map from "./Screens/UserScreens/Map";

export default function App() {
  return (
    <View style={styles.container}>
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
