import React from "react";
import { RouteGate } from "../components/Loading";
import { Help } from "../screens/Supporting";
export default function Page() {
  return (
    <RouteGate>
      <Help />
    </RouteGate>
  );
}
