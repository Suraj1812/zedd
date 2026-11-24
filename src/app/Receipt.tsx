import { RouteGate } from "../components/Loading";
import React from "react";
import { Receipt } from "../screens/Supporting";
import { WithRoute } from "../lib/navigation";
export default function Route() {
  return (
    <RouteGate>
      <WithRoute Screen={Receipt} required="id" />
    </RouteGate>
  );
}
