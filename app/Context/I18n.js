import { createContext, useEffect, useState } from "react";
import { translations } from "../Localization";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a context for managing internationalization
export const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [i18n, setI18n] = useState(null);
  const [locale, setLocale] = useState(null);

  useEffect(() => {
    // Load the initial locale when the component mounts
    const loadInitialLocale = async () => {
      // Read the stored language value from AsyncStorage
      const storedLang = await AsyncStorage.getItem("lang");

      // Create an instance of I18n with the translations
      const i18nInstance = new I18n(translations);

      if (storedLang) {
        // Use the stored language preference if available
        i18nInstance.locale = storedLang;
        setLocale(storedLang);
      } else {
        // Use the device's default locale if no preference is stored
        i18nInstance.locale = Localization.locale;
        setLocale(Localization.locale);
      }

      // Enable fallback language support
      i18nInstance.enableFallback = true;
      setI18n(i18nInstance);
    };

    loadInitialLocale();
  }, []);

  const changeLocale = async (locale) => {
    if (i18n) {
      i18n.locale = locale;
    }

    if (locale.includes("ar")) {
      await AsyncStorage.setItem("lang", "ar");
      if (I18nManager.isRTL === false) {
        await Updates.reloadAsync();
        // Enable right-to-left layout for Arabic
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
        // Reload the app to apply the layout changes
      }
    }
    if (locale.includes("en")) {
      await AsyncStorage.setItem("lang", "en");
      if (I18nManager.isRTL === true) {
        await Updates.reloadAsync();
        // Disable right-to-left layout for English
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
        // Reload the app to apply the layout changes
      }
    }

    setLocale(locale);
  };

  if (!i18n || !locale) {
    // If i18n or locale is not set yet, you can render a loading indicator or return null
    return null;
  }

  // Provide the i18n context to the component tree
  return (
    <I18nContext.Provider value={{ i18n, locale, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
};
