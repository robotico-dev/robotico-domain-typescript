import type { Entity } from "./entity.js";

/**
 * Null-safe equality for two entities.
 *
 * @param a - First entity or null/undefined
 * @param b - Second entity or null/undefined
 * @returns true if both null/undefined; false if exactly one is; otherwise a.equals(b)
 */
export function entityEquals<TId>(
  a: Entity<TId> | null | undefined,
  b: Entity<TId> | null | undefined
): boolean {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return a.equals(b);
}
