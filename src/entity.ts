/**
 * Entity base class — domain objects with identity.
 * Aligned with Robotico.Domain (C#) and dev.robotico.domain (Kotlin).
 */

import type { IEntity } from "./i-entity.js";

/**
 * Base type for entities. Implements IEntity<TId> with equality by id.
 * Subclass and pass id to super(). Equality uses reference comparison for id
 * (this.id === other.id). Prefer primitive or value-type ids (e.g. string, number)
 * so that two entities with the same logical id compare equal; with object ids,
 * equality holds only when it is the same reference. Override equals in your
 * subclass if you need value-based id comparison.
 *
 * @throws Error when `id` is null or undefined
 */
export abstract class Entity<TId> implements IEntity<TId> {
  readonly id: TId;

  protected constructor(id: TId) {
    if (id == null) throw new Error("Entity id must not be null");
    this.id = id;
  }

  /**
   * Returns true if the other entity has the same id (reference equality).
   *
   * @param other - Another entity, or null/undefined
   * @returns true if other is non-null and has the same id as this entity
   */
  equals(other: Entity<TId> | null | undefined): boolean {
    if (other == null) return false;
    return this.id === other.id;
  }

  /**
   * String representation for debugging (constructor name and id).
   *
   * @returns A string like "EntityName(id=value)"
   */
  toString(): string {
    return `${this.constructor.name}(id=${String(this.id)})`;
  }
}
