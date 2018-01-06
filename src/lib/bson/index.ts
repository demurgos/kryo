import { Serializer } from "../serializer";
import { register as registerArray } from "./array";
import { register as registerBoolean } from "./boolean";
import { register as registerBuffer } from "./buffer";
import { register as registerCodepointString } from "./codepoint-string";
import { register as registerDate } from "./date";
import { register as registerDocument } from "./document";
import { register as registerFloat64 } from "./float64";
import { register as registerInteger } from "./integer";
import { register as registerJson } from "./json";
import { register as registerLiteral } from "./literal";
import { register as registerMap } from "./map";
import { register as registerNull } from "./null";
import { register as registerSimpleEnum } from "./simple-enum";
import { register as registerUcs2String } from "./ucs2-string";
import { register as registerUnion } from "./union";

export function createBsonSerializer(): Serializer {
  const serializer: Serializer = new Serializer("bson");
  registerArray(serializer);
  registerBoolean(serializer);
  registerBuffer(serializer);
  registerCodepointString(serializer);
  registerDate(serializer);
  registerDocument(serializer);
  registerFloat64(serializer);
  registerInteger(serializer);
  registerJson(serializer);
  registerLiteral(serializer);
  registerMap(serializer);
  registerNull(serializer);
  registerSimpleEnum(serializer);
  registerUcs2String(serializer);
  registerUnion(serializer);
  return serializer;
}
