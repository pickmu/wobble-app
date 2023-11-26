import { makeObservable, observable, action } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { I18nManager } from "react-native";
import { I18n } from "i18n-js";
import * as Updates from "expo-updates";
import { translations } from "../Localization.js";

class I18nStore {
  i18n = null;
  locale = null;

  constructor() {
    makeObservable(this, {
      i18n: observable,
      locale: observable,
      loadInitialLocale: action.bound,
      changeLocale: action.bound,
    });

    this.loadInitialLocale();
  }

  async loadInitialLocale() {
    const storedLang = await AsyncStorage.getItem("pickmuLang");
    const i18nInstance = new I18n(translations);

    if (storedLang) {
      i18nInstance.locale = storedLang;
      this.locale = storedLang;
    } else {
      i18nInstance.locale = Localization.locale;
      this.locale = Localization.locale;
    }

    i18nInstance.enableFallback = true;
    this.i18n = i18nInstance;
  }

  async changeLocale(locale) {
    if (this.i18n) {
      this.i18n.locale = locale;
    }

    if (locale.includes("ar")) {
      await AsyncStorage.setItem("pickmuLang", "ar");
      if (I18nManager.isRTL === false) {
        Updates.reloadAsync();
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      }
    }
    if (locale.includes("en")) {
      await AsyncStorage.setItem("pickmuLang", "en");
      if (I18nManager.isRTL === true) {
        Updates.reloadAsync();
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
      }
    }

    this.locale = locale;
  }
}

export const i18nStore = new I18nStore();
