import React, { createContext, useContext } from "react";
import { View } from "react-native";

export const LaunchReadyContext = createContext(false);

export function RouteGate({ children }: { children: React.ReactNode }) {
  const ready = useContext(LaunchReadyContext);
  // Render local content under the launch screen so the exit reveals a complete
  // page. Navigation itself is not a data-loading operation.
  return (
    <View
      pointerEvents={ready ? "auto" : "none"}
      accessibilityElementsHidden={!ready}
      importantForAccessibility={ready ? "auto" : "no-hide-descendants"}
      style={{ flex: 1 }}
    >
      {children}
    </View>
  );
}
