import axios from "axios";
import { i18nStore } from "../../MobX/I18nStore";
import { authStore } from "../../MobX/AuthStore";

const { locale } = i18nStore;

const { userInfo } = authStore;

export const sendNotification = async () => {
  try {
    const requestData = {
      app_id: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID,
      headings: {
        en: ` Your Driver Has Arrived, ${userInfo.first_name}!`,
        ar: `!السائق ${userInfo.first_name} وصل`,
      },
      contents: {
        en: "Your driver is en route to your location. Please be ready to embark on your journey.",
        ar: "السائق في طريقه إلى موقعك. يرجى أن تكون جاهزًا للانطلاق في رحلتك.",
      },
      // "android_accent_color": "FF0000",
      filters: [
        {
          field: "tag",
          key: "phone_number",
          relation: "=",
          value: `${userInfo.phone_number}`,
        },
      ],
      // "include_subscription_ids": [
      //     "91c1222b-dffa-433a-95d2-86c5dccb9bff"
      // ],
      isAnyWeb: true,
      isIos: true,
      isAndroid: true,
      //  "small_icon": "ic_stat_onesignal_default",
      //   large_icon: "",
      //   // "big_picture": "",
      //   ios_attachments: {
      //     id1: "",
      //   },
      data: {
        // "action": "question",
        // "action_id": "1004755"
      },
    };

    await axios.post(
      "https://onesignal.com/api/v1/notifications",
      requestData,
      {
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_ONESIGNAL_TOKEN}`,
        },
      }
    );
  } catch (error) {
    console.log("Error sending notification", error.message);
  }
};
