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

const AnimatedComponent = ({
  showAnimatedComponent,
  handleHideAutoComplete,
  onPlaceSelected,
  traceRoute,
  destination,
  setShowCarTypes,
  setShowAnimatedComponent,
  setShowComponent,
  setHeightComponent,
}) => {
  const translateY = new Animated.Value(0);

  const slideInUp = () => {
    Animated.timing(translateY, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const slideOutDown = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
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

    handleHideAutoComplete();

    setHeightComponent(0.5);

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
            <TouchableOpacity onPress={handleHideAutoComplete}>
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

export default AnimatedComponent;

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
