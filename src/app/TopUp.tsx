import React from "react";
import { RouteGate } from "../components/Loading";
import { TopUp } from "../screens/Payments";
export default function Page() {
  return (
    <RouteGate>
      <TopUp />
    </RouteGate>
  );
}
