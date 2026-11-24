import React, { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getItem, serviceOffers, type ServiceKey } from "./catalog";
import { Empty } from "../components/ui";
import { useApp, type CheckoutDraft } from "../store/useApp";
import { ActivityIndicator, View } from "react-native";
let sequence = 0;
function href(name: string, params: Record<string, any> = {}) {
  const pathname = name === "Main" ? "/" : `/${name}`;
  if (name === "Checkout") {
    const ref = `draft-${Date.now().toString(36)}-${++sequence}`;
    useApp.getState().stageCheckout(ref, params as CheckoutDraft);
    return { pathname, params: { ref } } as any;
  }
  if (name === "Detail")
    return {
      pathname,
      params: {
        item: params.item.id,
        ...(params.item.service ? { service: params.item.service } : {}),
      },
    } as any;
  return { pathname, params } as any;
}
export function useNavigation(): any {
  return useMemo(
    () => ({
      navigate: (name: string, params?: Record<string, any>) =>
        router.navigate(href(name, params)),
      replace: (name: string, params?: Record<string, any>) =>
        router.replace(href(name, params)),
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/")),
      canGoBack: () => router.canGoBack(),
      setParams: (params: Record<string, string>) => router.setParams(params),
      reset: (state: any) => {
        router.dismissAll();
        const route = state.routes[0];
        router.replace(href(route.name, route.params));
      },
    }),
    [],
  );
}
export function useRoute(): any {
  const raw = useLocalSearchParams<Record<string, string>>();
  let params: Record<string, any> = { ...raw };
  if (raw.ref) params = useApp.getState().checkoutDrafts[raw.ref] || {};
  if (raw.item)
    params = {
      ...params,
      item:
        getItem(raw.item) ||
        (raw.service
          ? serviceOffers(raw.service as ServiceKey).find(
              (i) => i.id === raw.item,
            )
          : undefined),
    };
  return { params };
}
export function WithRoute({
  Screen,
  required,
}: {
  Screen: React.ComponentType;
  required?: string;
}) {
  const hydrated = useApp((s) => s.hydrated);
  const { params } = useRoute();
  if (!hydrated)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator accessibilityLabel="Loading saved activity" />
      </View>
    );
  if (required && !params[required])
    return (
      <Empty
        title="Let’s start fresh."
        description="This review session is no longer available. Your completed activity is still saved on this device."
        action="Back to Zedd"
        onPress={() => router.replace("/")}
      />
    );
  return <Screen />;
}
