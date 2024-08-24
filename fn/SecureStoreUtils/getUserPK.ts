import * as SecureStore from "expo-secure-store";

function getUserPK(userID: string): string | null {
  return SecureStore.getItem(`${userID}-pk`);
}

export { getUserPK };
