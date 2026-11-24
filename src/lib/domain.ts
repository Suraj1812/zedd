export type CartLine = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | number;
  merchant: string;
  kind: "food" | "shop";
};
export type TransactionKind =
  "payment" | "booking" | "order" | "topup" | "insurance" | "bill";
export type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  kind: TransactionKind;
  createdAt: string;
  reference: string;
  details: string;
  status: "Completed" | "Confirmed";
};
export function parseAmount(value: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return null;
  const amount = Math.round(Number(value) * 100);
  return Number.isSafeInteger(amount) && amount > 0 && amount <= 100000000
    ? amount
    : null;
}
export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}
export function orderTotal(lines: CartLine[]) {
  const subtotal = cartSubtotal(lines);
  return {
    subtotal,
    delivery: lines.length && lines[0].kind === "food" ? 300 : 0,
    total: subtotal + (lines.length && lines[0].kind === "food" ? 300 : 0),
  };
}
export function validateDebit(balance: number, amount: number) {
  if (!Number.isSafeInteger(amount) || amount <= 0)
    return "Enter a valid amount.";
  if (amount > balance)
    return "Insufficient balance. Add money in Pay to continue.";
  return null;
}
export function updateCart(
  lines: CartLine[],
  line: Omit<CartLine, "quantity">,
  delta: number,
): CartLine[] {
  const exists = lines.find((l) => l.id === line.id);
  const quantity = (exists?.quantity || 0) + delta;
  if (quantity <= 0) return lines.filter((l) => l.id !== line.id);
  if (quantity > 20) return lines;
  return exists
    ? lines.map((l) => (l.id === line.id ? { ...l, quantity } : l))
    : [...lines, { ...line, quantity }];
}
