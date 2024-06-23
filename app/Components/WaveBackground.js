import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const WaveBackground = () => {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <Svg height="100%" width="100%" viewBox="0 20 180 280">
        <Path
          fill="#ffb600"
          d="M0,64L48,80C96,96,192,128,188,90C384,192,480,224,576,213.3C672,203,768,149,864,128C960,107,1056,117,1152,117.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          transform="scale(-1, 1) translate(-180, 0)"
        />
      </Svg>
    </View>
  );
};

export default WaveBackground;
