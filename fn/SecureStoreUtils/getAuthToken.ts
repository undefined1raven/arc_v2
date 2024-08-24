import * as SecureStore from "expo-secure-store";

function getAuthToken(userID: string): string | null {
  return SecureStore.getItem(`${userID}-authToken`);
}

export { getAuthToken };
