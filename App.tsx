import { LaunchReadyContext } from "./src/components/Loading";
import React, { useState, useCallback } from "react";
import { View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Stack, router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { DMSans_400Regular } from "@expo-google-fonts/dm-sans/400Regular";
import { DMSans_500Medium } from "@expo-google-fonts/dm-sans/500Medium";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans/700Bold";
import { Manrope_600SemiBold } from "@expo-google-fonts/manrope/600SemiBold";
import { Manrope_700Bold } from "@expo-google-fonts/manrope/700Bold";
import * as SplashScreen from "expo-splash-screen";
import { colors as c } from "./src/theme";
import {
  T,
  Row,
  Icon,
  Tap,
  NoticeProvider,
  useReducedMotion,
} from "./src/components/ui";
import { useApp } from "./src/store/useApp";
import { Launch } from "./src/components/Launch";
import { Catalog, Detail, Cart, Checkout } from "./src/screens/Commerce";
import {
  Transfer,
  TopUp,
  Receive,
  Card,
  Insurance,
  Bill,
} from "./src/screens/Payments";
import {
  Confirmation,
  Receipt,
  ProfileEdit,
  Saved,
  Notifications,
  Help,
  About,
  CreateListing,
} from "./src/screens/Supporting";
SplashScreen.preventAutoHideAsync().catch(() => {});

const screens = [
  ["Catalog", Catalog, "Discover"],
  ["Detail", Detail, "A closer look"],
  ["Cart", Cart, "Your bag"],
  ["Checkout", Checkout, "Review & confirm"],
  ["Transfer", Transfer, "Send money"],
  ["TopUp", TopUp, "Add money"],
  ["Receive", Receive, "Your Zedd QR"],
  ["Card", Card, "Your card"],
  ["Insurance", Insurance, "Vehicle insurance"],
  ["Bill", Bill, "Pay a bill"],
  ["Confirmation", Confirmation, "All set"],
  ["Receipt", Receipt, "Your receipt"],
  ["ProfileEdit", ProfileEdit, "Personal details"],
  ["Saved", Saved, "Saved collection"],
  ["Notifications", Notifications, "Notifications"],
  ["Help", Help, "Here to help"],
  ["About", About, "About Zedd"],
  ["CreateListing", CreateListing, "Create a listing"],
] as const;
function Header({ navigation, route, options }: any) {
  const insets = useSafeAreaInsets();
  const quantity = useApp((s) => s.cart.reduce((a, l) => a + l.quantity, 0));
  const title =
    route.name === "Catalog"
      ? route.params?.service
      : options.title?.replace(/^Zedd · /, "");
  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: c.background,
        borderBottomWidth: 1,
        borderColor: c.line,
      }}
    >
      <Row
        style={{
          paddingHorizontal: 18,
          height: 64,
          justifyContent: "space-between",
        }}
      >
        <Tap
          label="Go back"
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/")
          }
          style={{
            width: 42,
            height: 42,
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: c.white,
            borderWidth: 1,
            borderColor: c.line,
          }}
        >
          <Icon name="left" size={22} />
        </Tap>
        <T
          size={15}
          weight="bold"
          numberOfLines={1}
          style={{ flex: 1, textAlign: "center", paddingHorizontal: 6 }}
        >
          {title}
        </T>
        <Tap
          label={`Your bag, ${quantity} items`}
          onPress={() => router.navigate("/Cart")}
          style={{
            width: 42,
            height: 42,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="bag" size={21} />
          {quantity > 0 && (
            <View
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                backgroundColor: c.primary,
                borderRadius: 10,
                minWidth: 18,
                padding: 2,
                alignItems: "center",
              }}
            >
              <T color={c.white} size={9} weight="bold">
                {quantity}
              </T>
            </View>
          )}
        </Tap>
      </Row>
    </View>
  );
}
export default function App() {
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const [launch, setLaunch] = useState(true);
  const finishLaunch = useCallback(() => setLaunch(false), []);
  const reduced = useReducedMotion();
  const revealLaunch = useCallback(() => {
    void SplashScreen.hideAsync().catch(() => {});
  }, []);
  if (!loaded && !error)
    return <View style={{ flex: 1, backgroundColor: c.brand }} />;
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#ECEEF2" }}>
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: Platform.OS === "web" ? 430 : undefined,
            alignSelf: "center",
            backgroundColor: c.background,
            ...(Platform.OS === "web"
              ? { boxShadow: "0 0 100px rgba(22,44,31,.08)" }
              : {}),
          }}
        >
          <LaunchReadyContext.Provider value={!launch}>
            <NoticeProvider>
              <StatusBar style={launch ? "light" : "dark"} />
              <Stack
                screenOptions={{
                  header: (props) => <Header {...props} />,
                  contentStyle: { backgroundColor: c.background },
                  animation: reduced ? "none" : "slide_from_right",
                }}
              >
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: false,
                    title: "Zedd — Everyday, beautifully connected",
                  }}
                />
                {screens.map(([name, component, title]) => (
                  <Stack.Screen
                    key={name}
                    name={name}
                    options={{
                      title: `Zedd · ${title}`,
                      gestureEnabled: name !== "Confirmation",
                      ...(name === "Confirmation"
                        ? { animation: "fade" as const }
                        : {}),
                    }}
                  />
                ))}
              </Stack>
              {launch && <Launch onReady={revealLaunch} done={finishLaunch} />}
            </NoticeProvider>
          </LaunchReadyContext.Provider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
