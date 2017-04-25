import {Incident} from "incident";

/* tslint:disable-next-line:no-namespace */
export namespace MinArrayLengthError {
  export type Name = "MinArrayLength";
  export const name: Name = "MinArrayLength";
  export interface Data {
    array: any[];
    min: number;
  }
  export type Cause = undefined;
  export type Type = Incident<Name, Data, Cause>;
  export function format({array, min}: Data): string {
    return `Expected array length (${array.length}) to be greater than or equal to ${min}`;
  }
  export function create(array: any[], min: number): Type {
    return Incident(name, {array, min}, format);
  }
}

export type MinArrayLengthError = MinArrayLengthError.Type;

export default MinArrayLengthError;