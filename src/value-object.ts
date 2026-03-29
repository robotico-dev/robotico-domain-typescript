/**
 * ValueObject — equality and hashing based on getEqualityComponents().
 * Aligned with Robotico.Domain (C#) and dev.robotico.domain (Kotlin).
 *
 * Implementation details: equality uses iterablesEqual and valueEquals; hashing uses
 * hashValue, stringRepresentationForHash, fnv1aHash, stringHash, and hashCombine.
 * These helpers are not part of the public API; override getEqualityComponents() and
 * use equals() / getHashCode() only.
 */

function iterablesEqual(
  a: Iterable<unknown>,
  b: Iterable<unknown>,
  valueEq: (x: unknown, y: unknown) => boolean
): boolean {
  const it1 = (typeof a[Symbol.iterator] === "function" ? a : Array.from(a))[
    Symbol.iterator
  ]();
  const it2 = (typeof b[Symbol.iterator] === "function" ? b : Array.from(b))[
    Symbol.iterator
  ]();
  for (;;) {
    const n1 = it1.next() as IteratorResult<unknown, unknown>;
    const n2 = it2.next() as IteratorResult<unknown, unknown>;
    if (n1.done && n2.done) return true;
    if (n1.done !== n2.done) return false;
    const v1: unknown = n1.value;
    const v2: unknown = n2.value;
    if (v1 !== v2 && (v1 == null || v2 == null || !valueEq(v1, v2)))
      return false;
  }
}

/**
 * Base type for value objects. Override getEqualityComponents() and yield
 * the fields that define equality. Two value objects are equal iff their
 * component sequences are equal in order.
 */
export abstract class ValueObject {
  /**
   * Returns the components used for equality and hashing.
   * Override and yield all fields that define value equality.
   *
   * @returns An iterable of component values (order matters for equality)
   */
  protected abstract getEqualityComponents(): Iterable<unknown>;

  /**
   * Returns true if this and other are the same class and their equality components
   * are equal in order. Components are compared via strict equality, or equals() when
   * both support it, or ValueObject.equals for nested value objects.
   *
   * @param other - Another value object, or null/undefined
   * @returns true if same constructor and components are equal in order
   */
  equals(other: ValueObject | null | undefined): boolean {
    if (other == null || other.constructor !== this.constructor) return false;
    return iterablesEqual(
      this.getEqualityComponents(),
      other.getEqualityComponents(),
      valueEquals
    );
  }

  /**
   * Returns a hash code for use in collections (e.g. Map, Set). Not cryptographic;
   * collisions are possible. Override has no effect; hash is derived from
   * getEqualityComponents().
   *
   * @returns A number suitable for use in hash-based collections
   */
  getHashCode(): number {
    let hash = 0;
    for (const c of this.getEqualityComponents()) {
      hash = hashCombine(hash, c == null ? 0 : hashValue(c));
    }
    return hash;
  }

  /**
   * String representation for debugging (constructor name only).
   *
   * @returns The constructor name of this value object
   */
  toString(): string {
    return `${this.constructor.name}`;
  }
}

function valueEquals(a: unknown, b: unknown): boolean {
  if (a instanceof ValueObject && b instanceof ValueObject) return a.equals(b);
  if (
    typeof (a as { equals?: (x: unknown) => boolean })?.equals === "function"
  ) {
    return (a as { equals: (x: unknown) => boolean }).equals(b);
  }
  return false;
}

function hashValue(x: unknown): number {
  if (typeof x === "number" && Number.isInteger(x)) return x;
  if (typeof x === "string") return stringHash(x);
  if (typeof x === "boolean") return x ? 1 : 0;
  if (typeof x === "symbol" || typeof x === "bigint") {
    return fnv1aHash(stringRepresentationForHash(x));
  }
  if (x instanceof ValueObject) return x.getHashCode();
  if (
    typeof (x as { getHashCode?: () => number })?.getHashCode === "function"
  ) {
    return (x as { getHashCode: () => number }).getHashCode();
  }
  if (typeof (x as object).valueOf === "function") {
    return hashValue((x as { valueOf: () => unknown }).valueOf());
  }
  return fnv1aHash(stringRepresentationForHash(x));
}

function stringRepresentationForHash(x: unknown): string {
  const tag = Object.prototype.toString.call(x);
  if (tag === "[object Object]") {
    try {
      return JSON.stringify(x, Object.keys(x as object).sort());
    } catch {
      return tag;
    }
  }
  // Date: only reached when value had no valueOf (e.g. prototype set to null); use tag to avoid calling getTime which may be missing
  if (tag === "[object Date]") return Object.prototype.toString.call(x);
  if (typeof x === "object" && x !== null)
    return Object.prototype.toString.call(x);
  if (typeof x === "function")
    return `function:${(x as { name?: string }).name ?? "anonymous"}`;
  // Primitives (string, number, boolean, symbol, bigint) after object/function handling
  return String(x);
}

function fnv1aHash(s: string): number {
  let h = 2166136261 | 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0) | 0;
  }
  return (h >>> 0) | 0;
}

function stringHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

function hashCombine(hash: number, value: number): number {
  return (Math.imul(31, hash) + value) | 0;
}
