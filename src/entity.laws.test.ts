/**
 * Entity equality laws: reflexivity, symmetry, transitivity, null handling.
 */

import { describe, it, expect } from "vitest";
import { Entity } from "./entity.js";
import { entityEquals } from "./entity-equals.js";

class TestEntity extends Entity<string> {
  constructor(id: string) {
    super(id);
  }
}

describe("Entity laws", () => {
  describe("equals reflexivity", () => {
    it("a.equals(a) is true", () => {
      const a = new TestEntity("1");
      expect(a.equals(a)).toBe(true);
    });
  });

  describe("equals symmetry", () => {
    it("a.equals(b) === b.equals(a) when both have same id", () => {
      const a = new TestEntity("1");
      const b = new TestEntity("1");
      expect(a.equals(b)).toBe(b.equals(a));
      expect(a.equals(b)).toBe(true);
    });
    it("a.equals(c) === c.equals(a) when different ids", () => {
      const a = new TestEntity("1");
      const c = new TestEntity("2");
      expect(a.equals(c)).toBe(c.equals(a));
      expect(a.equals(c)).toBe(false);
    });
  });

  describe("equals transitivity", () => {
    it("if a.equals(b) and b.equals(c) then a.equals(c)", () => {
      const a = new TestEntity("1");
      const b = new TestEntity("1");
      const c = new TestEntity("1");
      expect(a.equals(b)).toBe(true);
      expect(b.equals(c)).toBe(true);
      expect(a.equals(c)).toBe(true);
    });
  });

  describe("entityEquals symmetry", () => {
    it("entityEquals(a, b) === entityEquals(b, a) when both defined", () => {
      const a = new TestEntity("1");
      const b = new TestEntity("1");
      expect(entityEquals(a, b)).toBe(entityEquals(b, a));
    });
    it("entityEquals(a, b) === entityEquals(b, a) when one is null", () => {
      const a = new TestEntity("1");
      expect(entityEquals(a, null)).toBe(entityEquals(null, a));
      expect(entityEquals(a, null)).toBe(false);
    });
    it("entityEquals(null, null) and entityEquals(undefined, undefined)", () => {
      expect(entityEquals(null, null)).toBe(true);
      expect(entityEquals(undefined, undefined)).toBe(true);
    });
  });
});
