import { action, makeObservable, observable, runInAction } from "mobx";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthStore {
  userInfo = null;
  token = null;
  loading = false;

  constructor() {
    makeObservable(this, {
      userInfo: observable,
      token: observable,
      loading: observable,
      login: action.bound,
      isLoggedIn: action.bound,
      setLoading: action.bound,
      setUserInfo: action.bound,
      setUserToken: action.bound,
      logout: action.bound,
    });

    this.isLoggedIn();
  }

  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }

  setUserToken(token) {
    this.token = token;
  }

  setLoading(value) {
    this.loading = value;
  }

  async login(data) {
    try {
      this.setLoading(true);

      const resp = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}user/login`,
        data
      );

      this.setUserInfo(resp.data.findUser);

      this.setUserToken(resp.data.token);

      await AsyncStorage.setItem(
        "pickmUserInfo",
        JSON.stringify(resp.data.findUser)
      );

      await AsyncStorage.setItem("pickmuToken", resp.data.token);

      this.setLoading(false);
    } catch (error) {
      console.log("handel submit sign in error in the mobx store", error);
      Toast.show({
        type: "error",
        text1: error.message,
      });
      this.setLoading(false);
    }
  }

  async isLoggedIn() {
    this.setLoading(true);

    const userInfo = await AsyncStorage.getItem("pickmUserInfo");

    const token = await AsyncStorage.getItem("pickmuToken");

    runInAction(() => {
      this.setUserInfo(JSON.parse(userInfo));
      this.setUserToken(token);
    });

    this.setLoading(false);
  }

  async logout() {
    await AsyncStorage.removeItem("pickmUserInfo");

    await AsyncStorage.removeItem("pickmuToken");

    this.setUserInfo(null);

    this.setUserToken(null);
  }
}

export const authStore = new AuthStore();
