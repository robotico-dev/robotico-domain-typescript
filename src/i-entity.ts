/**
 * Marks an entity with an identifier of type TId. Equality is by id (reference equality).
 * Implement {@link Entity} or use this interface for typing.
 */
export interface IEntity<TId> {
  readonly id: TId;
}
