import { getVal } from "@/app/config/defaultTransitionConfig";
import { randomUUID } from "expo-crypto";

function newChunkID(prefix?: string): string {
  return `${getVal(prefix, "ARC")}-${Date.now()}-${randomUUID()}`;
}

export { newChunkID };
