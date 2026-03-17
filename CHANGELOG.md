# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - Initial release

### Added

- **Entity** — Abstract base for domain objects with identity; equality by `id` (reference equality).
- **IEntity&lt;TId&gt;** — Interface for entities with `readonly id: TId`.
- **entityEquals** — Null-safe equality for two entities.
- **ValueObject** — Abstract base with equality and hashing via `getEqualityComponents()`.
- **valueObjectEquals** — Null-safe equality for two value objects.
- Law-based tests for Entity (reflexivity, symmetry, transitivity, null handling).
- Unit tests and 90% coverage thresholds (branches, functions, lines, statements).

[Unreleased]: https://github.com/robotico-dev/robotico-domain-typescript/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/robotico-dev/robotico-domain-typescript/releases/tag/v0.1.0
