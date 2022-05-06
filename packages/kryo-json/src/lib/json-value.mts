/**
 * This module defines the `JsonValue` type. This is a stronger alternative to `any` for the
 * return type of `JSON.parse(str)`.
 *
 * @module kryo/json-value
 */

/**
 * Represents an atomic JSON value or a JSON object.
 */
export type JsonBaseValue = boolean | string | null | number | {[P in keyof any]: JsonValue};

/**
 * Represents an array of JSON values.
 */
export interface JsonArrayValue extends Array<JsonValue> {
}

/**
 * Represents a JSON value: a value returned by `JSON.parse(str)`.
 */
export type JsonValue = JsonArrayValue | JsonBaseValue;
