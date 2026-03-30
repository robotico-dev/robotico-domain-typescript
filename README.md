# @robotico-dev/domain

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![ESM](https://img.shields.io/badge/module-ESM-FFCA28)](https://nodejs.org/api/esm.html) [![Vitest](https://img.shields.io/badge/tests-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/) [![ESLint](https://img.shields.io/badge/lint-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)

Domain primitives for TypeScript: **Entity** (identity-based equality) and **ValueObject** (equality by components). Aligned with Robotico.Domain (C#) and dev.robotico.domain (Kotlin).

## Install

```bash
npm install @robotico-dev/domain
```

**Requirements:** Node.js >= 18.

## Entity

Entities are identified by an `id`. Two entities are equal when their ids are equal (reference equality: `this.id === other.id`).

```ts
import { Entity, entityEquals } from "@robotico-dev/domain";

class Order extends Entity<string> {
  constructor(
    id: string,
    public readonly total: number
  ) {
    super(id);
  }
}

const a = new Order("ord-1", 100);
const b = new Order("ord-1", 200);
const c = new Order("ord-2", 100);

a.equals(b); // true (same id)
a.equals(c); // false
entityEquals(a, null); // false
entityEquals(null, null); // true
```

- **`Entity<TId>`** — abstract base; pass `id` to `super(id)`. Constructor throws if `id` is null/undefined.
- **`IEntity<TId>`** — interface with `readonly id: TId`.
- **`entityEquals(a, b)`** — null-safe equality; returns true if both null/undefined.
- **Equality is by identity:** `equals` uses reference equality on `id` (`this.id === other.id`). Prefer **primitive or value-type ids** (e.g. string, number) so that two entities with the “same” id compare equal. With object ids, equality holds only when it is the same reference.

## ValueObject

Value objects are equal when their **equality components** (from `getEqualityComponents()`) are equal in order. Use for values with no identity (e.g. money, address).

```ts
import { ValueObject, valueObjectEquals } from "@robotico-dev/domain";

class Money extends ValueObject {
  constructor(
    readonly amount: number,
    readonly currency: string
  ) {
    super();
  }
  protected getEqualityComponents(): Iterable<unknown> {
    return [this.amount, this.currency];
  }
}

const a = new Money(10, "USD");
const b = new Money(10, "USD");
a.equals(b); // true
a.getHashCode(); // same as b.getHashCode()
valueObjectEquals(a, b); // true
```

- **`ValueObject`** — override `getEqualityComponents()` and yield the fields that define equality.
- **`getHashCode()`** — for use in collections (e.g. `Map`/`Set`). Not cryptographic; collisions are possible.
- **`valueObjectEquals(a, b)`** — null-safe equality; also returns false if constructors differ.

### Equality and hashing

- Components are compared with: strict equality, or `equals` when both sides support it, or `ValueObject.equals` for nested value objects.
- `getHashCode()` supports primitives, strings, ValueObjects, and objects with `getHashCode()` or `valueOf()`; otherwise uses a string representation. Use only for in-memory collections.

## Quality and coverage

- **Principal quality bar (10/10):** Strict TypeScript, type-aware ESLint, full JSDoc, law-based tests for Entity and ValueObject, and coverage thresholds: **≥90%** for branches, statements, functions, and lines (see [COVERAGE.md](./COVERAGE.md) and [CHANGELOG.md](./CHANGELOG.md)). CI fails if coverage thresholds are not met. Versioning: [Semantic Versioning](https://semver.org/).

## API docs

Run `npm run docs` to generate API documentation in `docs/` (requires [TypeDoc](https://typedoc.org/)).

## License

MIT. See [repository](https://github.com/robotico-dev/robotico-domain-typescript) for more.
