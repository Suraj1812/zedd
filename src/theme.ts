export const colors = {
  ink: "#18191E",
  muted: "#7A7E89",
  primary: "#17191F",
  primaryDark: "#111216",
  brand: "#063F32",
  mint: "#E8ECF9",
  lime: "#E6EAF5",
  background: "#FAFAFC",
  white: "#FFFFFF",
  line: "#E9EAF0",
  soft: "#F0F1F5",
  orange: "#C4774C",
  red: "#B23F38",
  blue: "#557A93",
};
export const fonts = {
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  bold: "DMSans_700Bold",
  display: "Manrope_600SemiBold",
  heavy: "Manrope_700Bold",
};
export const money = (cents: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(
    cents / 100,
  );
export const mark = require("../assets/brand/zedd-mark.png");
