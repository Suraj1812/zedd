import { RouteGate } from "../components/Loading";
import React from "react";
import { Detail } from "../screens/Commerce";
import { WithRoute } from "../lib/navigation";
export default function Route() {
  return (
    <RouteGate>
      <WithRoute Screen={Detail} required="item" />
    </RouteGate>
  );
}
