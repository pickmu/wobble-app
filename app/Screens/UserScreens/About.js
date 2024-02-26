import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { i18nStore } from "../../MobX/I18nStore";

const About = () => {
  const { i18n } = i18nStore;
  return (
    <View className="p-2">
      <Text className="font-regular text-[20px]" style={styles.text}>
        {i18n.t("about")}
      </Text>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  text: {
    lineHeight: 30,
  },
});
