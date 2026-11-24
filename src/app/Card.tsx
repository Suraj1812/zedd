import React from "react";
import { RouteGate } from "../components/Loading";
import { Card } from "../screens/Payments";
export default function Page() {
  return (
    <RouteGate>
      <Card />
    </RouteGate>
  );
}
