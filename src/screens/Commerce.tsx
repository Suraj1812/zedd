import { MotionScrollView as ScrollView } from "../components/MotionScrollView";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "../lib/navigation";
import {
  addDays,
  format,
  isValid,
  parseISO,
  startOfDay,
  isBefore,
} from "date-fns";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import {
  T,
  Row,
  Icon,
  Tap,
  Button,
  Chips,
  SearchField,
  ItemCard,
  Section,
  Tag,
  Picture,
  Counter,
  Empty,
  Field,
  useNotice,
  s as ui,
} from "../components/ui";
import { colors as c, money } from "../theme";
import { DateField } from "../components/DateField";
import { useApp } from "../store/useApp";
import {
  hotels,
  restaurants,
  products,
  marketplace,
  serviceOffers,
  menuFor,
  type Item,
  type ServiceKey,
} from "../lib/catalog";
import { orderTotal, type TransactionKind } from "../lib/domain";
export function Catalog() {
  const nav = useNavigation();
  const route = useRoute();
  const service: ServiceKey = route.params.service;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState(false);
  const listings = useApp((s) => s.listings);
  const base =
    service === "Hotels"
      ? hotels
      : service === "Food"
        ? restaurants
        : service === "Shop"
          ? products
          : service === "Marketplace"
            ? marketplace
            : serviceOffers(service);
  const categories = ["All", ...new Set(base.map((i) => i.category))];
  const items = base
    .filter(
      (i) =>
        (category === "All" || category === i.category) &&
        `${i.name} ${i.subtitle}`.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => (sort ? a.price - b.price : 0));
  const title =
    service === "Hotels"
      ? "Stay somewhere special."
      : service === "Food"
        ? "What sounds good?"
        : service === "Shop"
          ? "Good things, thoughtfully made."
          : service === "Marketplace"
            ? "Your next great find."
            : service === "Health"
              ? "Make time for you."
              : `Let’s go ${service === "Events" ? "make a memory" : "somewhere"}.`;
  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <T
        size={11}
        weight="bold"
        color={c.muted}
        style={{ letterSpacing: 1.5, marginBottom: 9 }}
      >
        ZEDD {service.toUpperCase()}
      </T>
      <T
        size={29}
        weight="display"
        style={{ letterSpacing: -1, lineHeight: 37, marginBottom: 10 }}
      >
        {title}
      </T>
      <T color={c.muted} size={14} style={{ marginBottom: 22 }}>
        {service === "Hotels"
          ? "Considered spaces. Memorable places."
          : service === "Food"
            ? "Your local favourites, at your doorstep."
            : service === "Shop"
              ? "A little discovery, a little everyday joy."
              : service === "Marketplace"
                ? "Discover cars, homes and one-of-a-kind finds."
                : "Find your fit, choose your details, and you’re on your way."}
      </T>
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={`Search ${service.toLowerCase()}${service === "Hotels" ? " or destinations" : ""}`}
      />
      <Row style={{ justifyContent: "space-between", marginVertical: 17 }}>
        <T color={c.muted} size={12}>
          {items.length}{" "}
          {service === "Hotels"
            ? "stays"
            : service === "Food"
              ? "places"
              : "options"}{" "}
          to discover
        </T>
        <Tap
          label={sort ? "Sort by recommended" : "Sort by lowest price"}
          onPress={() => setSort(!sort)}
          style={{ padding: 5 }}
        >
          <Row style={{ gap: 5 }}>
            <Icon name="sliders" size={16} />
            <T size={12} weight="medium">
              {sort ? "Price: low to high" : "Recommended"}
            </T>
          </Row>
        </Tap>
      </Row>
      {categories.length > 2 && (
        <View style={{ marginBottom: 20 }}>
          <Chips values={categories} value={category} onChange={setCategory} />
        </View>
      )}
      {service === "Marketplace" && (
        <View style={{ marginBottom: 22 }}>
          <Button
            secondary
            title="Create a listing"
            icon="plus"
            onPress={() => nav.navigate("CreateListing")}
          />
        </View>
      )}
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onPress={() => nav.navigate("Detail", { item })}
        />
      ))}
      {!items.length && (
        <Empty
          title="No matches this time"
          description="Try a different destination, name or category."
          action="Reset filters"
          onPress={() => {
            setQuery("");
            setCategory("All");
          }}
        />
      )}
      {service === "Marketplace" && listings.length > 0 && (
        <>
          <Section title="Your listings" />
          {listings.map((l) => (
            <View key={l.id} style={[ui.card, { marginBottom: 12 }]}>
              <Tag text="Draft" />
              <T weight="bold" style={{ marginTop: 8 }}>
                {l.name}
              </T>
              <T color={c.muted} size={13}>
                {l.description}
              </T>
              <T weight="bold" style={{ marginTop: 8 }}>
                {money(l.price)}
              </T>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
export function Detail() {
  const nav = useNavigation();
  const { item } = useRoute().params as { item: Item };
  const notice = useNotice();
  const cart = useApp((s) => s.cart);
  const add = useApp((s) => s.addLine);
  const saved = useApp((s) => s.saved.includes(item.id));
  const toggle = useApp((s) => s.toggleSaved);
  const enquiry = useApp((s) => s.enquiries.includes(item.id));
  const enquire = useApp((s) => s.enquire);
  const [nights, setNights] = useState(2);
  const [guests, setGuests] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(
    format(addDays(new Date(), 3), "yyyy-MM-dd"),
  );
  const [dateError, setDateError] = useState("");
  const [contact, setContact] = useState("");
  const insets = useSafeAreaInsets();
  const addProduct = () => {
    let error: string | null = null;
    for (let i = 0; i < quantity; i++) {
      error = add({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        merchant: item.kind === "shop" ? "Zedd Shop" : item.name,
        kind: "shop",
      });
      if (error) break;
    }
    if (error) notice(error);
    else {
      notice("A good choice. Added to your bag.");
      nav.navigate("Cart");
    }
  };
  const book = () => {
    const parsed = parseISO(date);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !isValid(parsed) ||
      isBefore(parsed, startOfDay(new Date()))
    ) {
      setDateError("Choose today or a future date in YYYY-MM-DD format.");
      return;
    }
    if (item.service === "Taxi" && contact.trim().length < 6) {
      setDateError("Add your pickup and destination.");
      return;
    }
    setDateError("");
    nav.navigate("Checkout", {
      title: item.name,
      subtitle: item.subtitle,
      kind: "booking",
      amount: item.price * (item.kind === "hotel" ? nights : quantity),
      details:
        item.kind === "hotel"
          ? `${format(parsed, "d MMM yyyy")} — ${format(addDays(parsed, nights), "d MMM yyyy")}\n${nights} nights · ${guests} guests\nBreakfast and taxes included`
          : `${format(parsed, "d MMM yyyy")}\n${quantity} ${item.service === "Car rental" ? "days" : item.service === "Events" ? "tickets" : "passengers"}\n${item.features[0]}${contact ? "\n" + contact : ""}`,
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View>
          <Picture
            source={item.image}
            accessibilityLabel={item.name}
            style={{ width: "100%", height: 300 }}
          />
          <View style={{ position: "absolute", top: 18, left: 22 }}>
            {!!item.badge && <Tag text={item.badge} dark />}
          </View>
          <View style={{ position: "absolute", top: 15, right: 18 }}>
            <Tap
              label={saved ? "Remove from saved" : "Save for later"}
              onPress={() => toggle(item.id)}
              style={{
                backgroundColor: c.white,
                padding: 12,
                borderRadius: 25,
              }}
            >
              <Icon
                name="heart"
                color={c.primary}
                fill={saved ? c.primary : "none"}
                size={20}
              />
            </Tap>
          </View>
        </View>
        <View style={{ padding: 24 }}>
          <Row style={{ justifyContent: "space-between", marginBottom: 10 }}>
            <T
              size={11}
              weight="bold"
              color={c.muted}
              style={{ letterSpacing: 1.4 }}
            >
              {item.kind === "hotel"
                ? "A STAY TO REMEMBER"
                : item.kind === "shop"
                  ? "THE ZEDD EDIT"
                  : item.category.toUpperCase()}
            </T>
            {!!item.rating && (
              <Row style={{ gap: 4 }}>
                <Icon
                  name="star"
                  size={14}
                  color={c.primary}
                  fill={c.primary}
                />
                <T size={13} weight="bold">
                  {item.rating}
                </T>
              </Row>
            )}
          </Row>
          <T
            size={29}
            weight="display"
            style={{ letterSpacing: -1, lineHeight: 36 }}
          >
            {item.name}
          </T>
          <Row style={{ gap: 5, marginTop: 8 }}>
            <Icon
              name={
                item.kind === "hotel" || item.kind === "market" ? "pin" : "leaf"
              }
              size={15}
              color={c.muted}
            />
            <T color={c.muted} size={13}>
              {item.subtitle}
            </T>
          </Row>
          <T
            size={14}
            color={c.muted}
            style={{ marginTop: 21, lineHeight: 23 }}
          >
            {item.description}
          </T>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 22,
            }}
          >
            {item.features.map((f) => (
              <View
                key={f}
                style={{
                  flexDirection: "row",
                  gap: 6,
                  alignItems: "center",
                  paddingHorizontal: 11,
                  paddingVertical: 9,
                  backgroundColor: c.soft,
                  borderRadius: 9,
                }}
              >
                <Icon name="check" size={13} color={c.primary} />
                <T size={12} color={c.primary}>
                  {f}
                </T>
              </View>
            ))}
          </View>
          {item.kind === "hotel" && (
            <>
              <Section title="Make yourself at home" />
              <DateField
                label="Check-in date"
                value={date}
                onChange={setDate}
                error={dateError}
              />
              <View style={ui.card}>
                <Row style={{ justifyContent: "space-between" }}>
                  <View>
                    <T size={14} weight="bold">
                      Nights
                    </T>
                    <T size={12} color={c.muted}>
                      Stay a little longer
                    </T>
                  </View>
                  <Counter
                    value={nights}
                    onChange={setNights}
                    max={14}
                    label="nights"
                  />
                </Row>
                <View style={styles.divider} />
                <Row style={{ justifyContent: "space-between" }}>
                  <View>
                    <T size={14} weight="bold">
                      Guests
                    </T>
                    <T size={12} color={c.muted}>
                      Room for your people
                    </T>
                  </View>
                  <Counter
                    value={guests}
                    onChange={setGuests}
                    max={4}
                    label="guests"
                  />
                </Row>
              </View>
            </>
          )}
          {item.kind === "food" && (
            <>
              <Section title="Made for your cravings" />
              {menuFor(item).map((dish) => {
                const q = cart.find((l) => l.id === dish.id)?.quantity || 0;
                return (
                  <View
                    key={dish.id}
                    style={{
                      paddingVertical: 17,
                      borderTopWidth: 1,
                      borderColor: c.line,
                    }}
                  >
                    <Row style={{ gap: 13, alignItems: "flex-start" }}>
                      <View style={{ flex: 1 }}>
                        <T weight="bold" size={16}>
                          {dish.name}
                        </T>
                        <T size={12} color={c.muted} style={{ marginTop: 5 }}>
                          {dish.description}
                        </T>
                        <T weight="bold" size={14} style={{ marginTop: 10 }}>
                          {money(dish.price)}
                        </T>
                      </View>
                      <Picture
                        source={dish.image}
                        style={{ width: 84, height: 84, borderRadius: 13 }}
                      />
                    </Row>
                    <Row style={{ justifyContent: "flex-end", marginTop: 10 }}>
                      {q ? (
                        <Counter
                          min={0}
                          value={q}
                          onChange={(v) => {
                            const error = add(
                              { ...dish, merchant: item.name, kind: "food" },
                              v - q,
                            );
                            if (error) notice(error);
                          }}
                          label={dish.name}
                        />
                      ) : (
                        <Tap
                          label={`Add ${dish.name}`}
                          onPress={() => {
                            const error = add({
                              ...dish,
                              merchant: item.name,
                              kind: "food",
                            });
                            if (error) notice(error);
                          }}
                          style={{
                            backgroundColor: c.soft,
                            borderRadius: 9,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                          }}
                        >
                          <Row style={{ gap: 7 }}>
                            <Icon name="plus" size={16} color={c.primary} />
                            <T size={13} weight="bold" color={c.primary}>
                              Add
                            </T>
                          </Row>
                        </Tap>
                      )}
                    </Row>
                  </View>
                );
              })}
            </>
          )}
          {item.kind === "shop" && (
            <>
              <Section title="A lovely addition" />
              <Row style={{ justifyContent: "space-between" }}>
                <T size={14}>Quantity</T>
                <Counter value={quantity} onChange={setQuantity} />
              </Row>
            </>
          )}
          {item.kind === "service" && (
            <>
              <Section title="Your reservation" />
              <DateField
                label="Travel date"
                value={date}
                onChange={setDate}
                error={dateError}
              />
              {["Taxi", "Car rental"].includes(item.service || "") && (
                <Field
                  label={
                    item.service === "Taxi"
                      ? "Pickup and destination"
                      : "Pickup location"
                  }
                  value={contact}
                  onChangeText={setContact}
                  placeholder="e.g. Central Station to Bondi Beach"
                />
              )}
              <Row style={{ justifyContent: "space-between" }}>
                <T size={14}>
                  {item.service === "Car rental"
                    ? "Rental days"
                    : "Guests / tickets"}
                </T>
                <Counter value={quantity} onChange={setQuantity} max={8} />
              </Row>
            </>
          )}
          {item.kind === "market" && (
            <>
              <Section title="Good finds start a conversation" />

              {enquiry && (
                <T color={c.primary} size={14} style={{ marginTop: 12 }}>
                  Your enquiry is saved.
                </T>
              )}
            </>
          )}
        </View>
      </ScrollView>
      <View
        style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 17) }]}
      >
        {item.kind === "food" ? (
          <Button
            title={
              cart.length
                ? `View bag · ${money(orderTotal(cart).total)}`
                : "Choose something delicious"
            }
            disabled={!cart.length}
            onPress={() => nav.navigate("Cart")}
            icon="bag"
          />
        ) : item.kind === "market" ? (
          <>
            <T size={21} weight="display" style={{ marginBottom: 12 }}>
              {money(item.price)}
            </T>
            <Button
              title={enquiry ? "Enquiry saved" : "Save an enquiry"}
              secondary={enquiry}
              onPress={() => {
                enquire(item.id);
                notice("Enquiry saved.");
              }}
              icon={enquiry ? "check" : "message"}
            />
          </>
        ) : (
          <>
            <Row style={{ justifyContent: "space-between", marginBottom: 12 }}>
              <View>
                <T size={12} color={c.muted}>
                  {item.kind === "hotel"
                    ? `${nights} nights · ${guests} guests`
                    : item.kind === "shop"
                      ? `${quantity} ${quantity === 1 ? "item" : "items"}`
                      : "Your total"}
                </T>
                <T size={24} weight="display">
                  {money(
                    item.price * (item.kind === "hotel" ? nights : quantity),
                  )}
                  <T size={12} color={c.muted}>
                    {" "}
                    AUD
                  </T>
                </T>
              </View>
              <T size={12} color={c.muted}>
                {item.kind === "hotel"
                  ? `${money(item.price)} / night`
                  : "Taxes included"}
              </T>
            </Row>
            <Button
              title={item.kind === "shop" ? "Add to bag" : "Review booking"}
              onPress={item.kind === "shop" ? addProduct : book}
              icon={item.kind === "shop" ? "bag" : "calendar"}
            />
          </>
        )}
      </View>
    </View>
  );
}
export function Cart() {
  const nav = useNavigation();
  const cart = useApp((s) => s.cart);
  const add = useApp((s) => s.addLine);
  const clear = useApp((s) => s.clearCart);
  const total = orderTotal(cart);
  const insets = useSafeAreaInsets();
  if (!cart.length)
    return (
      <View style={{ padding: 24, flex: 1, justifyContent: "center" }}>
        <Empty
          icon="bag"
          title="Room for a good find."
          description="Your bag is waiting for something lovely. Explore the shop or find your next favourite meal."
          action="Explore Zedd"
          onPress={() => nav.navigate("Main", { tab: "Explore" })}
        />
      </View>
    );
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <T size={12} color={c.muted}>
          {cart[0].kind === "food" ? cart[0].merchant : "THE ZEDD EDIT"}
        </T>
        <T
          size={29}
          weight="display"
          style={{ letterSpacing: -1, marginTop: 5, marginBottom: 24 }}
        >
          A bag full of good things.
        </T>
        {cart.map((line) => (
          <View
            key={line.id}
            style={{
              paddingVertical: 17,
              borderBottomWidth: 1,
              borderColor: c.line,
            }}
          >
            <Row style={{ gap: 15 }}>
              <Picture
                source={line.image}
                style={{ height: 76, width: 76, borderRadius: 13 }}
              />
              <View style={{ flex: 1 }}>
                <T size={15} weight="bold">
                  {line.name}
                </T>
                <T size={14} color={c.muted} style={{ marginTop: 4 }}>
                  {money(line.price)}
                </T>
              </View>
              <Tap
                label={`Remove ${line.name}`}
                onPress={() => add(line, -line.quantity)}
                style={{ padding: 5 }}
              >
                <Icon name="x" size={17} color={c.muted} />
              </Tap>
            </Row>
            <Row style={{ justifyContent: "space-between", marginTop: 14 }}>
              <T weight="bold" size={15}>
                {money(line.price * line.quantity)}
              </T>
              <Counter
                value={line.quantity}
                min={0}
                onChange={(v) => add(line, v - line.quantity)}
                label={line.name}
              />
            </Row>
          </View>
        ))}
        <Section title="The little details" />
        <SummaryLine label="Subtotal" value={money(total.subtotal)} />
        <SummaryLine
          label={cart[0].kind === "food" ? "Delivery" : "Delivery"}
          value={total.delivery ? money(total.delivery) : "Included"}
        />
        <SummaryLine label="Taxes" value="Included" />
        <View style={styles.divider} />
        <SummaryLine label="Total" value={money(total.total)} bold />
        <Tap
          label="Empty bag"
          onPress={clear}
          style={{ alignSelf: "center", padding: 15, marginTop: 12 }}
        >
          <T size={13} color={c.muted}>
            Empty bag
          </T>
        </Tap>
      </ScrollView>
      <View
        style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 17) }]}
      >
        <Button
          title={`Continue · ${money(total.total)}`}
          onPress={() =>
            nav.navigate("Checkout", {
              title:
                cart[0].kind === "food"
                  ? cart[0].merchant
                  : "Your Zedd Shop order",
              subtitle: `${cart.reduce((a, l) => a + l.quantity, 0)} items`,
              amount: total.total,
              kind: "order",
              details: cart
                .map(
                  (l) =>
                    `${l.quantity} × ${l.name} · ${money(l.price * l.quantity)}`,
                )
                .join("\n"),
              cart: true,
              requiresAddress: true,
            })
          }
        />
      </View>
    </View>
  );
}
export function SummaryLine({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <Row
      style={{ justifyContent: "space-between", gap: 16, marginVertical: 8 }}
    >
      <T
        size={bold ? 16 : 14}
        weight={bold ? "bold" : "regular"}
        color={bold ? c.ink : c.muted}
      >
        {label}
      </T>
      <T
        size={bold ? 18 : 14}
        weight={bold ? "bold" : "medium"}
        style={{ textAlign: "right", flexShrink: 1 }}
      >
        {value}
      </T>
    </Row>
  );
}
export function Checkout() {
  const nav = useNavigation();
  const params = useRoute().params as {
    title: string;
    subtitle: string;
    amount: number;
    kind: TransactionKind;
    details: string;
    cart?: boolean;
    requiresAddress?: boolean;
  };
  const state = useApp();
  const [address, setAddress] = useState(state.address);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [id] = useState(
    () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
  );
  const commit = () => {
    if (submitting) return;
    if (
      params.requiresAddress &&
      !z.string().trim().min(8).max(250).safeParse(address).success
    ) {
      setError("Please enter a full delivery address (at least 8 characters).");
      return;
    }
    if (params.cart && !state.cart.length) {
      setError("Your bag is empty. Add items before checking out.");
      return;
    }
    setSubmitting(true);
    const result = state.transact({
      id: id,
      title: params.title,
      subtitle: params.subtitle,
      amount: params.amount,
      kind: params.kind,
      details:
        params.details +
        (params.requiresAddress ? `\nDelivery address: ${address.trim()}` : ""),
      clearCart: params.cart,
    });
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      if (params.requiresAddress) state.profile({ address: address.trim() });
      nav.replace("Confirmation", { id: result.transaction!.id });
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <T
        size={29}
        weight="display"
        style={{ letterSpacing: -1, marginTop: 15 }}
      >
        Review & confirm
      </T>
      <T color={c.muted} size={14} style={{ marginTop: 9, marginBottom: 25 }}>
        Review your {params.kind === "booking" ? "reservation" : "payment"}.
      </T>
      <View style={ui.card}>
        <T weight="bold" size={18}>
          {params.title}
        </T>
        <T color={c.muted} size={13} style={{ marginTop: 4 }}>
          {params.subtitle}
        </T>
        <View style={styles.divider} />
        <T color={c.muted} size={14} style={{ lineHeight: 24 }}>
          {params.details}
        </T>
      </View>
      {params.requiresAddress && (
        <View style={{ marginTop: 25 }}>
          <Field
            label="Delivery address"
            placeholder="Street, suburb, city and postcode"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>
      )}
      <Section title="Payment method" />
      <Row style={[ui.card, { gap: 13 }]}>
        <View
          style={{ backgroundColor: c.soft, padding: 10, borderRadius: 13 }}
        >
          <Icon name="wallet" color={c.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <T size={15} weight="bold">
            Zedd wallet
          </T>
          <T size={12} color={c.muted}>
            {money(state.balance)} available
          </T>
        </View>
        <Icon name="success" color={c.primary} size={21} />
      </Row>
      <View style={{ marginTop: 22, marginBottom: 17 }}>
        <SummaryLine label="Total" value={money(params.amount)} bold />
        <SummaryLine label="Service fee" value="No fee" />
      </View>

      {!!error && (
        <T
          accessibilityRole="alert"
          color={c.red}
          size={14}
          style={{ marginTop: 16 }}
        >
          {error}
        </T>
      )}
      <View style={{ marginTop: 24 }}>
        <Button
          title={`Confirm ${params.kind === "booking" ? "booking" : "payment"}`}
          onPress={commit}
          loading={submitting}
          icon="lock"
        />
        {state.balance < params.amount && (
          <View style={{ marginTop: 12 }}>
            <Button
              secondary
              title="Add money"
              onPress={() => nav.navigate("TopUp")}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
export const styles = StyleSheet.create({
  bottom: {
    padding: 20,
    paddingTop: 15,
    backgroundColor: c.white,
    borderTopWidth: 1,
    borderColor: c.line,
  },
  divider: { height: 1, backgroundColor: c.line, marginVertical: 16 },
});
