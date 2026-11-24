import React, { useEffect, useState } from "react";
import { Animated, Easing, Platform, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { colors as c } from "../theme";
import { T, useReducedMotion } from "./ui";
import { AnimatedLogoPath } from "./AnimatedLogoPath";
const z =
  "M29 31 Q29 12 49 12 H117 L63 81 H116 Q116 101 96 101 H29 L84 32 H29 Z";
const curve = Easing.bezier(0.19, 1, 0.22, 1);
export function Launch({
  onReady,
  done,
}: {
  onReady: () => void;
  done: () => void;
}) {
  const [imageReady, setImageReady] = useState(false);
  const reduced = useReducedMotion();
  const [scenery] = useState(() => new Animated.Value(0));
  const [trace] = useState(() => new Animated.Value(0));
  const [fill] = useState(() => new Animated.Value(0));
  const [type] = useState(() => new Animated.Value(0));
  const [caption] = useState(() => new Animated.Value(0));
  const [exit] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!imageReady) return;
    onReady();
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
        easing:
          value === trace
            ? Easing.bezier(0.45, 0, 0.55, 1)
            : value === exit
              ? Easing.bezier(0.65, 0, 0.35, 1)
              : curve,
        useNativeDriver: native && Platform.OS !== "web",
      });
    const brandSequence = reduced
      ? timing(exit, 1, 0)
      : Animated.sequence([
          Animated.parallel([
            timing(trace, 1, 760, 0, false),
            timing(fill, 1, 340, 540),
            timing(type, 1, 460, 760),
            timing(caption, 1, 340, 980),
          ]),
          timing(exit, 1, 240, 130),
        ]);
    const animation = Animated.parallel([
      brandSequence,
      timing(scenery, 1, 1690),
    ]);
    animation.start(({ finished }) => {
      if (active && finished) done();
    });
    return () => {
      active = false;
      animation.stop();
    };
  }, [
    trace,
    fill,
    type,
    caption,
    exit,
    scenery,
    reduced,
    done,
    imageReady,
    onReady,
  ]);
  return (
    <Animated.View
      accessibilityLabel="Welcome to Zedd"
      accessibilityViewIsModal
      style={[
        StyleSheet.absoluteFill,
        styles.canvas,
        {
          opacity: exit.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        },
      ]}
    >
      <Animated.View
        pointerEvents="none"
        accessible={false}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: scenery.interpolate({
              inputRange: [0, 0.2, 1],
              outputRange: [0, 1, 1],
            }),
            transform: [
              {
                scale: scenery.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.09, 1.025],
                }),
              },
              {
                translateX: scenery.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-7, 4],
                }),
              },
              {
                translateY: scenery.interpolate({
                  inputRange: [0, 1],
                  outputRange: [6, -3],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require("../../assets/editorial/coast.jpg")}
          contentFit="cover"
          cachePolicy="memory-disk"
          onLoad={() => setImageReady(true)}
          onError={() => setImageReady(true)}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <LinearGradient
        pointerEvents="none"
        colors={[
          "rgba(3,38,28,0.48)",
          "rgba(3,43,31,0.76)",
          "rgba(3,34,25,0.94)",
        ]}
        locations={[0, 0.48, 1]}
        start={{ x: 0.18, y: 0 }}
        end={{ x: 0.82, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={{
          alignItems: "center",
          transform: [{ translateY: -12 }],
        }}
      >
        <Animated.View
          style={{
            height: 102,
            width: 112,
            zIndex: 10,
          }}
        >
          <Svg width="112" height="102" viewBox="0 0 144 116">
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
            <Svg width="112" height="102" viewBox="0 0 144 116">
              <Path d={z} fill="#F4F5EE" />
            </Svg>
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={{
            opacity: exit.interpolate({
              inputRange: [0, 0.22, 1],
              outputRange: [1, 0, 0],
            }),
            flexDirection: "row",
            overflow: "hidden",
            height: 66,
            marginTop: 12,
          }}
        >
          <Animated.View
            style={{
              opacity: type,
              transform: [
                {
                  translateY: type.interpolate({
                    inputRange: [0, 1],
                    outputRange: [22, 0],
                  }),
                },
              ],
            }}
          >
            <T
              size={44}
              weight="heavy"
              color="#F4F5EE"
              style={{ letterSpacing: -2.6, lineHeight: 60 }}
            >
              zedd
              <T
                size={44}
                weight="heavy"
                color="#B7D4BA"
                style={{ letterSpacing: -2.6, lineHeight: 60 }}
              >
                .
              </T>
            </T>
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={{
            opacity: Animated.multiply(
              caption,
              exit.interpolate({
                inputRange: [0, 0.18, 1],
                outputRange: [1, 0, 0],
              }),
            ),
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
