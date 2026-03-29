import { describe, it, expect } from "vitest";
import { Entity } from "./entity.js";
import { entityEquals } from "./entity-equals.js";

class TestEntity extends Entity<string> {
  constructor(id: string) {
    super(id);
  }
}

describe("Entity", () => {
  it("stores id and equals by id", () => {
    const a = new TestEntity("1");
    const b = new TestEntity("1");
    const c = new TestEntity("2");
    expect(a.id).toBe("1");
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it("equals returns false for null/undefined", () => {
    const a = new TestEntity("1");
    expect(a.equals(null)).toBe(false);
    expect(a.equals(undefined)).toBe(false);
  });

  it("toString includes constructor name and id", () => {
    const a = new TestEntity("x");
    expect(a.toString()).toContain("TestEntity");
    expect(a.toString()).toContain("x");
  });

  it("throws if id is null or undefined", () => {
    expect(() => new TestEntity(null as unknown as string)).toThrow(
      /id must not be null/
    );
    expect(() => new TestEntity(undefined as unknown as string)).toThrow(
      /id must not be null/
    );
  });
});

describe("entityEquals", () => {
  it("returns true when both null or both undefined", () => {
    expect(entityEquals(null, null)).toBe(true);
    expect(entityEquals(undefined, undefined)).toBe(true);
  });

  it("returns false when one is null/undefined", () => {
    const a = new TestEntity("1");
    expect(entityEquals(a, null)).toBe(false);
    expect(entityEquals(null, a)).toBe(false);
    expect(entityEquals(a, undefined)).toBe(false);
  });

  it("delegates to equals when both defined", () => {
    const a = new TestEntity("1");
    const b = new TestEntity("1");
    expect(entityEquals(a, b)).toBe(true);
  });
});
