import type { ValueObject } from "./value-object.js";

/**
 * Null-safe equality for two value objects.
 *
 * @param a - First value object or null/undefined
 * @param b - Second value object or null/undefined
 * @returns true if both null/undefined; false if exactly one is; otherwise a.equals(b)
 */
export function valueObjectEquals(
  a: ValueObject | null | undefined,
  b: ValueObject | null | undefined
): boolean {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return a.equals(b);
}
