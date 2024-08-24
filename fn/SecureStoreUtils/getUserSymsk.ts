import * as SecureStore from "expo-secure-store";

function getUserSymsk(userID: string): string | null {
  return SecureStore.getItem(`${userID}-symsk`);
}

export { getUserSymsk };
