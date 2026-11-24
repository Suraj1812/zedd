import React from "react";
import { RouteGate } from "../components/Loading";
import { Main } from "../screens/Main";
export default function Page() {
  return (
    <RouteGate>
      <Main />
    </RouteGate>
  );
}
