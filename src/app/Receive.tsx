import React from "react";
import { RouteGate } from "../components/Loading";
import { Receive } from "../screens/Payments";
export default function Page() {
  return (
    <RouteGate>
      <Receive />
    </RouteGate>
  );
}
