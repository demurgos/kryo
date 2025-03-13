import { lazyProperties } from "./_helpers/lazy-properties.mts";
import type { IoType, Lazy, Type } from "./index.mts";

export type Name = "generic";
export const name: Name = "generic";

export interface GenericTypeOptions<Fn extends (...args: unknown[]) => unknown> {
  apply: (...typeArgs: Type<unknown>[]) => Type<ReturnType<Fn>>;
}

export interface GenericIoTypeOptions<Fn extends (...args: unknown[]) => unknown> {
  apply: (...typeArgs: IoType<unknown>[]) => IoType<ReturnType<Fn>>;
}

/**
 * TODO: Proper type inference
 * Requires:
 * - https://github.com/microsoft/TypeScript/issues/22617
 * - https://github.com/microsoft/TypeScript/issues/40111
 */
export interface GenericType<Fn extends (...args: unknown[]) => unknown> {
  apply(...typeArgs: Type<unknown>[]): Type<ReturnType<Fn>>;
}

export interface GenericIoType<Fn extends (...args: unknown[]) => unknown> {
  apply(...typeArgs: IoType<unknown>[]): IoType<ReturnType<Fn>>;
}

export interface GenericTypeConstructor {
  new<Fn extends (...args: unknown[]) => unknown>(options: Lazy<GenericIoTypeOptions<Fn>>): GenericIoType<Fn>;

  new<Fn extends (...args: unknown[]) => unknown>(options: Lazy<GenericTypeOptions<Fn>>): GenericType<Fn>;
}

/**
 * Generic type constructor (not a type itself).
 */
export const GenericType: GenericTypeConstructor = (class<Fn extends (...args: unknown[]) => unknown> {
  readonly name: Name = name;
  readonly apply!: (...typeArgs: Type<unknown>[]) => Type<ReturnType<Fn>>;

  #options: Lazy<GenericTypeOptions<Fn>>;

  constructor(options: Lazy<GenericTypeOptions<Fn>>) {
    this.#options = options;
    if (typeof options !== "function") {
      this.#applyOptions();
    } else {
      lazyProperties(this, this.#applyOptions, ["apply"]);
    }
  }

  #applyOptions(): void {
    if (this.#options === undefined) {
      throw new Error("missing `_options` for lazy initialization");
    }
    const options: GenericTypeOptions<Fn> = typeof this.#options === "function"
      ? this.#options()
      : this.#options;

    const apply: (...typeArgs: Type<unknown>[]) => Type<ReturnType<Fn>> = options.apply;

    Object.assign(this, {apply});
  }
}) as GenericTypeConstructor;
