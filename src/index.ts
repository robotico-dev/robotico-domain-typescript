/**
 * @robotico/domain — primitives, value objects, and entity abstractions for TypeScript.
 * Aligned with Robotico.Domain (C#) and dev.robotico.domain (Kotlin).
 *
 * @packageDocumentation
 */

export type { IEntity } from "./i-entity.js";
export { Entity, entityEquals } from "./entity.js";

export { ValueObject, valueObjectEquals } from "./value-object.js";
