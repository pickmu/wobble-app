import { action, makeObservable, observable, runInAction } from "mobx";
import * as Location from "expo-location";
import { Platform } from "react-native";

class LocationStore {
  locationNotGranted = false;
  currentLocation = null;
  loading = false;

  constructor() {
    makeObservable(this, {
      locationNotGranted: observable,
      currentLocation: observable,
      setLocationNotGranted: action.bound,
      setLoading: action.bound,
      setLocation: action.bound,
      requestLocationPermissions: action.bound, // .bound to automatically bind this
    });
  }

  setLocationNotGranted(value) {
    this.locationNotGranted = value;
  }

  setLocation(location) {
    this.currentLocation = location;
  }

  async requestLocationPermissions() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      this.setLocationNotGranted(true);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        this.setLocationNotGranted(false);
      }
      console.log("Location permission not granted");
      return;
    }

    let currentLocation;
    if (Platform.OS === "android") {
      currentLocation = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.BestForNavigation,
      });
    } else {
      currentLocation = await Location.getLastKnownPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.BestForNavigation,
      });
    }

    runInAction(() => {
      this.setLocation(currentLocation?.coords);
    });

    this.setLoading(false);
  }

  setLoading(value) {
    this.loading = value;
  }
}

export default new LocationStore();
