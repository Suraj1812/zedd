import React from "react";
import { RouteGate } from "../components/Loading";
import { Transfer } from "../screens/Payments";
export default function Page() {
  return (
    <RouteGate>
      <Transfer />
    </RouteGate>
  );
}
