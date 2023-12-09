import { View, Text, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

const AnimatedComponent = ({ animateOut, showComponent }) => {
  return (
    <>
      {showComponent && (
        <Animatable.View
          animation={animateOut ? "slideOutDown" : "slideInUp"}
          duration={500}
          style={styles.customComponentContainer}
        >
          <View style={styles.customComponent}>
            <Text>This is a custom component.</Text>
          </View>
        </Animatable.View>
      )}
    </>
  );
};

export default AnimatedComponent;

const styles = StyleSheet.create({
  customComponentContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    zIndex: 100,
  },
  customComponent: {
    marginHorizontal: 20,
    backgroundColor: "white",
    paddingVertical: 100,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
  },
});
