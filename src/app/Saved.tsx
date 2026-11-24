import React from "react";
import { RouteGate } from "../components/Loading";
import { Saved } from "../screens/Supporting";
export default function Page() {
  return (
    <RouteGate>
      <Saved />
    </RouteGate>
  );
}
