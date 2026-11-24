import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, {
  Defs,
  Pattern,
  Path,
  Rect,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { Brand, Icon, Row, T, useReducedMotion, haptic } from "./ui";
import { useApp } from "../store/useApp";
function SecurityPattern() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 252"
        preserveAspectRatio="none"
      >
        <Defs>
          <Pattern
            id="lattice"
            x="0"
            y="0"
            width="25"
            height="15"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-35)"
          >
            <Path
              d="M0 0H25V15H0Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth=".55"
              strokeOpacity=".3"
            />
            <Path
              d="M0 7.5H25M12.5 0V15"
              stroke="#1E252D"
              strokeWidth=".4"
              strokeOpacity=".5"
            />
          </Pattern>
          <SvgGradient id="fade" x1="0" y1="0" x2="1" y2=".1">
            <Stop offset="0" stopColor="#646B73" />
            <Stop offset=".68" stopColor="#515861" />
            <Stop offset="1" stopColor="#3E454E" />
          </SvgGradient>
        </Defs>
        <Rect width="400" height="252" fill="url(#fade)" />
        <Path d="M0 0H190L335 90 38 252H0Z" fill="url(#lattice)" />
        <Path
          d="M0 62L110 0H171L0 99ZM0 156L277 0H310L0 177ZM0 228L375 17V49L13 252H0Z"
          fill="#FFFFFF"
          opacity=".07"
        />
      </Svg>
    </View>
  );
}
export function PaymentCard() {
  const name = useApp((s) => s.name);
  const frozen = useApp((s) => s.cardFrozen);
  const card = useApp((s) => s.card);
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const progress = useSharedValue(0);
  const front = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${progress.value * 180}deg` },
    ],
    opacity: progress.value > 0.5 ? 0 : 1,
  }));
  const back = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${180 + progress.value * 180}deg` },
    ],
    opacity: progress.value < 0.5 ? 0 : 1,
  }));
  const flip = () => {
    haptic();
    setFlipped(!flipped);
    progress.set(
      withTiming(flipped ? 0 : 1, {
        duration: reduced ? 0 : 650,
        easing: Easing.bezier(0.2, 0.75, 0.2, 1),
      }),
    );
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={flipped ? "Flip card to front" : "Flip card to back"}
      onPress={flip}
      style={styles.stage}
    >
      <Animated.View style={[styles.card, front]}>
        <SecurityPattern />
        <Row
          style={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Brand small inverse />
          <View style={{ alignItems: "flex-end" }}>
            <T
              size={9}
              weight="bold"
              color="#F4F5F8"
              style={{ letterSpacing: 1.5 }}
            >
              PERSONAL
            </T>
            <T size={8} color="#CFD3DC" style={{ marginTop: 2 }}>
              ZEDD PAY
            </T>
          </View>
        </Row>
        <Row style={{ justifyContent: "space-between", marginTop: 0 }}>
          <LinearGradient
            colors={["#E7D8A6", "#B9A16A", "#E4D39F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chip}
          >
            <View style={styles.chipCenter} />
            <View style={styles.chipLine} />
            <View style={[styles.chipLine, { top: 19 }]} />
          </LinearGradient>
          <View style={{ transform: [{ rotate: "90deg" }] }}>
            <Icon name="wifi" size={24} color="#E9ECF2" />
          </View>
        </Row>
        <T size={18} weight="medium" color="#F8FAF6" style={styles.number}>
          {card.number.match(/.{1,4}/g)?.join("  ")}
        </T>
        <Row style={{ gap: 20, marginTop: 0 }}>
          <Row style={{ gap: 5 }}>
            <T size={6} color="#D3D7DF" style={{ lineHeight: 8 }}>
              VALID{`\n`}FROM
            </T>
            <T size={10} color="#F8FAF6" style={styles.emboss}>
              09/26
            </T>
          </Row>
          <Row style={{ gap: 5 }}>
            <T size={6} color="#D3D7DF" style={{ lineHeight: 8 }}>
              VALID{`\n`}THRU
            </T>
            <T size={10} color="#F8FAF6" style={styles.emboss}>
              {card.expiry}
            </T>
          </Row>
        </Row>
        <Row
          style={{
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 0,
          }}
        >
          <T
            size={12}
            weight="medium"
            color="#FFFFFF"
            style={[styles.emboss, { letterSpacing: 2 }]}
          >
            {name.toUpperCase()} {name.includes(" ") ? "" : "MORGAN"}
          </T>
          <View style={{ alignItems: "flex-end" }}>
            <T
              size={19}
              weight="heavy"
              color="#F4F5F9"
              style={{ fontStyle: "italic", letterSpacing: -1 }}
            >
              ZEDD
            </T>
            <T size={8} color="#D3D7E0" style={{ letterSpacing: 1.5 }}>
              PLATINUM
            </T>
          </View>
        </Row>
        {frozen && (
          <View style={styles.frozen}>
            <Icon name="freeze" color="#FFF" />
            <T color="#FFF" size={13} weight="bold">
              Card frozen
            </T>
          </View>
        )}
      </Animated.View>
      <Animated.View style={[styles.card, styles.back, back]}>
        <SecurityPattern />
        <View
          style={{
            marginHorizontal: -21,
            height: 42,
            backgroundColor: "#242825",
            marginTop: 10,
          }}
        />
        <Row style={{ marginTop: 17, gap: 10 }}>
          <View
            style={{
              height: 34,
              flex: 1,
              backgroundColor: "#F5F5F0",
              paddingHorizontal: 9,
              justifyContent: "center",
            }}
          >
            <T size={13} color="#737A72" style={{ fontStyle: "italic" }}>
              Authorized signature
            </T>
          </View>
          <View
            style={{
              height: 34,
              width: 45,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <T size={14} color="#3A423B" weight="medium">
              {card.cvv}
            </T>
          </View>
        </Row>
        <T size={8} color="#707A72" style={{ marginTop: 12 }}>
          PERSONAL CARD · ZEDD PAY
        </T>
        <View style={{ position: "absolute", bottom: 20, left: 21, right: 21 }}>
          <Row
            style={{ justifyContent: "space-between", alignItems: "flex-end" }}
          >
            <Brand small inverse />
            <View style={{ alignItems: "flex-end" }}>
              <T size={9} color="#5C6961">
                Card ending {card.number.slice(-4)}
              </T>
              <T size={8} color="#7A857D" style={{ marginTop: 3 }}>
                Tap to return
              </T>
            </View>
          </Row>
        </View>
      </Animated.View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  stage: { width: "100%", aspectRatio: 1.586 },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 16,
    padding: 18,
    justifyContent: "space-between",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#737B85",
    backfaceVisibility: "hidden",
    boxShadow: "0 10px 22px rgba(33,48,38,.14)",
  },
  back: { backgroundColor: "#515861" },
  number: {
    letterSpacing: 1.8,
    marginTop: 0,
    textShadowColor: "rgba(62,74,66,.72)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  emboss: {
    letterSpacing: 1.4,
    textShadowColor: "rgba(62,74,66,.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  chip: {
    width: 40,
    height: 31,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BEA96D",
    overflow: "hidden",
  },
  chipCenter: {
    position: "absolute",
    left: 13,
    top: -1,
    width: 13,
    height: 33,
    borderWidth: 1,
    borderColor: "rgba(97,79,35,.6)",
    borderRadius: 5,
  },
  chipLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    top: 10,
    backgroundColor: "rgba(97,79,35,.55)",
  },
  frozen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(18,31,24,.72)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
