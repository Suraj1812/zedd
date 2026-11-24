import React from "react";
import { RouteGate } from "../components/Loading";
import { About } from "../screens/Supporting";
export default function Page() {
  return (
    <RouteGate>
      <About />
    </RouteGate>
  );
}
