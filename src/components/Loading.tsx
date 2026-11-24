import React, { createContext, useContext, useEffect, useState } from "react";
import { Animated, View, Platform } from "react-native";
import { usePathname, useLocalSearchParams } from "expo-router";
const SkeletonContext = createContext(false);
export const LaunchReadyContext = createContext(false);
export const useSkeleton = () => useContext(SkeletonContext);
export function RouteGate({ children }: { children: React.ReactNode }) {
  const ready = useContext(LaunchReadyContext);
  const path = usePathname();
  const params = useLocalSearchParams();
  const key = `${path}:${params.tab || params.item || params.service || params.ref || params.id || ""}`;
  const [finished, setFinished] = useState("");
  const [pulse] = useState(() => new Animated.Value(0.55));
  const loading = !ready || finished !== key;
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setFinished(key), 500);
    return () => clearTimeout(timer);
  }, [ready, key]);
  useEffect(() => {
    if (!loading) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(pulse, {
          toValue: 0.55,
          duration: 650,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
      pulse.setValue(1);
    };
  }, [loading, pulse]);
  return (
    <SkeletonContext.Provider value={loading}>
      <Animated.View
        pointerEvents={loading ? "none" : "auto"}
        accessibilityElementsHidden={loading}
        importantForAccessibility={loading ? "no-hide-descendants" : "auto"}
        style={{ flex: 1, opacity: loading ? pulse : 1 }}
      >
        {children}
      </Animated.View>
      {loading && (
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Loading page"
          style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
        />
      )}
    </SkeletonContext.Provider>
  );
}
