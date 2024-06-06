import { OneSignal } from "react-native-onesignal";

export const initializeOneSignal = (phone) => {
  OneSignal.Debug.setLogLevel(6);

  OneSignal.initialize(`${process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID}`);

  // Request permission for notifications
  OneSignal.Notifications.requestPermission(true);

  // Register notification event listener

  // Optionally, log in the user
  if (phone) {
    OneSignal.User.addTag("phone_number", String(phone));
  }
};

