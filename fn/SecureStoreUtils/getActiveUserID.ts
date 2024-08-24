import * as SecureStore from "expo-secure-store";

function getActiveUserID(): string | null {
  return SecureStore.getItem(`getActiveUserID`);
}

export { getActiveUserID };
