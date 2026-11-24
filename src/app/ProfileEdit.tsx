import React from "react";
import { RouteGate } from "../components/Loading";
import { ProfileEdit } from "../screens/Supporting";
export default function Page() {
  return (
    <RouteGate>
      <ProfileEdit />
    </RouteGate>
  );
}
