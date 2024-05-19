import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import InputAutoComplete from "./InputAutoComplete";
import { observer } from "mobx-react";
import { orderAcceptedStore } from "../MobX/OrderAccepted";

const AnimatedComponent = ({
  showAnimatedComponent,
  onPlaceSelected,
  traceRoute,
  destination,
  setShowCarTypes,
  setShowAnimatedComponent,
  setHeightComponent,
}) => {
  const translateY = new Animated.Value(0);

  const { setShowComponent } = orderAcceptedStore;

  const slideInUp = () => {
    Animated.timing(translateY, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideOutDown = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    if (showAnimatedComponent) {
      slideInUp();
    } else {
      slideOutDown();
    }
  }, [showAnimatedComponent]);

  const handlePlaceSelected = async (details) => {
    await onPlaceSelected(details, "destination");

    setHeightComponent(270);

    setShowAnimatedComponent(false);

    await traceRoute();

    setShowComponent(false);

    setShowCarTypes(true);
  };

  return (
    <>
      {showAnimatedComponent && (
        <Animated.View
          style={[
            styles.customComponentContainer,
            {
              transform: [
                {
                  translateY: translateY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.customComponent}>
            <TouchableOpacity onPress={() => setShowAnimatedComponent(false)}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <InputAutoComplete
              onPlaceSelected={(details) => handlePlaceSelected(details)}
              placeholder={"select your destination"}
              label={"Destination"}
              destination={destination}
            />
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default observer(AnimatedComponent);

const styles = StyleSheet.create({
  customComponentContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 200,
  },
  customComponent: {
    backgroundColor: "white",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
    flex: 1,
  },
});
