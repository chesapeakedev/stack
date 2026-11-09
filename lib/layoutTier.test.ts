// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import assert from "node:assert/strict";
import test from "node:test";
import { resolveLayoutTier } from "./layoutTier.ts";

test("resolveLayoutTier boundaries", () => {
  assert.equal(resolveLayoutTier(390), "compact");
  assert.equal(resolveLayoutTier(767), "compact");
  assert.equal(resolveLayoutTier(768), "hybrid");
  assert.equal(resolveLayoutTier(683), "compact");
  assert.equal(resolveLayoutTier(1023), "hybrid");
  assert.equal(resolveLayoutTier(1024), "comfortable");
  assert.equal(resolveLayoutTier(1920), "comfortable");
});
