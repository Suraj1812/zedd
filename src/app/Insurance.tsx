import React from "react";
import { RouteGate } from "../components/Loading";
import { Insurance } from "../screens/Payments";
export default function Page() {
  return (
    <RouteGate>
      <Insurance />
    </RouteGate>
  );
}
