import React, { forwardRef } from "react";
import { Animated } from "react-native";
import { Path, type PathProps } from "react-native-svg";
import { webSvgProps } from "../lib/webSvgProps";

// React Native Animated sets collapsable=false for native layout. SVG's web
// adapter forwards unknown props, so filter the native flags at this boundary.
const WebLogoPath = forwardRef<
  React.ComponentRef<typeof Path>,
  PathProps & { collapsable?: boolean; collapsableChildren?: boolean }
>((props, ref) => <Path {...webSvgProps(props)} ref={ref} />);
WebLogoPath.displayName = "WebLogoPath";

export const AnimatedLogoPath = Animated.createAnimatedComponent(WebLogoPath);
