import React from "react";
import { RouteGate } from "../components/Loading";
import { Notifications } from "../screens/Supporting";
export default function Page() {
  return (
    <RouteGate>
      <Notifications />
    </RouteGate>
  );
}
