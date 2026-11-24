import { RouteGate } from "../components/Loading";
import React from "react";
import { Confirmation } from "../screens/Supporting";
import { WithRoute } from "../lib/navigation";
export default function Route() {
  return (
    <RouteGate>
      <WithRoute Screen={Confirmation} required="id" />
    </RouteGate>
  );
}
