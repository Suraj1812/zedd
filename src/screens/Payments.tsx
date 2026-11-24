import { MotionScrollView as ScrollView } from "../components/MotionScrollView";
import React, { useState } from "react";
import { View, Switch } from "react-native";
import { useNavigation } from "../lib/navigation";
import QRCode from "react-native-qrcode-svg";
import { z } from "zod";
import {
  T,
  Row,
  Icon,
  Tap,
  Button,
  Field,
  Tag,
  Chips,
  Section,
  Brand,
  Picture,
  s as ui,
} from "../components/ui";
import { SummaryLine } from "./Commerce";
import { colors as c, money } from "../theme";
import { images } from "../lib/catalog";
import { parseAmount } from "../lib/domain";
import { PaymentCard } from "../components/PaymentCard";
import { useApp } from "../store/useApp";
export function Transfer() {
  const nav = useNavigation();
  const balance = useApp((s) => s.balance);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const review = () => {
    const cents = parseAmount(amount);
    if (!z.string().trim().min(2).max(80).safeParse(recipient).success) {
      setError("Enter a recipient name with at least 2 characters.");
      return;
    }
    if (!cents) {
      setError("Enter a valid amount with up to two decimal places.");
      return;
    }
    if (cents > balance) {
      setError("Insufficient balance. Add money to continue.");
      return;
    }
    setError("");
    nav.navigate("Checkout", {
      title: `Payment to ${recipient.trim()}`,
      subtitle: "Transfer · AUD",
      amount: cents,
      kind: "payment",
      details: `Recipient: ${recipient.trim()}\n${note.trim() ? `Note: ${note.trim()}\n` : ""}`,
    });
  };
  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <T size={29} weight="display" style={{ letterSpacing: -1 }}>
        Send money
      </T>
      <T size={14} color={c.muted} style={{ marginTop: 12, marginBottom: 28 }}>
        Choose a contact and amount.
      </T>
      <Field
        label="Who’s it for?"
        value={recipient}
        onChangeText={setRecipient}
        placeholder="Recipient name"
        autoCapitalize="words"
        maxLength={80}
      />
      <T size={13} color={c.muted} style={{ marginBottom: 9 }}>
        Your people
      </T>
      <Row style={{ gap: 10, marginBottom: 25 }}>
        {["Sam", "Amelia", "Oliver"].map((name, i) => (
          <Tap
            key={name}
            label={`Select ${name}`}
            onPress={() => setRecipient(name)}
            style={{ alignItems: "center", gap: 7, paddingHorizontal: 10 }}
          >
            <Picture
              source={[images.sam, images.amelia, images.oliver][i]}
              style={{ width: 52, height: 52, borderRadius: 21 }}
              accessibilityLabel={name}
            />
            <T size={12}>{name}</T>
          </Tap>
        ))}
      </Row>
      <Field
        label="Amount (AUD)"
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
        maxLength={12}
        style={{ fontSize: 30, paddingVertical: 20 }}
      />
      <T size={12} color={c.muted} style={{ marginTop: -10, marginBottom: 22 }}>
        Available: {money(balance)}
      </T>
      <Field
        label="Add a note (optional)"
        value={note}
        onChangeText={setNote}
        placeholder="Dinner, a thank you, just because…"
        maxLength={120}
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

      <View style={{ marginTop: 25 }}>
        <Button title="Review transfer" onPress={review} />
      </View>
    </ScrollView>
  );
}
export function TopUp() {
  const nav = useNavigation();
  const balance = useApp((s) => s.balance);
  const transact = useApp((s) => s.transact);
  const [amount, setAmount] = useState("100");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: "center", paddingVertical: 22 }}>
        <View
          style={{ padding: 21, borderRadius: 29, backgroundColor: c.mint }}
        >
          <Icon name="plus" color={c.primary} size={32} />
        </View>
        <T
          size={28}
          weight="display"
          style={{ letterSpacing: -1, marginTop: 20 }}
        >
          A little room to explore.
        </T>
        <T
          size={14}
          color={c.muted}
          style={{ textAlign: "center", marginTop: 10 }}
        >
          Choose an amount for your wallet.
        </T>
      </View>
      <Field
        label="Add money (AUD)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        maxLength={10}
      />
      <Row style={{ gap: 9, marginBottom: 25 }}>
        {["50", "100", "500", "1000"].map((v) => (
          <View key={v} style={{ flex: 1 }}>
            <Tap
              label={`Add ${v} Australian dollars`}
              onPress={() => setAmount(v)}
              style={{
                paddingVertical: 12,
                borderRadius: 11,
                alignItems: "center",
                borderWidth: 1,
                borderColor: amount === v ? c.primary : c.line,
                backgroundColor: amount === v ? c.soft : c.white,
              }}
            >
              <T size={13} weight="bold">
                ${v}
              </T>
            </Tap>
          </View>
        ))}
      </Row>
      <SummaryLine label="Current balance" value={money(balance)} />
      <SummaryLine
        label="After top-up"
        value={money(balance + (parseAmount(amount) || 0))}
      />

      {!!error && (
        <T color={c.red} accessibilityRole="alert" style={{ marginBottom: 15 }}>
          {error}
        </T>
      )}
      <Button
        title="Add money"
        loading={busy}
        onPress={() => {
          const value = parseAmount(amount);
          if (!value || value < 100 || value > 1000000) {
            setError("Enter an amount between A$1 and A$10,000.");
            return;
          }
          setBusy(true);
          const result = transact({
            id: `topup-${Date.now()}`,
            title: "Wallet top-up",
            subtitle: "Wallet credit",
            amount: value,
            kind: "topup",
            details: "Wallet balance updated.",
          });
          if (result.error) {
            setError(result.error);
            setBusy(false);
          } else nav.replace("Confirmation", { id: result.transaction!.id });
        }}
      />
    </ScrollView>
  );
}
export function Receive() {
  const name = useApp((s) => s.name);
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        paddingBottom: 40,
        alignItems: "center",
      }}
    >
      <Tag text="YOUR PERSONAL SPACE" />
      <T
        size={29}
        weight="display"
        style={{ marginTop: 16, letterSpacing: -1 }}
      >
        Say hello to simple.
      </T>
      <T
        color={c.muted}
        size={14}
        style={{ textAlign: "center", marginTop: 12, marginBottom: 30 }}
      >
        One code. Simply connected.
      </T>
      <View
        style={{
          backgroundColor: c.white,
          padding: 32,
          borderRadius: 28,
          borderColor: c.line,
          borderWidth: 1,
          alignItems: "center",
          gap: 24,
        }}
      >
        <Brand small />
        <QRCode
          value={`zedd://receive/${encodeURIComponent(name.toLowerCase())}`}
          size={205}
          color={c.primary}
          backgroundColor={c.white}
        />
        <T weight="bold" size={18}>
          {name} · Zedd Explorer
        </T>
        <T size={12} color={c.muted}>
          YOUR ZEDD ID
        </T>
      </View>
    </ScrollView>
  );
}
export function Card() {
  const frozen = useApp((s) => s.cardFrozen);
  const setProfile = useApp((s) => s.profile);
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      <T size={29} weight="display" style={{ letterSpacing: -1 }}>
        Considered in every detail.
      </T>
      <T color={c.muted} size={14} style={{ marginTop: 10, marginBottom: 26 }}>
        Your everyday companion.
      </T>
      <PaymentCard />
      <Section title="You’re in control" />
      <Row style={[ui.card, { justifyContent: "space-between" }]}>
        <Row style={{ gap: 12 }}>
          <Icon name="freeze" />
          <View>
            <T size={15} weight="bold">
              Freeze card
            </T>
            <T size={12} color={c.muted}>
              {frozen ? "Card frozen" : "Ready when you are"}
            </T>
          </View>
        </Row>
        <Switch
          accessibilityLabel="Freeze card"
          value={frozen}
          onValueChange={(cardFrozen) => setProfile({ cardFrozen })}
          trackColor={{ true: c.primary, false: c.line }}
        />
      </Row>
    </ScrollView>
  );
}
export function Insurance() {
  const nav = useNavigation();
  const [type, setType] = useState("Car");
  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2024");
  const [policy, setPolicy] = useState("");
  const [plan, setPlan] = useState("Monthly");
  const [error, setError] = useState("");
  const plans = [
    { name: "Monthly", sub: "One month of cover", price: 19900 },
    { name: "6 months", sub: "A little less admin", price: 113400 },
    { name: "Annual", sub: "A year of peace of mind", price: 215000 },
  ];
  const current = plans.find((p) => p.name === plan)!;
  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          backgroundColor: c.soft,
          padding: 18,
          borderRadius: 18,
          marginBottom: 24,
        }}
      >
        <Icon name="shield" size={30} color={c.primary} />
        <T
          size={27}
          weight="display"
          style={{ letterSpacing: -1, marginTop: 14 }}
        >
          Peace of mind,{`\n`}for the road ahead.
        </T>
        <T size={13} color={c.muted} style={{ marginTop: 9 }}>
          Explore a simpler policy renewal.
        </T>
      </View>
      <Chips
        values={["Car", "Moto", "Van", "Truck"]}
        value={type}
        onChange={setType}
      />
      <Section title="A few vehicle details" />
      <Field
        label="Registration plate"
        value={plate}
        onChangeText={setPlate}
        placeholder="e.g. ABC 123"
        autoCapitalize="characters"
        maxLength={15}
      />
      <Row style={{ gap: 12, alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Field
            label="Make"
            value={brand}
            onChangeText={setBrand}
            placeholder="Toyota"
            maxLength={40}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Field
            label="Model"
            value={model}
            onChangeText={setModel}
            placeholder="Corolla"
            maxLength={40}
          />
        </View>
      </Row>
      <Field
        label="Year"
        value={year}
        onChangeText={setYear}
        keyboardType="number-pad"
        maxLength={4}
      />
      <Field
        label="Current policy number"
        value={policy}
        onChangeText={setPolicy}
        placeholder="Policy number"
        maxLength={40}
      />
      <Section title="Find your rhythm" />
      {plans.map((p) => (
        <Tap
          key={p.name}
          label={p.name}
          onPress={() => setPlan(p.name)}
          style={{
            padding: 17,
            borderWidth: 1,
            borderColor: p.name === plan ? c.primary : c.line,
            borderRadius: 15,
            backgroundColor: p.name === plan ? c.soft : c.white,
            marginBottom: 10,
          }}
        >
          <Row style={{ gap: 12 }}>
            <Icon
              name={p.name === plan ? "success" : "shield"}
              color={p.name === plan ? c.primary : c.muted}
              size={22}
            />
            <View style={{ flex: 1 }}>
              <T weight="bold" size={15}>
                {p.name}
              </T>
              <T color={c.muted} size={12}>
                {p.sub}
              </T>
            </View>
            <T weight="bold" size={16}>
              {money(p.price)}
            </T>
          </Row>
        </Tap>
      ))}

      {!!error && (
        <T
          accessibilityRole="alert"
          color={c.red}
          size={14}
          style={{ marginBottom: 15 }}
        >
          {error}
        </T>
      )}
      <Button
        title="Review renewal"
        onPress={() => {
          const schema = z.object({
            plate: z.string().trim().min(3),
            brand: z.string().trim().min(2),
            model: z.string().trim().min(1),
            year: z.coerce
              .number()
              .int()
              .min(1980)
              .max(new Date().getFullYear() + 1),
            policy: z.string().trim().min(3),
          });
          if (
            !schema.safeParse({ plate, brand, model, year, policy }).success
          ) {
            setError(
              "Complete all vehicle details, a valid year, and a policy reference.",
            );
            return;
          }
          nav.navigate("Checkout", {
            title: `${type} insurance renewal`,
            subtitle: `${brand} ${model} · ${plate.toUpperCase()}`,
            amount: current.price,
            kind: "insurance",
            details: `${current.name} plan\nVehicle year: ${year}\nPolicy: ${policy}`,
          });
        }}
      />
    </ScrollView>
  );
}
export function Bill() {
  const nav = useNavigation();
  const [type, setType] = useState("Electricity");
  const [provider, setProvider] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Icon name="receipt" size={33} color={c.primary} />
      <T
        size={29}
        weight="display"
        style={{ letterSpacing: -1, marginTop: 16 }}
      >
        Life admin.{`\n`}A little lighter.
      </T>
      <T color={c.muted} size={14} style={{ marginTop: 12, marginBottom: 24 }}>
        One less thing on your to-do list.
      </T>
      <Chips
        values={["Electricity", "Internet", "Water", "Mobile"]}
        value={type}
        onChange={setType}
      />
      <View style={{ marginTop: 25 }}>
        <Field
          label="Provider"
          value={provider}
          onChangeText={setProvider}
          placeholder="Provider name"
          maxLength={80}
        />
        <Field
          label="Account or bill reference"
          value={account}
          onChangeText={setAccount}
          placeholder="Bill reference"
          maxLength={40}
        />
        <Field
          label="Amount (AUD)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          maxLength={12}
        />
      </View>

      {!!error && (
        <T
          accessibilityRole="alert"
          color={c.red}
          size={14}
          style={{ marginTop: 18 }}
        >
          {error}
        </T>
      )}
      <View style={{ marginTop: 25 }}>
        <Button
          title="Review payment"
          onPress={() => {
            const cents = parseAmount(amount);
            if (
              provider.trim().length < 2 ||
              account.trim().length < 3 ||
              !cents
            ) {
              setError(
                "Enter a provider, a bill reference and a valid amount.",
              );
              return;
            }
            nav.navigate("Checkout", {
              title: `${type} bill`,
              subtitle: provider.trim(),
              amount: cents,
              kind: "bill",
              details: `Bill reference: ${account.trim()}\nProvider: ${provider.trim()}`,
            });
          }}
        />
      </View>
    </ScrollView>
  );
}
