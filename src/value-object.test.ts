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

class OtherVO extends ValueObject {
  constructor(readonly x: number) {
    super();
  }
  protected getEqualityComponents(): Iterable<unknown> {
    return [this.x];
  }
}

describe("ValueObject", () => {
  it("equals when components match", () => {
    const a = new TestVO(1, "a");
    const b = new TestVO(1, "a");
    expect(a.equals(b)).toBe(true);
  });

  it("not equal when components differ", () => {
    const a = new TestVO(1, "a");
    const b = new TestVO(1, "b");
    const c = new TestVO(2, "a");
    expect(a.equals(b)).toBe(false);
    expect(a.equals(c)).toBe(false);
  });

  it("not equal when different constructor", () => {
    const a = new TestVO(1, "a");
    const b = new OtherVO(1);
    expect(a.equals(b)).toBe(false);
  });

  it("equals returns false for null/undefined", () => {
    const a = new TestVO(1, "a");
    expect(a.equals(null)).toBe(false);
    expect(a.equals(undefined)).toBe(false);
  });

  it("getHashCode is consistent for same components", () => {
    const a = new TestVO(1, "a");
    const b = new TestVO(1, "a");
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("getHashCode differs for different components", () => {
    const a = new TestVO(1, "a");
    const b = new TestVO(1, "b");
    expect(a.getHashCode()).not.toBe(b.getHashCode());
  });

  it("toString returns constructor name", () => {
    const a = new TestVO(1, "a");
    expect(a.toString()).toBe("TestVO");
  });

  it("equals uses component.equals when not ValueObject", () => {
    const withEquals = {
      id: 1,
      equals: (other: unknown) => (other as { id?: number })?.id === 1,
    };
    class VOWithEquals extends ValueObject {
      constructor(
        readonly obj: { id: number; equals: (other: unknown) => boolean }
      ) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.obj];
      }
    }
    const a = new VOWithEquals(withEquals);
    const b = new VOWithEquals({
      id: 1,
      equals: (other: unknown) => (other as { id?: number })?.id === 1,
    });
    expect(a.equals(b)).toBe(true);
  });

  it("getHashCode handles boolean components", () => {
    class VOWithBool extends ValueObject {
      constructor(readonly flag: boolean) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.flag];
      }
    }
    const a = new VOWithBool(true);
    const b = new VOWithBool(true);
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("equals is false when component is ValueObject versus primitive", () => {
    class Inner extends ValueObject {
      constructor(readonly id: number) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.id];
      }
    }
    class Outer extends ValueObject {
      constructor(readonly x: unknown) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.x];
      }
    }
    expect(new Outer(new Inner(1)).equals(new Outer(1))).toBe(false);
    expect(new Outer(1).equals(new Outer(new Inner(1)))).toBe(false);
  });

  it("equals compares nested ValueObject components by value", () => {
    class Nested extends ValueObject {
      constructor(readonly id: number) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.id];
      }
    }
    class Outer extends ValueObject {
      constructor(readonly n: Nested) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.n];
      }
    }
    expect(new Outer(new Nested(1)).equals(new Outer(new Nested(1)))).toBe(
      true
    );
  });

  it("getHashCode handles nested ValueObject component", () => {
    class NestedVO extends ValueObject {
      constructor(readonly id: number) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.id];
      }
    }
    class VOWithNested extends ValueObject {
      constructor(readonly nested: NestedVO) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.nested];
      }
    }
    const a = new VOWithNested(new NestedVO(1));
    const b = new VOWithNested(new NestedVO(1));
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("getHashCode handles boolean false", () => {
    class VOWithBool extends ValueObject {
      constructor(readonly flag: boolean) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.flag];
      }
    }
    const a = new VOWithBool(false);
    const b = new VOWithBool(false);
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("getHashCode uses getHashCode() when component has it", () => {
    const withHash = { id: 42, getHashCode: () => 12345 };
    class VOWithGetHashCode extends ValueObject {
      constructor(readonly obj: { getHashCode: () => number }) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.obj];
      }
    }
    const a = new VOWithGetHashCode(withHash);
    expect(a.getHashCode()).toBe(12345);
  });

  it("getHashCode uses valueOf() when component has it", () => {
    const withValueOf = { valueOf: () => 99 };
    class VOWithValueOf extends ValueObject {
      constructor(readonly obj: { valueOf: () => number }) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.obj];
      }
    }
    const a = new VOWithValueOf(withValueOf);
    const b = new VOWithValueOf(withValueOf);
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("getHashCode handles Date components via valueOf", () => {
    const d = new Date(1000);
    class VOWithDate extends ValueObject {
      constructor(readonly d: Date) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.d];
      }
    }
    const a = new VOWithDate(d);
    const b = new VOWithDate(new Date(1000));
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("getHashCode handles plain object component via stringRepresentationForHash", () => {
    const noProto = Object.create(null) as Record<string, unknown>;
    noProto.x = 1;
    class VOWithPlainObject extends ValueObject {
      constructor(readonly o: object) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.o];
      }
    }
    const a = new VOWithPlainObject(noProto);
    const b = new VOWithPlainObject(noProto);
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("equals uses valueEquals and returns false when equals returns false", () => {
    const withEquals = {
      id: 1,
      equals: (_other: unknown) => false,
    };
    class VOWithEqualsFalse extends ValueObject {
      constructor(readonly obj: { equals: (other: unknown) => boolean }) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.obj];
      }
    }
    const a = new VOWithEqualsFalse(withEquals);
    const b = new VOWithEqualsFalse({ id: 2, equals: () => false });
    expect(a.equals(b)).toBe(false);
  });

  it("getHashCode handles JSON.stringify catch for circular object without valueOf", () => {
    const circular = Object.create(null) as Record<string, unknown>;
    circular.a = 1;
    circular.self = circular;
    class VOWithCircular extends ValueObject {
      constructor(readonly o: object) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.o];
      }
    }
    const a = new VOWithCircular(circular);
    expect(a.getHashCode()).toBe(a.getHashCode());
  });

  it("getHashCode handles JSON.stringify catch when toJSON throws", () => {
    const bad = Object.create(null) as Record<string, unknown> & {
      toJSON?: () => never;
    };
    bad.toJSON = () => {
      throw new Error("toJSON");
    };
    class VOWithToJSONThrow extends ValueObject {
      constructor(readonly o: object) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.o];
      }
    }
    const a = new VOWithToJSONThrow(bad);
    expect(a.getHashCode()).toBe(a.getHashCode());
  });

  it("getHashCode handles symbol and bigint components", () => {
    const sym = Symbol("test");
    const bi = BigInt(10);
    class VOWithSymbolBigint extends ValueObject {
      constructor(
        readonly s: symbol,
        readonly b: bigint
      ) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.s, this.b];
      }
    }
    const a = new VOWithSymbolBigint(sym, bi);
    const b = new VOWithSymbolBigint(sym, bi);
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("getHashCode handles Date component without valueOf via stringRepresentationForHash", () => {
    const d = new Date(1000);
    Object.setPrototypeOf(d, null);
    class VOWithDateNoValueOf extends ValueObject {
      constructor(readonly d: Date) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.d];
      }
    }
    const a = new VOWithDateNoValueOf(d);
    const b = new VOWithDateNoValueOf(d);
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("getHashCode handles Array component without valueOf via stringRepresentationForHash", () => {
    const arr = [1, 2] as unknown[];
    Object.setPrototypeOf(arr, null);
    class VOWithArrayNoValueOf extends ValueObject {
      constructor(readonly arr: unknown[]) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.arr];
      }
    }
    const a = new VOWithArrayNoValueOf(arr);
    const b = new VOWithArrayNoValueOf(arr);
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("getHashCode handles function component without valueOf via stringRepresentationForHash", () => {
    const f = function namedFn(): void {};
    Object.setPrototypeOf(f, null);
    class VOWithFunctionNoValueOf extends ValueObject {
      constructor(readonly fn: () => void) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.fn];
      }
    }
    const a = new VOWithFunctionNoValueOf(f);
    const b = new VOWithFunctionNoValueOf(f);
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("getHashCode handles anonymous function without valueOf", () => {
    const f = ((): (() => void) => {
      const anon = function (): void {};
      Object.setPrototypeOf(anon, null);
      return anon;
    })();
    class VOWithAnonFn extends ValueObject {
      constructor(readonly fn: () => void) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.fn];
      }
    }
    const a = new VOWithAnonFn(f);
    expect(a.getHashCode()).toBe(a.getHashCode());
  });

  it("getHashCode handles null-proto function with undefined name", () => {
    const g = function (): void {};
    Object.defineProperty(g, "name", {
      value: undefined,
      configurable: true,
    });
    Object.setPrototypeOf(g, null);
    class VO extends ValueObject {
      protected getEqualityComponents(): Iterable<unknown> {
        return [g];
      }
    }
    expect(new VO().getHashCode()).toBe(new VO().getHashCode());
  });

  it("equals compares iterables via Array.from when Symbol.iterator is missing", () => {
    class VOArrayLike extends ValueObject {
      constructor(
        readonly a: number,
        readonly b: string
      ) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        const like = { length: 2, 0: this.a, 1: this.b };
        return like as unknown as Iterable<unknown>;
      }
    }
    const a = new VOArrayLike(1, "x");
    const b = new VOArrayLike(1, "x");
    expect(a.equals(b)).toBe(true);
  });

  it("equals is false when same class but component iterables differ in length", () => {
    class VODynamic extends ValueObject {
      constructor(readonly items: readonly unknown[]) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return this.items;
      }
    }
    expect(new VODynamic([1]).equals(new VODynamic([1, 2]))).toBe(false);
  });

  it("getHashCode treats null component as 0", () => {
    class VOWithNull extends ValueObject {
      protected getEqualityComponents(): Iterable<unknown> {
        return [null];
      }
    }
    const a = new VOWithNull();
    const b = new VOWithNull();
    expect(a.getHashCode()).toBe(b.getHashCode());
  });

  it("equals detects different-length equality components", () => {
    class VOLong extends ValueObject {
      constructor(
        readonly a: number,
        readonly b: number
      ) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.a, this.b];
      }
    }
    class VOShort extends ValueObject {
      constructor(readonly a: number) {
        super();
      }
      protected getEqualityComponents(): Iterable<unknown> {
        return [this.a];
      }
    }
    const long = new VOLong(1, 2);
    const short = new VOShort(1);
    expect(long.equals(short)).toBe(false);
  });
});

describe("valueObjectEquals", () => {
  it("returns true when both null or both undefined", () => {
    expect(valueObjectEquals(null, null)).toBe(true);
    expect(valueObjectEquals(undefined, undefined)).toBe(true);
  });

  it("returns false when one is null/undefined", () => {
    const a = new TestVO(1, "a");
    expect(valueObjectEquals(a, null)).toBe(false);
    expect(valueObjectEquals(null, a)).toBe(false);
  });

  it("delegates to equals when both defined", () => {
    const a = new TestVO(1, "a");
    const b = new TestVO(1, "a");
    expect(valueObjectEquals(a, b)).toBe(true);
  });
});
