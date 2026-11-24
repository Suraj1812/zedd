import { MotionScrollView as ScrollView } from "../components/MotionScrollView";
import React, { useState } from "react";
import { View, StyleSheet, Switch } from "react-native";
import { useNavigation, useRoute } from "../lib/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { format } from "date-fns";
import { colors as c, money } from "../theme";
import {
  T,
  Row,
  Icon,
  Tap,
  RoundButton,
  Brand,
  Section,
  Picture,
  SearchField,
  Empty,
  Chips,
  Tag,
  ItemCard,
  useReducedMotion,
  s as ui,
} from "../components/ui";
import { PaymentCard } from "../components/PaymentCard";
import { useApp } from "../store/useApp";
import {
  services,
  hotels,
  restaurants,
  products,
  allItems,
  riad,
  argan,
} from "../lib/catalog";
const tabs = [
  { name: "Home", icon: "home" },
  { name: "Explore", icon: "compass" },
  { name: "Pay", icon: "wallet" },
  { name: "Activity", icon: "clock" },
  { name: "Profile", icon: "user" },
];
export function Main() {
  const route = useRoute();
  const nav = useNavigation();
  const tab = route.params?.tab || "Home";
  const setTab = (tab: string) => nav.setParams({ tab });
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ flex: 1, backgroundColor: c.background, paddingTop: insets.top }}
    >
      <View style={{ flex: 1 }}>
        {tab === "Home" ? (
          <Home onTab={setTab} />
        ) : tab === "Explore" ? (
          <Explore />
        ) : tab === "Pay" ? (
          <Pay />
        ) : tab === "Activity" ? (
          <Activity />
        ) : (
          <Profile />
        )}
      </View>
      <View
        style={[styles.tabbar, { paddingBottom: Math.max(insets.bottom, 10) }]}
      >
        {tabs.map((t) => (
          <View key={t.name} style={{ flex: 1 }}>
            <Tap
              label={t.name}
              onPress={() => setTab(t.name)}
              style={{
                alignItems: "center",
                gap: 4,
                paddingTop: 12,
                paddingBottom: 4,
              }}
            >
              <View
                style={[
                  styles.tabIcon,
                  tab === t.name && { backgroundColor: c.soft },
                ]}
              >
                <Icon
                  name={t.icon}
                  size={22}
                  color={tab === t.name ? c.primary : "#929B94"}
                  stroke={tab === t.name ? 2 : 1.6}
                />
              </View>
              <T
                size={10}
                weight={tab === t.name ? "bold" : "medium"}
                color={tab === t.name ? c.primary : c.muted}
              >
                {t.name}
              </T>
            </Tap>
          </View>
        ))}
      </View>
    </View>
  );
}
function Home({ onTab }: { onTab: (tab: string) => void }) {
  const nav = useNavigation();
  const name = useApp((s) => s.name);
  const city = useApp((s) => s.city);
  const balance = useApp((s) => s.balance);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: 28 }}
    >
      <Row style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <Brand />
        <Row style={{ gap: 10 }}>
          <Tap
            onPress={() => nav.navigate("ProfileEdit")}
            label="Change location"
            style={{ padding: 6 }}
          >
            <Row style={{ gap: 4 }}>
              <Icon name="pin" size={14} color={c.muted} />
              <T size={12} weight="medium">
                {city}
              </T>
              <Icon name="down" size={12} />
            </Row>
          </Tap>
          <RoundButton
            icon="bell"
            label="Notifications"
            onPress={() => nav.navigate("Notifications")}
          />
        </Row>
      </Row>
      <Animated.View
        entering={reduced ? undefined : FadeInDown.delay(100).duration(600)}
      >
        <View>
          <Row
            style={{
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 13,
            }}
          >
            <View>
              <T size={12} color={c.muted}>
                {name}’s balance
              </T>
              <T size={30} weight="display" style={{ letterSpacing: -1 }}>
                {hidden ? "••••••" : money(balance)}
                <T size={11} color={c.muted}>
                  {" "}
                  AUD
                </T>
              </T>
            </View>
            <Row style={{ gap: 5 }}>
              <RoundButton
                icon={hidden ? "eye-off" : "eye"}
                label={hidden ? "Show balance" : "Hide balance"}
                onPress={() => setHidden(!hidden)}
              />
              <RoundButton
                icon="search"
                label="Search Zedd"
                onPress={() => onTab("Explore")}
              />
            </Row>
          </Row>
          <PaymentCard />
          <Row style={{ gap: 9, marginTop: 14 }}>
            {[
              {
                name: "Send",
                icon: "send",
                action: () => nav.navigate("Transfer"),
              },
              {
                name: "Add money",
                icon: "plus",
                action: () => nav.navigate("TopUp"),
              },
              {
                name: "Receive",
                icon: "qr",
                action: () => nav.navigate("Receive"),
              },
            ].map((a, i) => (
              <View key={a.name} style={{ flex: 1 }}>
                <Tap
                  label={a.name}
                  onPress={a.action}
                  style={{
                    backgroundColor: i === 0 ? c.primary : c.soft,
                    borderRadius: 12,
                    paddingVertical: 13,
                  }}
                >
                  <Row style={{ gap: 6, justifyContent: "center" }}>
                    <Icon
                      name={a.icon}
                      size={16}
                      color={i === 0 ? c.white : c.primary}
                    />
                    <T
                      size={12}
                      weight="bold"
                      color={i === 0 ? c.white : c.primary}
                    >
                      {a.name}
                    </T>
                  </Row>
                </Tap>
              </View>
            ))}
          </Row>
        </View>
      </Animated.View>
      <Section
        title="Services"
        action="View all"
        onPress={() => onTab("Explore")}
      />
      <View style={styles.serviceGrid}>
        {services.map((svc, i) => (
          <View key={svc.name} style={{ width: "20%" }}>
            <Tap
              label={svc.name}
              onPress={() =>
                nav.navigate(svc.name === "Bills" ? "Bill" : "Catalog", {
                  service: svc.name,
                })
              }
              style={{ alignItems: "center", gap: 9, paddingVertical: 8 }}
            >
              <View style={[styles.serviceIcon, { backgroundColor: svc.bg }]}>
                <Icon name={svc.icon} size={23} color={svc.color} />
              </View>
              <T size={11} weight="medium">
                {svc.name}
              </T>
            </Tap>
          </View>
        ))}
      </View>
      <Section
        title="A change of scenery"
        eyebrow="THE ART OF GETTING AWAY"
        action="Explore stays"
        onPress={() => nav.navigate("Catalog", { service: "Hotels" })}
      />
      <Tap
        label="Discover Riad Jardin Secret"
        onPress={() => nav.navigate("Detail", { item: hotels[0] })}
        style={styles.travelCard}
      >
        <Picture source={riad} style={{ width: "100%", height: 228 }} />
        <View style={styles.photoShade} />
        <View style={{ position: "absolute", top: 16, left: 16 }}>
          <Tag text="A stay less ordinary" dark />
        </View>
        <View style={{ position: "absolute", bottom: 19, left: 19, right: 19 }}>
          <T
            color={c.white}
            size={23}
            weight="display"
            style={{ letterSpacing: -0.7 }}
          >
            Slow mornings in Marrakech.
          </T>
          <Row style={{ justifyContent: "space-between", marginTop: 5 }}>
            <T size={12} color="#F1F2EB">
              Discover the riad collection
            </T>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,.16)",
                padding: 6,
                borderRadius: 20,
              }}
            >
              <Icon name="right" color={c.white} size={17} />
            </View>
          </Row>
        </View>
      </Tap>
      <Section
        title="Good taste, delivered."
        action="Find your flavour"
        onPress={() => nav.navigate("Catalog", { service: "Food" })}
      />
      <Row style={{ alignItems: "flex-start", gap: 14 }}>
        {restaurants.slice(0, 2).map((item) => (
          <ItemCard
            item={item}
            key={item.id}
            compact
            onPress={() => nav.navigate("Detail", { item })}
          />
        ))}
      </Row>
      <Tap
        label="Explore vehicle insurance"
        onPress={() => nav.navigate("Insurance")}
        style={styles.insurance}
      >
        <View
          style={{
            width: 47,
            height: 47,
            borderRadius: 15,
            backgroundColor: "#E5E7EE",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="shield" color={c.primary} size={26} />
        </View>
        <View style={{ flex: 1 }}>
          <T size={15} weight="bold">
            A little peace of mind.
          </T>
          <T size={12} color={c.muted}>
            Vehicle cover, made simple.
          </T>
        </View>
        <Icon name="right" size={18} />
      </Tap>
      <Section
        title="Objects with a story"
        eyebrow="THE ZEDD EDIT"
        action="Shop the edit"
        onPress={() => nav.navigate("Catalog", { service: "Shop" })}
      />
      <Tap
        label="Shop Pure Argan Oil"
        onPress={() => nav.navigate("Detail", { item: products[0] })}
        style={styles.shopFeature}
      >
        <View style={{ flex: 1, padding: 19, justifyContent: "center" }}>
          <T
            size={10}
            color={c.muted}
            weight="bold"
            style={{ letterSpacing: 1.3 }}
          >
            MADE WITH INTENTION
          </T>
          <T
            size={23}
            weight="display"
            style={{ marginTop: 9, lineHeight: 29, letterSpacing: -0.7 }}
          >
            Small rituals.{`\n`}Beautiful things.
          </T>
          <T size={12} color={c.muted} style={{ marginTop: 10 }}>
            Discover Moroccan craftsmanship.
          </T>
          <T
            size={13}
            weight="bold"
            color={c.primary}
            style={{ marginTop: 20 }}
          >
            Meet the collection
          </T>
        </View>
        <Picture source={argan} style={{ width: "45%", height: 230 }} />
      </Tap>
      <Tap
        label="Explore marketplace"
        onPress={() => nav.navigate("Catalog", { service: "Marketplace" })}
        style={[styles.insurance, { marginTop: 20 }]}
      >
        <Icon name="store" color={c.primary} size={25} />
        <View style={{ flex: 1 }}>
          <T size={15} weight="bold">
            Find your next great find.
          </T>
          <T size={12} color={c.muted}>
            Discover the Zedd marketplace.
          </T>
        </View>
        <Icon name="right" size={18} />
      </Tap>
      <Row style={{ justifyContent: "center", gap: 6, marginTop: 30 }}>
        <Icon name="shield" size={14} color={c.muted} />
        <T size={11} color={c.muted}>
          Thoughtfully connected. Simply Zedd.
        </T>
      </Row>
    </ScrollView>
  );
}
function Explore() {
  const nav = useNavigation();
  const savedIds = useApp((s) => s.saved);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );
  const items = allItems.filter(
    (i) =>
      (!query ||
        `${i.name} ${i.subtitle} ${i.category}`
          .toLowerCase()
          .includes(query.toLowerCase())) &&
      (filter !== "Saved" || savedIds.includes(i.id)),
  );
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.page}
    >
      <T size={13} color={c.muted}>
        A world of possibilities
      </T>
      <T size={30} weight="display" style={styles.pageTitle}>
        Find your next thing.
      </T>
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Stays, food, products and more"
      />
      <View style={{ marginTop: 16 }}>
        <Chips values={["All", "Saved"]} value={filter} onChange={setFilter} />
      </View>
      {!query && filter === "All" && (
        <>
          <Section title="Everything, in one place" />
          <View style={{ gap: 10 }}>
            {[
              ...services,
              {
                name: "Shop",
                icon: "bag",
                color: c.primary,
                bg: c.soft,
                tagline: "Things made with intention",
              },
              {
                name: "Marketplace",
                icon: "store",
                color: c.primary,
                bg: c.soft,
                tagline: "Buy, sell, discover",
              },
              {
                name: "Insurance",
                icon: "shield",
                color: c.primary,
                bg: c.soft,
                tagline: "A little peace of mind",
              },
            ].map((svc) => (
              <Tap
                key={svc.name}
                label={svc.name}
                onPress={() =>
                  nav.navigate(
                    svc.name === "Bills"
                      ? "Bill"
                      : svc.name === "Insurance"
                        ? "Insurance"
                        : "Catalog",
                    { service: svc.name },
                  )
                }
                style={styles.serviceRow}
              >
                <View
                  style={[
                    styles.serviceIcon,
                    { width: 43, height: 43, backgroundColor: svc.bg },
                  ]}
                >
                  <Icon name={svc.icon} color={svc.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="bold" size={15}>
                    {svc.name}
                  </T>
                  <T size={12} color={c.muted}>
                    {svc.tagline}
                  </T>
                </View>
                <Icon name="right" size={17} color={c.muted} />
              </Tap>
            ))}
          </View>
        </>
      )}
      {(query || filter === "Saved") && (
        <>
          <Section
            title={
              filter === "Saved" ? "Your saved collection" : "Found for you"
            }
          />
          {!!query &&
            filteredServices.map((svc) => (
              <Tap
                key={svc.name}
                label={`Open ${svc.name}`}
                onPress={() =>
                  nav.navigate(svc.name === "Bills" ? "Bill" : "Catalog", {
                    service: svc.name,
                  })
                }
                style={[styles.serviceRow, { marginBottom: 12 }]}
              >
                <Icon name={svc.icon} />
                <T style={{ flex: 1 }}>{svc.name}</T>
                <Icon name="right" />
              </Tap>
            ))}
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onPress={() => nav.navigate("Detail", { item })}
            />
          ))}
          {!items.length && !filteredServices.length && (
            <Empty
              title="Nothing here just yet"
              description="Try another search or save something you love to find it here."
            />
          )}
          {!items.length && filter === "Saved" && (
            <Empty
              icon="heart"
              title="Keep the good finds"
              description="Tap the heart on any stay or product to save it for later."
            />
          )}
        </>
      )}
    </ScrollView>
  );
}
function Pay() {
  const nav = useNavigation();
  const state = useApp();
  const [show, setShow] = useState(true);
  const frozen = state.cardFrozen;
  const setFrozen = (cardFrozen: boolean) => state.profile({ cardFrozen });
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.page}
    >
      <Row style={{ justifyContent: "space-between" }}>
        <T size={29} weight="display" style={styles.pageTitle}>
          Your money, simplified.
        </T>
      </Row>
      <T color={c.muted} size={14}>
        A little more freedom, every day.
      </T>
      <View style={{ marginTop: 24 }}>
        <T color={c.muted} size={12}>
          Available balance
        </T>
        <T
          size={34}
          weight="display"
          style={{ letterSpacing: -1, marginTop: 4, marginBottom: 22 }}
        >
          {show ? money(state.balance) : "••••••"}
        </T>
        <PaymentCard />
      </View>
      <Row style={{ marginTop: 20, justifyContent: "space-between" }}>
        {[
          { icon: "send", name: "Send", route: "Transfer" },
          { icon: "plus", name: "Add money", route: "TopUp" },
          { icon: "qr", name: "Receive", route: "Receive" },
          { icon: "card", name: "Card", route: "Card" },
        ].map((a) => (
          <Tap
            key={a.name}
            label={a.name}
            onPress={() => nav.navigate(a.route)}
            style={{ alignItems: "center", gap: 8, padding: 8 }}
          >
            <View
              style={{
                width: 49,
                height: 49,
                backgroundColor: c.soft,
                borderRadius: 17,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={a.icon} color={c.primary} />
            </View>
            <T size={12} weight="medium">
              {a.name}
            </T>
          </Tap>
        ))}
      </Row>

      <Section title="Wallet controls" />
      <View style={ui.card}>
        <Row style={{ justifyContent: "space-between" }}>
          <Row style={{ gap: 12 }}>
            <Icon name="eye" size={20} />
            <T size={14}>Show balance</T>
          </Row>
          <Switch
            accessibilityLabel="Show balance"
            value={show}
            onValueChange={setShow}
            trackColor={{ true: c.primary, false: c.line }}
          />
        </Row>
        <View style={styles.divider} />
        <Row style={{ justifyContent: "space-between" }}>
          <Row style={{ gap: 12 }}>
            <Icon name="freeze" size={20} />
            <T size={14}>Freeze card</T>
          </Row>
          <Switch
            accessibilityLabel="Freeze card"
            value={frozen}
            onValueChange={setFrozen}
            trackColor={{ true: c.primary, false: c.line }}
          />
        </Row>
      </View>
      <Section
        title="Recent activity"
        action="View all"
        onPress={() => nav.navigate("Main", { tab: "Activity" })}
      />
      {state.transactions.length ? (
        state.transactions
          .slice(0, 4)
          .map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              onPress={() => nav.navigate("Receipt", { id: tx.id })}
            />
          ))
      ) : (
        <Empty
          icon="wallet"
          title="A fresh start"
          description="Your payments and bookings, all together."
          action="Make a payment"
          onPress={() => nav.navigate("Transfer")}
        />
      )}
    </ScrollView>
  );
}
export function TransactionRow({
  transaction: tx,
  onPress,
}: {
  transaction: any;
  onPress: () => void;
}) {
  const icon =
    tx.kind === "topup"
      ? "plus"
      : tx.kind === "booking"
        ? "ticket"
        : tx.kind === "order"
          ? "bag"
          : tx.kind === "insurance"
            ? "shield"
            : "send";
  return (
    <Tap
      onPress={onPress}
      label={`${tx.title}, ${money(tx.amount)}`}
      style={{
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: c.line,
      }}
    >
      <Row style={{ gap: 13 }}>
        <View
          style={{ padding: 12, borderRadius: 15, backgroundColor: c.soft }}
        >
          <Icon name={icon} size={20} color={c.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <T size={14} weight="bold">
            {tx.title}
          </T>
          <T size={11} color={c.muted}>
            {format(new Date(tx.createdAt), "d MMM · HH:mm")} · {tx.status}
          </T>
        </View>
        <T
          weight="bold"
          size={14}
          color={tx.kind === "topup" ? c.primary : c.ink}
        >
          {tx.kind === "topup" ? "+" : "−"}
          {money(tx.amount)}
        </T>
      </Row>
    </Tap>
  );
}
function Activity() {
  const nav = useNavigation();
  const tx = useApp((s) => s.transactions);
  const [filter, setFilter] = useState("All");
  const filtered = tx.filter(
    (t) =>
      filter === "All" ||
      (filter === "Bookings" && t.kind === "booking") ||
      (filter === "Payments" &&
        ["payment", "bill", "insurance", "topup"].includes(t.kind)) ||
      (filter === "Orders" && t.kind === "order"),
  );
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <T size={13} color={c.muted}>
        All the little things, together
      </T>
      <T size={30} weight="display" style={styles.pageTitle}>
        Your activity.
      </T>
      <Chips
        values={["All", "Payments", "Bookings", "Orders"]}
        value={filter}
        onChange={setFilter}
      />
      <View style={{ marginTop: 15 }}>
        {filtered.length ? (
          filtered.map((t) => (
            <TransactionRow
              key={t.id}
              transaction={t}
              onPress={() => nav.navigate("Receipt", { id: t.id })}
            />
          ))
        ) : (
          <Empty
            icon="clock"
            title="Your story starts here"
            description="Your bookings, orders and payments appear here."
            action="Explore Zedd"
            onPress={() => nav.navigate("Main", { tab: "Explore" })}
          />
        )}
      </View>
    </ScrollView>
  );
}
function Profile() {
  const nav = useNavigation();
  const state = useApp();
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <T size={29} weight="display" style={styles.pageTitle}>
        A little more you.
      </T>
      <View style={{ alignItems: "center", paddingVertical: 24, gap: 8 }}>
        <View
          style={{
            width: 82,
            height: 82,
            borderRadius: 30,
            backgroundColor: c.mint,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <T size={30} weight="display" color={c.primary}>
            {state.name.slice(0, 1).toUpperCase()}
          </T>
        </View>
        <T size={23} weight="display">
          {state.name}
        </T>
        <T size={13} color={c.muted}>
          {state.city} · Zedd Explorer
        </T>
        <Tag text="Zedd Explorer" />
      </View>
      <View style={{ gap: 10 }}>
        {[
          {
            icon: "user",
            name: "Personal details",
            sub: "Your name, city and delivery address",
            route: "ProfileEdit",
          },
          {
            icon: "heart",
            name: "Saved collection",
            sub: `${state.saved.length} things worth coming back to`,
            route: "Saved",
          },
          {
            icon: "bag",
            name: "Your bag",
            sub: `${state.cart.reduce((a, l) => a + l.quantity, 0)} items, waiting for you`,
            route: "Cart",
          },
          {
            icon: "bell",
            name: "Notifications",
            sub: "Updates that matter to you",
            route: "Notifications",
          },
          {
            icon: "help",
            name: "Here to help",
            sub: "Answers, guidance and a human touch",
            route: "Help",
          },
          {
            icon: "info",
            name: "About this MVP",
            sub: "Thoughtfully built. Just getting started.",
            route: "About",
          },
        ].map((a) => (
          <Tap
            key={a.route}
            label={a.name}
            onPress={() => nav.navigate(a.route)}
            style={styles.serviceRow}
          >
            <Icon name={a.icon} color={c.primary} />
            <View style={{ flex: 1 }}>
              <T size={15} weight="medium">
                {a.name}
              </T>
              <T size={12} color={c.muted}>
                {a.sub}
              </T>
            </View>
            <Icon name="right" size={17} color={c.muted} />
          </Tap>
        ))}
      </View>
      <View style={{ alignItems: "center", marginTop: 36, gap: 8 }}>
        <Brand small />
        <T size={11} color={c.muted}>
          Everyday, beautifully connected.
        </T>
        <T size={10} color={c.muted}>
          VERSION 1.0.0 · MVP
        </T>
      </View>
    </ScrollView>
  );
}
export const styles = StyleSheet.create({
  page: { padding: 24, paddingBottom: 40 },
  pageTitle: { letterSpacing: -1, marginTop: 4, marginBottom: 19 },
  tabbar: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,.98)",
    borderTopWidth: 1,
    borderColor: c.line,
    paddingHorizontal: 8,
  },
  tabIcon: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 18 },
  walletCard: {
    backgroundColor: c.primary,
    borderRadius: 23,
    padding: 22,
    overflow: "hidden",
  },
  orbit: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 160,
    borderWidth: 35,
    borderColor: "rgba(210,233,187,.035)",
    right: -80,
    top: -90,
    transform: [{ rotate: "-25deg" }],
  },
  orbit2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 120,
    borderWidth: 25,
    borderColor: "rgba(210,233,187,.035)",
    right: -70,
    top: 20,
  },
  accountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(220,240,210,.2)",
  },
  walletAction: {
    paddingVertical: 12,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,.11)",
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 6,
    marginHorizontal: -8,
  },
  serviceIcon: {
    height: 48,
    width: 48,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  travelCard: { borderRadius: 20, overflow: "hidden" },
  photoShade: {
    position: "absolute",
    bottom: 0,
    height: 92,
    width: "100%",
    backgroundColor: "rgba(7,33,22,.52)",
  },
  insurance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 17,
    backgroundColor: "#F1F2F6",
    borderRadius: 18,
  },
  shopFeature: {
    flexDirection: "row",
    backgroundColor: "#EFEFE5",
    overflow: "hidden",
    borderRadius: 20,
  },
  serviceRow: {
    padding: 15,
    backgroundColor: c.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.line,
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
  },
  divider: { height: 1, backgroundColor: c.line, marginVertical: 18 },
});
