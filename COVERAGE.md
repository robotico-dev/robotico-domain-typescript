# Coverage

- **Branches, statements, functions, lines:** 90% threshold. All are met.
- Tests cover equality, hashing, and law-based properties (reflexivity, symmetry, transitivity, hash consistency). Remaining uncovered branches in `value-object.ts` are in internal hashing helpers (e.g. paths that would require recursion, or optional chaining branches); the public API is fully covered.
- **Value-object branch coverage** sits at the 90% threshold by design; the few uncovered branches are defensive paths (e.g. `valueOf`, iterator handling) that are difficult to hit without artificial inputs.
