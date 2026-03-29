/**
 * ValueObject equality and hash laws: reflexivity, symmetry, transitivity, hash consistency.
 */

import { describe, it, expect } from "vitest";
import { ValueObject } from "./value-object.js";
import { valueObjectEquals } from "./value-object-equals.js";

class TestVO extends ValueObject {
  constructor(
    readonly x: number,
    readonly y: string
  ) {
    super();
  }
  protected getEqualityComponents(): Iterable<unknown> {
    return [this.x, this.y];
  }
}

describe("ValueObject laws", () => {
  describe("equals reflexivity", () => {
    it("a.equals(a) is true", () => {
      const a = new TestVO(1, "a");
      expect(a.equals(a)).toBe(true);
    });
  });

  describe("equals symmetry", () => {
    it("a.equals(b) === b.equals(a) when components equal", () => {
      const a = new TestVO(1, "a");
      const b = new TestVO(1, "a");
      expect(a.equals(b)).toBe(b.equals(a));
      expect(a.equals(b)).toBe(true);
    });
    it("a.equals(b) === b.equals(a) when components differ", () => {
      const a = new TestVO(1, "a");
      const b = new TestVO(2, "b");
      expect(a.equals(b)).toBe(b.equals(a));
      expect(a.equals(b)).toBe(false);
    });
  });

  describe("equals transitivity", () => {
    it("if a.equals(b) and b.equals(c) then a.equals(c)", () => {
      const a = new TestVO(1, "a");
      const b = new TestVO(1, "a");
      const c = new TestVO(1, "a");
      expect(a.equals(b)).toBe(true);
      expect(b.equals(c)).toBe(true);
      expect(a.equals(c)).toBe(true);
    });
  });

  describe("hash consistency", () => {
    it("a.equals(b) implies a.getHashCode() === b.getHashCode()", () => {
      const a = new TestVO(1, "a");
      const b = new TestVO(1, "a");
      expect(a.equals(b)).toBe(true);
      expect(a.getHashCode()).toBe(b.getHashCode());
    });
  });

  describe("valueObjectEquals symmetry", () => {
    it("valueObjectEquals(a, b) === valueObjectEquals(b, a) when both defined", () => {
      const a = new TestVO(1, "a");
      const b = new TestVO(1, "a");
      expect(valueObjectEquals(a, b)).toBe(valueObjectEquals(b, a));
    });
    it("valueObjectEquals(a, null) === valueObjectEquals(null, a)", () => {
      const a = new TestVO(1, "a");
      expect(valueObjectEquals(a, null)).toBe(valueObjectEquals(null, a));
    });
  });
});
