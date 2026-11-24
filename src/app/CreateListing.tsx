import React from "react";
import { RouteGate } from "../components/Loading";
import { CreateListing } from "../screens/Supporting";
export default function Page() {
  return (
    <RouteGate>
      <CreateListing />
    </RouteGate>
  );
}
