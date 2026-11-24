import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ScrollView,
  View,
  Animated,
  Dimensions,
  type ScrollViewProps,
} from "react-native";
import { useReducedMotion } from "./ui";
type Notify = () => void;
const ScrollContext = createContext<Set<Notify> | null>(null);
function Reveal({ children }: { children: React.ReactNode }) {
  const listeners = useContext(ScrollContext);
  const node = useRef<React.ComponentRef<typeof View>>(null);
  const [progress] = useState(() => new Animated.Value(0));
  const reduced = useReducedMotion();
  useEffect(() => {
    let revealed = false;
    const check = () => {
      if (revealed) return;
      node.current?.measureInWindow((_x, y, _w, h) => {
        if (y + h > 0 && y < Dimensions.get("window").height) {
          revealed = true;
          Animated.timing(progress, {
            toValue: 1,
            duration: reduced ? 0 : 420,
            useNativeDriver: true,
          }).start();
        }
      });
    };
    listeners?.add(check);
    const timer = setTimeout(check, 30);
    return () => {
      clearTimeout(timer);
      listeners?.delete(check);
    };
  }, [listeners, progress, reduced]);
  return (
    <View
      ref={node}
      onLayout={() => {
        node.current?.measureInWindow((_x, y) => {
          if (y < Dimensions.get("window").height)
            Animated.timing(progress, {
              toValue: 1,
              duration: reduced ? 0 : 420,
              useNativeDriver: true,
            }).start();
        });
      }}
    >
      <Animated.View
        style={{
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0],
              }),
            },
          ],
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
}
export function MotionScrollView({
  children,
  onScroll,
  ...props
}: ScrollViewProps) {
  const [listeners] = useState(() => new Set<Notify>());
  return (
    <ScrollContext.Provider value={listeners}>
      <ScrollView
        {...props}
        scrollEventThrottle={100}
        onScroll={(event) => {
          onScroll?.(event);
          listeners.forEach((fn) => fn());
        }}
      >
        {Children.map(children, (child, i) =>
          child ? <Reveal key={i}>{child}</Reveal> : null,
        )}
      </ScrollView>
    </ScrollContext.Provider>
  );
}
