import { RouteGate } from "../components/Loading";
import React from "react";
import { Checkout } from "../screens/Commerce";
import { WithRoute } from "../lib/navigation";
export default function Route() {
  return (
    <RouteGate>
      <WithRoute Screen={Checkout} required="title" />
    </RouteGate>
  );
}
