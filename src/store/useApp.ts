import { createCardIdentity, type CardIdentity } from "../lib/card";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CartLine,
  Transaction,
  TransactionKind,
  updateCart,
  validateDebit,
  orderTotal,
} from "../lib/domain";
export type LocalListing = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
};
export type CheckoutDraft = {
  title: string;
  subtitle: string;
  amount: number;
  kind: TransactionKind;
  details: string;
  cart?: boolean;
  requiresAddress?: boolean;
};
type State = {
  checkoutDrafts: Record<string, CheckoutDraft>;
  stageCheckout: (ref: string, draft: CheckoutDraft) => void;
  hydrated: boolean;
  cardFrozen: boolean;
  card: CardIdentity;
  name: string;
  city: string;
  address: string;
  balance: number;
  cart: CartLine[];
  saved: string[];
  transactions: Transaction[];
  listings: LocalListing[];
  enquiries: string[];
  notifications: boolean;
  setHydrated: () => void;
  profile: (
    values: Partial<
      Pick<State, "name" | "city" | "address" | "notifications" | "cardFrozen">
    >,
  ) => void;
  toggleSaved: (id: string) => void;
  addLine: (line: Omit<CartLine, "quantity">, delta?: number) => string | null;
  clearCart: () => void;
  transact: (input: {
    id: string;
    title: string;
    subtitle: string;
    amount: number;
    kind: TransactionKind;
    details: string;
    clearCart?: boolean;
  }) => { transaction?: Transaction; error?: string };
  enquire: (id: string) => void;
  addListing: (listing: Omit<LocalListing, "id">) => void;
};
export const useApp = create<State>()(
  persist(
    (set, get) => ({
      checkoutDrafts: {},
      stageCheckout: (ref, draft) =>
        set((s) => ({
          checkoutDrafts: {
            ...Object.fromEntries(Object.entries(s.checkoutDrafts).slice(-9)),
            [ref]: draft,
          },
        })),
      hydrated: false,
      cardFrozen: false,
      card: createCardIdentity(),
      name: "Alex",
      city: "Sydney",
      address: "",
      balance: 248050,
      cart: [],
      saved: [],
      transactions: [],
      listings: [],
      enquiries: [],
      notifications: true,
      setHydrated: () => set({ hydrated: true }),
      profile: (values) => set(values),
      toggleSaved: (id) =>
        set((s) => ({
          saved: s.saved.includes(id)
            ? s.saved.filter((x) => x !== id)
            : [...s.saved, id],
        })),
      addLine: (line, delta = 1) => {
        const cart = get().cart;
        if (
          delta > 0 &&
          cart.length &&
          (cart[0].kind !== line.kind ||
            (line.kind === "food" && cart[0].merchant !== line.merchant))
        )
          return "Your bag contains items from another store. Finish that order or empty your bag first.";
        set({ cart: updateCart(cart, line, delta) });
        return null;
      },
      clearCart: () => set({ cart: [] }),
      transact: (input) => {
        const state = get();
        const previous = state.transactions.find((t) => t.id === input.id);
        if (previous) return { transaction: previous };
        if (
          input.clearCart &&
          (!state.cart.length || orderTotal(state.cart).total !== input.amount)
        )
          return {
            error: "Your bag has changed. Review it before continuing.",
          };
        if (input.kind !== "topup") {
          const error = validateDebit(state.balance, input.amount);
          if (error) return { error };
        } else if (
          !Number.isSafeInteger(input.amount) ||
          input.amount <= 0 ||
          input.amount > 1000000
        )
          return { error: "Add between A$1 and A$10,000 to your wallet." };
        const transaction: Transaction = {
          id: input.id,
          title: input.title,
          subtitle: input.subtitle,
          amount: input.amount,
          kind: input.kind,
          createdAt: new Date().toISOString(),
          reference: `ZD-${input.id.slice(-8).toUpperCase()}`,
          details: input.details,
          status: input.kind === "booking" ? "Confirmed" : "Completed",
        };
        set({
          balance:
            state.balance +
            (input.kind === "topup" ? input.amount : -input.amount),
          transactions: [transaction, ...state.transactions],
          ...(input.clearCart ? { cart: [] } : {}),
        });
        return { transaction };
      },
      enquire: (id) =>
        set((s) => ({ enquiries: [...new Set([...s.enquiries, id])] })),
      addListing: (listing) =>
        set((s) => ({
          listings: [
            { ...listing, id: `listing-${Date.now()}` },
            ...s.listings,
          ],
        })),
    }),
    {
      name: "zedd-mvp-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hydrated, ...state }) => state,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
