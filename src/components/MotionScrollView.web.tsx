import React, { Children, useEffect, useRef } from "react";
import { ScrollView, View, type ScrollViewProps } from "react-native";
import AOS from "aos";
import "aos/dist/aos.css";
import { useReducedMotion } from "./ui";
let initialized = false;
function Reveal({ children }: { children: React.ReactNode }) {
  const node = useRef<React.ComponentRef<typeof View>>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = node.current as unknown as HTMLElement;
    if (!element || reduced) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.06 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced]);
  return (
    <View
      ref={node}
      {...{
        dataSet: reduced
          ? {}
          : {
              aos: "fade-up",
              "aos-duration": "450",
              "aos-easing": "ease-out-cubic",
              "aos-once": "true",
            },
      }}
    >
      {children}
    </View>
  );
}
export function MotionScrollView({ children, ...props }: ScrollViewProps) {
  useEffect(() => {
    if (!initialized) {
      AOS.init({
        duration: 450,
        once: true,
        offset: 20,
        disable: () =>
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
      initialized = true;
    } else AOS.refreshHard();
  }, []);
  return (
    <ScrollView {...props}>
      {Children.map(children, (child, i) =>
        child ? <Reveal key={i}>{child}</Reveal> : null,
      )}
    </ScrollView>
  );
}
