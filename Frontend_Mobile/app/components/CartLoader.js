import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DriftingCartLoader() {
  const rotation = useRef(new Animated.Value(0)).current;
  const wheelScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wheelScale, {
          toValue: 1.2,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(wheelScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const translateX = rotation.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 20, 0, -20, 0],
  });

  const translateY = rotation.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -20, 0, -20, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.cartContainer,
          {
            transform: [{ translateX }, { translateY }, { rotate: spin }],
          },
        ]}
      >
        <Svg height="100" width="100" viewBox="0 0 100 100">
          {/* Cart body */}
          <Path
            d="M10 70 L90 70 L80 30 L30 30 Z"
            fill="#3498db"
            stroke="#2980b9"
            strokeWidth="2"
          />
          {/* Cart handle */}
          <Path
            d="M30 30 L20 10"
            stroke="#2980b9"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Wheels */}
          <AnimatedCircle
            cx="30"
            cy="80"
            r="10"
            fill="#95a5a6"
            transform={`scale(${wheelScale})`}
          />
          <AnimatedCircle
            cx="70"
            cy="80"
            r="10"
            fill="#95a5a6"
            transform={`scale(${wheelScale})`}
          />
        </Svg>
      </Animated.View>
      {/* Speed lines */}
      <AnimatedPath
        d="M10 10 Q30 50 10 90 M30 10 Q50 50 30 90 M50 10 Q70 50 50 90"
        fill="none"
        stroke="#bdc3c7"
        strokeWidth="2"
        strokeDasharray="5,5"
        style={{
          position: "absolute",
          transform: [{ rotate: spin }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  cartContainer: {
    width: 100,
    height: 100,
  },
});
