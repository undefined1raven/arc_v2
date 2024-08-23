import { randomUUID } from "expo-crypto";

function newChunkID(): string {
  return `ARC-${Date.now()}-${randomUUID()}`;
}

export { newChunkID };
