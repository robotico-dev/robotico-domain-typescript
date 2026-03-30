# Domain invariants

1. **Entity identity** — `IEntity<TId>` exposes `id`; equality helpers (`entityEquals`) compare by id (and type) as documented.
2. **Value objects** — `ValueObject` subclasses define structural equality; two VOs with the same components compare equal.
3. **Immutability** — Published APIs assume treat values as immutable at the boundary; mutating shared references breaks equality and hashing expectations.
