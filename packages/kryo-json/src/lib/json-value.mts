/**
 * This module defines the `JsonValue` type. This is a stronger alternative to `any` for the
 * return type of `JSON.parse(str)`.
 *
 * @module kryo/json-value
 */

/**
 * Represents a primitive JSON value.
 */
export type JsonPrimitive = boolean | string | null | number;

/**
 * Represents a JSON value: a value returned by `JSON.parse(str)`.
 */
export type JsonValue = JsonPrimitive | { [P: string]: JsonValue } | JsonValue[];
