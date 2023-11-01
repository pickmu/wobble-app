import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import MapView from "react-native-maps";
import LocationStore from "../../MobX/LocationStore";
import { observer } from "mobx-react";

const Map = observer(() => {
  const {
    locationNotGranted,
    currentLocation,
    requestLocationPermissions,
    loading,
  } = LocationStore;

  
  useEffect(() => {
    requestLocationPermissions();
  }, []);

  if (loading) {
    // Loading state while waiting for location data
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (locationNotGranted) {
    // Handle the case where location permission is not granted
    return (
      <View style={styles.indicator}>
        <Text>Location permission not granted</Text>
      </View>
    );
  }

  if (!currentLocation) {
    // Handle the case where location data is not available
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size={"large"} color={"black"} />
      </View>
    );
  }

  return (
    <MapView
      initialRegion={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      }}
      showsUserLocation={true}
      followsUserLocation={true}
      className="flex-1"
    ></MapView>
  );
});

export default Map;

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
