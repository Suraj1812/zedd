import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors as c } from "../theme";
import { T, useReducedMotion } from "./ui";
import { AnimatedLogoPath } from "./AnimatedLogoPath";
const z =
  "M29 31 Q29 12 49 12 H117 L63 81 H116 Q116 101 96 101 H29 L84 32 H29 Z";
const curve = Easing.bezier(0.19, 1, 0.22, 1);
export function Launch({ done }: { done: () => void }) {
  const reduced = useReducedMotion();
  const { height } = useWindowDimensions();
  const [trace] = useState(() => new Animated.Value(0));
  const [fill] = useState(() => new Animated.Value(0));
  const [settle] = useState(() => new Animated.Value(0));
  const [type] = useState(() => new Animated.Value(0));
  const [exit] = useState(() => new Animated.Value(0));
  useEffect(() => {
    let active = true;
    const timing = (
      value: Animated.Value,
      toValue: number,
      duration: number,
      delay = 0,
      native = true,
    ) =>
      Animated.timing(value, {
        toValue,
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        easing: curve,
        useNativeDriver: native && Platform.OS !== "web",
      });
    const animation = reduced
      ? timing(exit, 1, 0)
      : Animated.sequence([
          Animated.parallel([
            timing(trace, 1, 840, 0, false),
            timing(fill, 1, 440, 510),
            timing(settle, 1, 1000),
            timing(type, 1, 650, 760),
          ]),
          timing(exit, 1, 620, 140),
        ]);
    animation.start(({ finished }) => {
      if (active && finished) done();
    });
    return () => {
      active = false;
      animation.stop();
    };
  }, [trace, fill, settle, type, exit, reduced, done]);
  return (
    <Animated.View
      accessibilityLabel="Welcome to Zedd"
      accessibilityViewIsModal
      style={[
        StyleSheet.absoluteFill,
        styles.canvas,
        {
          transform: [
            {
              translateY: exit.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -height - 30],
              }),
            },
          ],
        },
      ]}
    >
      <Animated.View
        style={{
          alignItems: "center",
          transform: [
            {
              translateY: settle.interpolate({
                inputRange: [0, 1],
                outputRange: [25, -18],
              }),
            },
            {
              scale: settle.interpolate({
                inputRange: [0, 1],
                outputRange: [1.18, 1],
              }),
            },
          ],
        }}
      >
        <View style={{ height: 130, width: 144 }}>
          <Svg width="144" height="130" viewBox="0 0 144 116">
            <AnimatedLogoPath
              d={z}
              stroke="#F4F5EE"
              strokeWidth="1.3"
              fill="none"
              strokeDasharray={[420, 420]}
              strokeDashoffset={trace.interpolate({
                inputRange: [0, 1],
                outputRange: [420, 0],
              })}
            />
          </Svg>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: fill }]}>
            <Svg width="144" height="130" viewBox="0 0 144 116">
              <Path d={z} fill="#F4F5EE" />
            </Svg>
          </Animated.View>
        </View>
        <View
          style={{
            flexDirection: "row",
            overflow: "hidden",
            height: 88,
            marginTop: 17,
          }}
        >
          {["z", "e", "d", "d", "."].map((letter, i) => (
            <Animated.View
              key={i}
              style={{
                opacity: type.interpolate({
                  inputRange: [0, i * 0.1 + 0.12, 1],
                  outputRange: [0, 0, 1],
                }),
                transform: [
                  {
                    translateY: type.interpolate({
                      inputRange: [0, i * 0.1 + 0.12, 1],
                      outputRange: [78, 78, 0],
                    }),
                  },
                ],
              }}
            >
              <T
                size={62}
                weight="heavy"
                color={letter === "." ? "#B7D4BA" : "#F4F5EE"}
                style={{ letterSpacing: -3.8, lineHeight: 82 }}
              >
                {letter}
              </T>
            </Animated.View>
          ))}
        </View>
        <Animated.View
          style={{
            opacity: type,
            transform: [
              {
                translateY: type.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          }}
        >
          <T
            size={12}
            color="#BBD2C7"
            style={{ letterSpacing: 0.7, marginTop: 8 }}
          >
            Everyday, beautifully connected.
          </T>
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={{ position: "absolute", bottom: 55, opacity: type }}
      >
        <View
          style={{
            height: 1,
            width: 32,
            backgroundColor: "#87AB95",
            alignSelf: "center",
            marginBottom: 12,
          }}
        />
        <T
          color="#8FB29F"
          size={9}
          weight="medium"
          style={{ letterSpacing: 2.4 }}
        >
          PAY. TRAVEL. DISCOVER.
        </T>
      </Animated.View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  canvas: {
    zIndex: 100,
    backgroundColor: c.brand,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
