import React from "react";
import { RouteGate } from "../components/Loading";
import { Cart } from "../screens/Commerce";
export default function Page() {
  return (
    <RouteGate>
      <Cart />
    </RouteGate>
  );
}
