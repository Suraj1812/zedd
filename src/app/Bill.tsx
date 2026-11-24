import React from "react";
import { RouteGate } from "../components/Loading";
import { Bill } from "../screens/Payments";
export default function Page() {
  return (
    <RouteGate>
      <Bill />
    </RouteGate>
  );
}
