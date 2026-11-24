import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  AccessibilityInfo,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  type TextInputProps,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import {
  Home,
  Compass,
  Wallet,
  Clock3,
  UserRound,
  Hotel,
  Plane,
  Utensils,
  CarFront,
  TrainFront,
  BusFront,
  KeyRound,
  Ticket,
  ReceiptText,
  HeartPulse,
  ShieldCheck,
  ShoppingBag,
  Store,
  Search,
  Bell,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plus,
  Minus,
  X,
  Check,
  Heart,
  Star,
  MapPin,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Eye,
  EyeOff,
  Settings,
  Headphones,
  SlidersHorizontal,
  Wifi,
  Leaf,
  Sun,
  CalendarDays,
  UsersRound,
  LockKeyhole,
  CreditCard,
  CheckCheck,
  Copy,
  Snowflake,
  Info,
  LogOut,
  Trash2,
  CheckCircle2,
  Send,
  Filter,
  Share2,
  type LucideIcon,
} from "lucide-react-native";
import { colors as c, fonts, mark, money } from "../theme";
import { useApp } from "../store/useApp";
import type { Item } from "../lib/catalog";
const icons: Record<string, LucideIcon> = {
  home: Home,
  compass: Compass,
  wallet: Wallet,
  clock: Clock3,
  user: UserRound,
  hotel: Hotel,
  plane: Plane,
  utensils: Utensils,
  car: CarFront,
  train: TrainFront,
  bus: BusFront,
  key: KeyRound,
  ticket: Ticket,
  receipt: ReceiptText,
  "heart-pulse": HeartPulse,
  shield: ShieldCheck,
  bag: ShoppingBag,
  store: Store,
  search: Search,
  bell: Bell,
  right: ChevronRight,
  left: ChevronLeft,
  down: ChevronDown,
  plus: Plus,
  minus: Minus,
  x: X,
  check: Check,
  heart: Heart,
  star: Star,
  pin: MapPin,
  send: ArrowUpRight,
  receive: ArrowDownLeft,
  qr: QrCode,
  eye: Eye,
  "eye-off": EyeOff,
  settings: Settings,
  help: Headphones,
  sliders: SlidersHorizontal,
  wifi: Wifi,
  leaf: Leaf,
  sun: Sun,
  calendar: CalendarDays,
  users: UsersRound,
  lock: LockKeyhole,
  card: CreditCard,
  checks: CheckCheck,
  copy: Copy,
  freeze: Snowflake,
  info: Info,
  logout: LogOut,
  trash: Trash2,
  success: CheckCircle2,
  message: Send,
  filter: Filter,
  share: Share2,
};
export function Icon({
  name,
  size = 22,
  color = c.ink,
  stroke = 1.65,
  fill = "none",
}: {
  name: string;
  size?: number;
  color?: string;
  stroke?: number;
  fill?: string;
}) {
  const Comp = icons[name] || Compass;
  return <Comp size={size} color={color} strokeWidth={stroke} fill={fill} />;
}
export function T({
  children,
  size = 16,
  color = c.ink,
  weight = "regular",
  style,
  ...props
}: {
  children?: React.ReactNode;
  size?: number;
  color?: string;
  weight?: keyof typeof fonts;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityRole?: "header" | "alert";
} & Record<string, any>) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: fonts[weight],
          fontSize: size,
          color,
          lineHeight: size * 1.45,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Row({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[s.row, style]}>{children}</View>;
}
export const haptic = () => {
  if (Platform.OS !== "web") void Haptics.selectionAsync().catch(() => {});
};
export function Tap({
  children,
  onPress,
  style,
  label,
  disabled = false,
  testID,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  label?: string;
  disabled?: boolean;
  testID?: string;
}) {
  const scale = useSharedValue(1);
  const reduced = useReducedMotion();
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={anim}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => {
          haptic();
          onPress?.();
        }}
        onPressIn={() => {
          if (!reduced) scale.set(withTiming(0.975, { duration: 100 }));
        }}
        onPressOut={() => scale.set(withTiming(1, { duration: 180 }))}
        style={({ pressed, focused }: any) => [
          style,
          disabled && { opacity: 0.45 },
          pressed && { opacity: 0.88 },
          focused && {
            outlineColor: c.primary,
            outlineWidth: 2,
            outlineOffset: 3,
          },
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  icon,
  disabled = false,
  loading = false,
  style,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tap
      disabled={disabled || loading}
      onPress={onPress}
      label={title}
      style={[
        s.button,
        { backgroundColor: secondary ? c.soft : c.primary },
        style,
      ]}
    >
      <Row style={{ justifyContent: "center", gap: 10 }}>
        {loading ? (
          <ActivityIndicator color={secondary ? c.primary : c.white} />
        ) : icon ? (
          <Icon name={icon} color={secondary ? c.primary : c.white} size={19} />
        ) : null}
        <T weight="bold" color={secondary ? c.primary : c.white}>
          {title}
        </T>
      </Row>
    </Tap>
  );
}
export function RoundButton({
  icon,
  onPress,
  label,
  dark = false,
}: {
  icon: string;
  onPress: () => void;
  label: string;
  dark?: boolean;
}) {
  return (
    <Tap
      onPress={onPress}
      label={label}
      style={[
        s.round,
        { backgroundColor: dark ? "rgba(255,255,255,.13)" : c.white },
      ]}
    >
      <Icon name={icon} size={20} color={dark ? c.white : c.ink} />
    </Tap>
  );
}
export function Field({
  label,
  error,
  style,
  ...props
}: TextInputProps & { label: string; error?: string; style?: any }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ gap: 8, marginBottom: 18 }}>
      <T size={14} weight="medium">
        {label}
      </T>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor="#95A198"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={[
          s.input,
          { borderColor: error ? c.red : focus ? c.primary : c.line },
          style,
        ]}
      />
      {!!error && (
        <T size={13} color={c.red}>
          {error}
        </T>
      )}
    </View>
  );
}
export function SearchField({
  value,
  onChangeText,
  placeholder = "Search something good…",
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <Row style={s.search}>
      <Icon name="search" color={c.muted} size={20} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        style={{
          flex: 1,
          fontFamily: fonts.regular,
          fontSize: 15,
          color: c.ink,
          paddingVertical: 14,
          ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
        }}
      />
      {value.length > 0 && (
        <Tap
          label="Clear search"
          onPress={() => onChangeText("")}
          style={{ padding: 6 }}
        >
          <Icon name="x" size={17} />
        </Tap>
      )}
    </Row>
  );
}
export function Chip({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Tap
      onPress={onPress}
      label={title}
      style={[
        s.chip,
        {
          backgroundColor: active ? c.primary : c.white,
          borderColor: active ? c.primary : c.line,
        },
      ]}
    >
      <T size={14} weight="medium" color={active ? c.white : c.muted}>
        {title}
      </T>
    </Tap>
  );
}
export function Chips({
  values,
  value,
  onChange,
}: {
  values: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
    >
      {values.map((v) => (
        <Chip
          key={v}
          title={v}
          active={v === value}
          onPress={() => onChange(v)}
        />
      ))}
    </ScrollView>
  );
}
export function Section({
  title,
  action,
  onPress,
  eyebrow,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
  eyebrow?: string;
}) {
  return (
    <View style={{ marginTop: 28, marginBottom: 16, gap: 5 }}>
      {!!eyebrow && (
        <T
          size={11}
          weight="bold"
          color={c.muted}
          style={{ letterSpacing: 1.6 }}
        >
          {eyebrow}
        </T>
      )}
      <Row style={{ justifyContent: "space-between" }}>
        <T size={21} weight="display" style={{ letterSpacing: -0.7 }}>
          {title}
        </T>
        {!!action && (
          <Tap
            onPress={onPress}
            label={action}
            style={{ paddingVertical: 6, paddingLeft: 12 }}
          >
            <T size={13} weight="bold" color={c.primary}>
              {action}
            </T>
          </Tap>
        )}
      </Row>
    </View>
  );
}
export function Tag({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        backgroundColor: dark ? "rgba(255,255,255,.95)" : c.soft,
      }}
    >
      <T
        size={11}
        weight="bold"
        color={c.primary}
        style={{ letterSpacing: 0.2 }}
      >
        {text}
      </T>
    </View>
  );
}
export function Counter({
  value,
  onChange,
  min = 1,
  max = 20,
  label = "Quantity",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <Row style={{ gap: 14 }}>
      <Tap
        label={`Decrease ${label}`}
        disabled={value <= min}
        onPress={() => onChange(value - 1)}
        style={s.counter}
      >
        <Icon name="minus" size={16} />
      </Tap>
      <T weight="bold" size={15}>
        {value}
      </T>
      <Tap
        label={`Increase ${label}`}
        disabled={value >= max}
        onPress={() => onChange(value + 1)}
        style={s.counter}
      >
        <Icon name="plus" size={16} />
      </Tap>
    </Row>
  );
}
export function InfoBox({
  children,
  icon = "info",
}: {
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <Row
      style={{
        backgroundColor: c.soft,
        padding: 14,
        borderRadius: 14,
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <Icon name={icon} size={18} color={c.primary} />
      <T color={c.muted} size={13} style={{ flex: 1 }}>
        {children}
      </T>
    </Row>
  );
}
export function Empty({
  icon = "search",
  title,
  description,
  action,
  onPress,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={{ paddingVertical: 44, alignItems: "center", gap: 12 }}>
      <View style={{ padding: 20, borderRadius: 30, backgroundColor: c.soft }}>
        <Icon name={icon} size={28} color={c.primary} />
      </View>
      <T size={20} weight="display">
        {title}
      </T>
      <T
        color={c.muted}
        size={14}
        style={{ textAlign: "center", maxWidth: 280 }}
      >
        {description}
      </T>
      {!!action && onPress && (
        <Button title={action} secondary onPress={onPress} />
      )}
    </View>
  );
}
export function Picture({
  source,
  style,
  accessibilityLabel,
}: {
  source: number | string;
  style: any;
  accessibilityLabel?: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <View
      style={[
        style,
        {
          backgroundColor: c.soft,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Icon name="leaf" color={c.primary} />
    </View>
  ) : (
    <Image
      source={typeof source === "string" ? { uri: source } : source}
      contentFit="cover"
      transition={200}
      style={style}
      onError={() => setFailed(true)}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
export function Brand({
  small = false,
  inverse = false,
}: {
  small?: boolean;
  inverse?: boolean;
}) {
  return (
    <Row style={{ gap: 9 }}>
      <Image
        source={mark}
        style={{
          width: small ? 28 : 31,
          height: small ? 28 : 31,
          borderRadius: small ? 9 : 10,
        }}
      />
      <T
        weight="heavy"
        size={small ? 23 : 26}
        color={inverse ? c.white : c.ink}
        style={{ letterSpacing: -1.3 }}
      >
        zedd
        <T size={20} weight="heavy" color="#777E91">
          .
        </T>
      </T>
    </Row>
  );
}
export function ItemCard({
  item,
  onPress,
  compact = false,
}: {
  item: Item;
  onPress: () => void;
  compact?: boolean;
}) {
  const saved = useApp((s) => s.saved.includes(item.id));
  const toggle = useApp((s) => s.toggleSaved);
  return (
    <View style={{ flex: 1, marginBottom: 18 }}>
      <View style={{ position: "relative" }}>
        <Tap onPress={onPress} label={`View ${item.name}`}>
          <Picture
            source={item.image}
            accessibilityLabel={item.name}
            style={{
              width: "100%",
              height: compact ? 170 : 220,
              borderRadius: 19,
            }}
          />
        </Tap>
        <View style={{ position: "absolute", top: 12, left: 12 }}>
          {!!item.badge && <Tag text={item.badge} dark />}
        </View>
        <View style={{ position: "absolute", top: 10, right: 10 }}>
          <Tap
            label={`${saved ? "Unsave" : "Save"} ${item.name}`}
            onPress={() => toggle(item.id)}
            style={{
              backgroundColor: "rgba(255,255,255,.94)",
              width: 35,
              height: 35,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name="heart"
              size={18}
              color={saved ? c.primary : c.ink}
              fill={saved ? c.primary : "none"}
            />
          </Tap>
        </View>
      </View>
      <Tap
        onPress={onPress}
        label={`Details for ${item.name}`}
        style={{ paddingTop: 12 }}
      >
        <Row style={{ justifyContent: "space-between", gap: 8 }}>
          <T weight="bold" size={compact ? 15 : 17} style={{ flex: 1 }}>
            {item.name}
          </T>
          {!!item.rating && (
            <Row style={{ gap: 4 }}>
              <Icon name="star" size={13} color={c.primary} fill={c.primary} />
              <T size={12} weight="medium">
                {item.rating}
              </T>
            </Row>
          )}
        </Row>
        <T size={12} color={c.muted} style={{ marginTop: 3 }}>
          {item.subtitle}
        </T>
        <T size={compact ? 14 : 16} weight="bold" style={{ marginTop: 7 }}>
          {money(item.price)}
          <T size={12} color={c.muted}>
            {" "}
            {item.kind === "hotel"
              ? "/ night"
              : item.kind === "food"
                ? "· from"
                : ""}
          </T>
        </T>
      </Tap>
    </View>
  );
}
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => sub.remove();
  }, []);
  return reduced;
}
const NoticeContext = createContext<(message: string) => void>(() => {});
export const useNotice = () => useContext(NoticeContext);
export function NoticeProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const notify = (text: string) => {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 4500);
  };
  return (
    <NoticeContext.Provider value={notify}>
      {children}
      {!!message && (
        <Pressable
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          onPress={() => setMessage("")}
          style={s.toast}
        >
          <Icon name="info" color={c.white} size={18} />
          <T color={c.white} size={14} style={{ flex: 1 }}>
            {message}
          </T>
          <Icon name="x" color={c.white} size={16} />
        </Pressable>
      )}
    </NoticeContext.Provider>
  );
}
export const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  button: { borderRadius: 15, padding: 17, minHeight: 54 },
  round: {
    width: 42,
    height: 42,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(120,140,120,.12)",
  },
  input: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: c.ink,
    backgroundColor: c.white,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 15,
    minHeight: 53,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 14,
    gap: 10,
    minHeight: 51,
  },
  chip: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
  },
  counter: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.line,
    justifyContent: "center",
    alignItems: "center",
  },
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 96,
    padding: 16,
    backgroundColor: c.ink,
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,.15)",
  },
  card: {
    backgroundColor: c.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: c.line,
  },
});
