export type CardIdentity = { number: string; expiry: string; cvv: string };
// Presentation-only card data. Deliberately fails Luhn validation so it cannot
// be mistaken for a usable issued payment credential.
export function createCardIdentity(): CardIdentity {
  const digit = () => Math.floor(Math.random() * 10);
  const digits = [4, 8, 2, 6, ...Array.from({ length: 11 }, digit)];
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  digits.push((((10 - (sum % 10)) % 10) + 1) % 10);
  return {
    number: digits.join(""),
    expiry: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}/29`,
    cvv: String(Math.floor(Math.random() * 900) + 100),
  };
}
