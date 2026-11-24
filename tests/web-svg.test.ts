import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { webSvgProps } from "../src/lib/webSvgProps";

test("animated SVG web props render without native-only DOM attributes or warnings", () => {
  const input = {
    collapsable: false,
    collapsableChildren: false,
    d: "M0 0L12 12",
    stroke: "#fff",
    strokeDashoffset: 120,
  };
  const warnings: unknown[][] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => {
    warnings.push(args);
  };
  try {
    const markup = renderToStaticMarkup(
      React.createElement(
        "svg",
        null,
        React.createElement("path", webSvgProps(input)),
      ),
    );
    assert.equal(warnings.length, 0, JSON.stringify(warnings));
    assert.ok(!markup.includes("collapsable"));
    assert.ok(markup.includes('stroke-dashoffset="120"'));
    assert.ok(markup.includes('d="M0 0L12 12"'));
    assert.equal(
      input.collapsable,
      false,
      "filter must not mutate animated props",
    );
  } finally {
    console.error = original;
  }
});
