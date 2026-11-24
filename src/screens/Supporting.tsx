import { MotionScrollView as ScrollView } from "../components/MotionScrollView";
import React, { useState, useEffect } from "react";
import { View, Switch, Animated, Platform } from "react-native";
import { useNavigation, useRoute } from "../lib/navigation";
import { format } from "date-fns";
import { z } from "zod";
import {
  T,
  Row,
  Icon,
  Tap,
  Button,
  Field,
  Tag,
  InfoBox,
  Empty,
  Brand,
  ItemCard,
  Chips,
  Section,
  useNotice,
  useReducedMotion,
  s as ui,
} from "../components/ui";
import { colors as c, money } from "../theme";
import { useApp } from "../store/useApp";
import { allItems } from "../lib/catalog";
import { parseAmount } from "../lib/domain";
import { SummaryLine } from "./Commerce";
export function Confirmation() {
  const nav = useNavigation();
  const { id } = useRoute().params;
  const tx = useApp((s) => s.transactions.find((t) => t.id === id));
  const reduced = useReducedMotion();
  const [scale] = useState(() => new Animated.Value(0.6));
  const [fade] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: Platform.OS !== "web",
        damping: 13,
        stiffness: 160,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: reduced ? 0 : 450,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [fade, scale, reduced]);
  if (!tx)
    return (
      <Empty
        title="Receipt not found"
        description="Find your latest activity in the Activity tab."
        action="View activity"
        onPress={() => nav.navigate("Main", { tab: "Activity" })}
      />
    );
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 26,
        paddingBottom: 40,
        flexGrow: 1,
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          alignItems: "center",
          opacity: fade,
          transform: [{ scale }],
          paddingVertical: 22,
        }}
      >
        <View
          style={{
            width: 94,
            height: 94,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 35,
            backgroundColor: c.mint,
            marginBottom: 24,
          }}
        >
          <Icon name="check" size={46} color={c.primary} stroke={1.7} />
        </View>
        <Tag text="SAVED TO YOUR ACTIVITY" />
        <T
          weight="display"
          size={31}
          style={{ letterSpacing: -1, marginTop: 14, textAlign: "center" }}
        >
          {tx.kind === "booking"
            ? "You’re all set."
            : tx.kind === "topup"
              ? "Ready for more."
              : "Consider it done."}
        </T>
        <T
          color={c.muted}
          size={14}
          style={{ textAlign: "center", marginTop: 11, maxWidth: 300 }}
        >
          {tx.kind === "booking"
            ? "Your reservation is saved."
            : tx.kind === "order"
              ? "Your order is saved."
              : "Saved to your activity."}
        </T>
      </Animated.View>
      <View style={[ui.card, { marginTop: 15, marginBottom: 22 }]}>
        <T weight="bold" size={17}>
          {tx.title}
        </T>
        <T size={13} color={c.muted} style={{ marginTop: 5 }}>
          {tx.subtitle}
        </T>
        <View
          style={{ height: 1, backgroundColor: c.line, marginVertical: 17 }}
        />
        <SummaryLine label="Amount" value={money(tx.amount)} bold />
        <SummaryLine label="Reference" value={tx.reference} />
        <SummaryLine label="Status" value={tx.status} />
      </View>

      <View style={{ marginTop: 25, gap: 12 }}>
        <Button
          title="View receipt"
          onPress={() => nav.replace("Receipt", { id: tx.id })}
        />
        <Button
          secondary
          title="Back to everyday"
          onPress={() =>
            nav.reset({
              index: 0,
              routes: [{ name: "Main", params: { tab: "Home" } }],
            })
          }
        />
      </View>
    </ScrollView>
  );
}
export function Receipt() {
  const nav = useNavigation();
  const { id } = useRoute().params;
  const tx = useApp((s) => s.transactions.find((t) => t.id === id));
  if (!tx)
    return (
      <Empty
        title="Nothing to show yet"
        description="This receipt isn’t on this device."
        action="View activity"
        onPress={() => nav.navigate("Main", { tab: "Activity" })}
      />
    );
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      <View style={[ui.card, { padding: 25 }]}>
        <Row style={{ justifyContent: "space-between" }}>
          <Brand small />
          <Tag text="ZEDD RECEIPT" />
        </Row>
        <View style={{ alignItems: "center", paddingVertical: 29 }}>
          <Icon name="success" size={40} color={c.primary} />
          <T
            size={34}
            weight="display"
            style={{ letterSpacing: -1, marginTop: 15 }}
          >
            {money(tx.amount)}
          </T>
          <T color={c.muted} size={13} style={{ marginTop: 6 }}>
            {tx.status}
          </T>
        </View>
        <T size={19} weight="bold">
          {tx.title}
        </T>
        <T color={c.muted} size={14} style={{ marginTop: 7 }}>
          {tx.subtitle}
        </T>
        <View
          style={{ height: 1, backgroundColor: c.line, marginVertical: 20 }}
        />
        <T color={c.muted} size={14} style={{ lineHeight: 25 }}>
          {tx.details}
        </T>
        <View
          style={{ height: 1, backgroundColor: c.line, marginVertical: 20 }}
        />
        <SummaryLine label="Reference" value={tx.reference} />
        <SummaryLine
          label="Date"
          value={format(new Date(tx.createdAt), "d MMM yyyy, HH:mm")}
        />
        <SummaryLine label="Currency" value="AUD" />
        <SummaryLine label="Method" value="Zedd wallet" />
      </View>

      <View style={{ marginTop: 23 }}>
        <Button
          secondary
          title="All activity"
          onPress={() => nav.navigate("Main", { tab: "Activity" })}
        />
      </View>
    </ScrollView>
  );
}
export function ProfileEdit() {
  const nav = useNavigation();
  const profile = useApp((s) => s.profile);
  const state = useApp();
  const [name, setName] = useState(state.name);
  const [city, setCity] = useState(state.city);
  const [address, setAddress] = useState(state.address);
  const [error, setError] = useState("");
  const notice = useNotice();
  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <T
        size={28}
        weight="display"
        style={{ letterSpacing: -1, marginBottom: 12 }}
      >
        Make yourself at home.
      </T>
      <T size={14} color={c.muted} style={{ marginBottom: 26 }}>
        A few details to make Zedd feel more like you.
      </T>
      <Field
        label="Your first name"
        value={name}
        onChangeText={setName}
        placeholder="Alex"
        maxLength={30}
        autoCapitalize="words"
      />
      <Field
        label="Your city"
        value={city}
        onChangeText={setCity}
        placeholder="Sydney"
        maxLength={40}
      />
      <Field
        label="Delivery address (optional)"
        value={address}
        onChangeText={setAddress}
        placeholder="Street, suburb and postcode"
        multiline
        numberOfLines={3}
        maxLength={250}
      />
      {!!error && (
        <T
          accessibilityRole="alert"
          color={c.red}
          size={14}
          style={{ marginBottom: 16 }}
        >
          {error}
        </T>
      )}
      <Button
        title="Save details"
        onPress={() => {
          if (
            !z
              .object({
                name: z.string().trim().min(2).max(30),
                city: z.string().trim().min(2).max(40),
              })
              .safeParse({ name, city }).success
          ) {
            setError(
              "Please enter a name and city with at least two characters.",
            );
            return;
          }
          profile({
            name: name.trim(),
            city: city.trim(),
            address: address.trim(),
          });
          notice("Your details are saved. Make yourself at home.");
          nav.goBack();
        }}
      />
    </ScrollView>
  );
}
export function Saved() {
  const nav = useNavigation();
  const ids = useApp((s) => s.saved);
  const items = allItems.filter((i) => ids.includes(i.id));
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      <T
        size={28}
        weight="display"
        style={{ letterSpacing: -1, marginBottom: 23 }}
      >
        Worth coming back to.
      </T>
      {items.length ? (
        items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onPress={() => nav.navigate("Detail", { item })}
          />
        ))
      ) : (
        <Empty
          icon="heart"
          title="A collection of you."
          description="Save a favourite stay, a thoughtful gift or your next great find. We’ll keep it here."
          action="Find something good"
          onPress={() => nav.navigate("Main", { tab: "Explore" })}
        />
      )}
    </ScrollView>
  );
}
export function Notifications() {
  const enabled = useApp((s) => s.notifications);
  const profile = useApp((s) => s.profile);
  const transactions = useApp((s) => s.transactions);
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      <T
        size={28}
        weight="display"
        style={{ letterSpacing: -1, marginBottom: 10 }}
      >
        Just the good updates.
      </T>
      <T size={14} color={c.muted}>
        A quieter kind of connected.
      </T>
      <Row
        style={[
          ui.card,
          { justifyContent: "space-between", marginTop: 25, gap: 15 },
        ]}
      >
        <View style={{ flex: 1 }}>
          <T size={15} weight="bold">
            In-app activity updates
          </T>
          <T size={12} color={c.muted} style={{ marginTop: 4 }}>
            Keep up with your activity.
          </T>
        </View>
        <Switch
          accessibilityLabel="In-app activity updates"
          value={enabled}
          onValueChange={(notifications) => profile({ notifications })}
          trackColor={{ true: c.primary, false: c.line }}
        />
      </Row>
      <Section title="Your updates" />
      {enabled && transactions.length ? (
        transactions.slice(0, 8).map((tx) => (
          <View
            key={tx.id}
            style={{
              paddingVertical: 17,
              borderBottomWidth: 1,
              borderColor: c.line,
            }}
          >
            <Row style={{ gap: 12, alignItems: "flex-start" }}>
              <Icon name="checks" color={c.primary} size={22} />
              <View style={{ flex: 1 }}>
                <T size={14} weight="bold">
                  {tx.title}
                </T>
                <T size={13} color={c.muted} style={{ marginTop: 5 }}>
                  Your {tx.kind} is {tx.status.toLowerCase()}.
                </T>
                <T size={11} color={c.muted} style={{ marginTop: 7 }}>
                  {format(new Date(tx.createdAt), "d MMM, HH:mm")}
                </T>
              </View>
            </Row>
          </View>
        ))
      ) : (
        <Empty
          icon="bell"
          title={enabled ? "All caught up." : "A little quiet time."}
          description={
            enabled
              ? "Your updates will appear here."
              : "In-app updates are paused. You can turn them back on whenever you like."
          }
        />
      )}
    </ScrollView>
  );
}
const faqs = [
  {
    q: "Is this real money?",
    a: "No. The MVP uses a simulated wallet and sample inventory. Payments update the wallet balance only. No money is sent or charged.",
  },
  {
    q: "Will my booking be sent to a hotel?",
    a: "No external booking is made. You can explore a complete reservation journey, and the confirmation is saved on this device.",
  },
  {
    q: "Where are my orders and receipts?",
    a: "Open Activity in the bottom navigation. Filter by Payments, Bookings or Orders, then tap any activity to see its receipt.",
  },
  {
    q: "How do I add money?",
    a: "Open Pay and select Add money. Choose an amount up to A$10,000 and tap Add money. No bank account or card is needed.",
  },
  {
    q: "Can I contact a marketplace seller?",
    a: "This MVP saves enquiries locally. It does not message real sellers or publish your contact details.",
  },
  {
    q: "Where is my data stored?",
    a: "Zedd Explorer details, saved items, cart and activity are stored on this device using local storage. Clearing app/browser storage resets them.",
  },
];
export function Help() {
  const [open, setOpen] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const entries = faqs.filter((f) =>
    `${f.q} ${f.a}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Icon name="help" size={33} color={c.primary} />
      <T
        size={29}
        weight="display"
        style={{ letterSpacing: -1, marginTop: 18 }}
      >
        A little help goes a long way.
      </T>
      <T size={14} color={c.muted} style={{ marginTop: 12, marginBottom: 24 }}>
        Clear answers, whenever you need them.
      </T>
      <Field
        label="Find an answer"
        value={query}
        onChangeText={setQuery}
        placeholder="Try payments, bookings or data"
      />
      {entries.map((f, i) => (
        <View
          key={f.q}
          style={{
            borderBottomWidth: 1,
            borderColor: c.line,
            paddingVertical: 18,
          }}
        >
          <Tap label={f.q} onPress={() => setOpen(open === i ? null : i)}>
            <Row style={{ gap: 15 }}>
              <T size={15} weight="bold" style={{ flex: 1 }}>
                {f.q}
              </T>
              <Icon name={open === i ? "minus" : "plus"} size={18} />
            </Row>
          </Tap>
          {open === i && (
            <T
              size={14}
              color={c.muted}
              style={{ marginTop: 14, lineHeight: 23 }}
            >
              {f.a}
            </T>
          )}
        </View>
      ))}
      {!entries.length && (
        <Empty
          title="Try another question"
          description="Try payments, bookings or receipts."
        />
      )}
    </ScrollView>
  );
}
export function About() {
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      <View style={{ alignItems: "center", paddingVertical: 30 }}>
        <Brand />
        <T
          size={27}
          weight="display"
          style={{ textAlign: "center", letterSpacing: -0.7, marginTop: 22 }}
        >
          Everyday,{`\n`}beautifully connected.
        </T>
        <T
          size={14}
          color={c.muted}
          style={{ textAlign: "center", marginTop: 16, lineHeight: 23 }}
        >
          A considered home for the things you do every day. Pay, explore,
          discover and make a little more room for life.
        </T>
      </View>
      <Section title="Built for a better everyday" />
      <T size={14} color={c.muted} style={{ lineHeight: 24 }}>
        Zedd is a React Native MVP for iOS, Android and the mobile web. This
        version brings payments, services and your activity together in one
        place.
      </T>
      <View style={{ marginTop: 24 }}>
        <InfoBox icon="shield">
          All prices, listings, availability and transactions are illustrative.
          No real financial, travel, medical, delivery or insurance services are
          connected in this preview environment.
        </InfoBox>
      </View>
      <T size={13} color={c.muted} style={{ marginTop: 25 }}>
        Original Zedd mark and selected editorial images created for this
        project. Additional editorial photography: Unsplash.
      </T>
      <T size={12} color={c.muted} style={{ marginTop: 25 }}>
        Zedd · Version 1.0.0 · © 2026
      </T>
    </ScrollView>
  );
}
export function CreateListing() {
  const nav = useNavigation();
  const add = useApp((s) => s.addListing);
  const notice = useNotice();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Lifestyle");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <T
        size={28}
        weight="display"
        style={{ letterSpacing: -1, marginBottom: 12 }}
      >
        Make room for a new story.
      </T>
      <T size={14} color={c.muted} style={{ marginBottom: 24 }}>
        Give something a new beginning.
      </T>
      <Field
        label="Listing title"
        value={name}
        onChangeText={setName}
        placeholder="What would you like to list?"
        maxLength={80}
      />
      <T size={14} weight="medium" style={{ marginBottom: 10 }}>
        Category
      </T>
      <Chips
        values={["Lifestyle", "Cars", "Homes"]}
        value={category}
        onChange={setCategory}
      />
      <View style={{ marginTop: 20 }}>
        <Field
          label="Price (AUD)"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          placeholder="0.00"
          maxLength={12}
        />
        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Tell its story…"
          multiline
          numberOfLines={4}
          maxLength={600}
        />
      </View>

      {!!error && (
        <T
          color={c.red}
          size={14}
          accessibilityRole="alert"
          style={{ marginTop: 15 }}
        >
          {error}
        </T>
      )}
      <View style={{ marginTop: 24 }}>
        <Button
          title="Save listing"
          onPress={() => {
            const amount = parseAmount(price);
            if (
              name.trim().length < 4 ||
              description.trim().length < 10 ||
              !amount
            ) {
              setError(
                "Add a title (4+ characters), description (10+ characters), and valid price.",
              );
              return;
            }
            add({
              name: name.trim(),
              category,
              price: amount,
              description: description.trim(),
            });
            notice("Your listing is saved.");
            nav.goBack();
          }}
        />
      </View>
    </ScrollView>
  );
}
