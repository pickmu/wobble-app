import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { i18nStore } from "../../MobX/I18nStore";

const Support = () => {
  const { i18n } = i18nStore;

  return (
    <View className="p-2">
      <Text className="font-regular text-[20px] underline">
        {i18n.t("support.contact")}
      </Text>

      <Text className="font-regular text-[20px]">
        {i18n.t("support.phone")} 81076935
      </Text>

      <Text className="font-regular text-[20px]">
        {i18n.t("support.insta")}
      </Text>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({});
