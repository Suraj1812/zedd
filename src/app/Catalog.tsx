import React from "react";
import { RouteGate } from "../components/Loading";
import { Catalog } from "../screens/Commerce";
export default function Page() {
  return (
    <RouteGate>
      <Catalog />
    </RouteGate>
  );
}
