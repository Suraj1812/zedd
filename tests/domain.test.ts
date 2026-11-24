import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseAmount,
  orderTotal,
  updateCart,
  validateDebit,
  type CartLine,
} from "../src/lib/domain";
import { createCardIdentity } from "../src/lib/card";
const product = {
  id: "p1",
  name: "Argan Oil",
  price: 1800,
  image: 1,
  merchant: "Zedd Shop",
  kind: "shop" as const,
};
test("amounts use exact integer cents and reject malformed currency", () => {
  assert.equal(parseAmount("25.50"), 2550);
  assert.equal(parseAmount(" 0.10 "), 10);
  assert.equal(parseAmount("1000000"), 100000000);
  for (const value of [
    "",
    "0",
    "-1",
    "1.234",
    "1e3",
    "Infinity",
    "25,50",
    "0.001",
    "1000001",
  ])
    assert.equal(parseAmount(value), null, value);
});
test("insufficient and non-integer debits cannot affect a balance", () => {
  assert.equal(validateDebit(2550, 2550), null);
  for (const value of [2551, 0, -1, 1.5, NaN, Infinity])
    assert.ok(validateDebit(2550, value));
});
test("cart increments, caps quantities and removes an item at zero", () => {
  let lines = updateCart([], product, 1);
  lines = updateCart(lines, product, 1);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].quantity, 2);
  assert.equal(updateCart(lines, product, 19), lines);
  assert.deepEqual(updateCart(lines, product, -2), []);
});
test("food delivery is charged once per order; empty/shop bags stay free", () => {
  assert.deepEqual(orderTotal([]), { subtotal: 0, delivery: 0, total: 0 });
  assert.equal(orderTotal([{ ...product, quantity: 2 }]).total, 3600);
  const food: CartLine[] = [
    { ...product, kind: "food", quantity: 2 },
    { ...product, id: "p2", kind: "food", price: 600, quantity: 1 },
  ];
  assert.deepEqual(orderTotal(food), {
    subtotal: 4200,
    delivery: 300,
    total: 4500,
  });
});
test("random card display identity is stable in shape and never a usable Luhn credential", () => {
  for (let sample = 0; sample < 100; sample++) {
    const card = createCardIdentity();
    assert.match(card.number, /^4826\d{12}$/);
    assert.match(card.expiry, /^(0[1-9]|1[0-2])\/29$/);
    assert.match(card.cvv, /^\d{3}$/);
    const sum = [...card.number].reduce((acc, char, i) => {
      let d = Number(char);
      if (i % 2 === 0) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      return acc + d;
    }, 0);
    assert.notEqual(sum % 10, 0);
  }
});
