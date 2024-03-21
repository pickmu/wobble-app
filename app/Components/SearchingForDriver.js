import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { colors } from "../ReusableTools/css";
import { observer } from "mobx-react";
import { i18nStore } from "../MobX/I18nStore";

const SearchingForDriver = () => {
  const { i18n } = i18nStore;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={"large"} color={colors.primary} />

      <Text className="font-regular">{i18n.t("lookingADriver")}</Text>
    </View>
  );
};

export default observer(SearchingForDriver);
