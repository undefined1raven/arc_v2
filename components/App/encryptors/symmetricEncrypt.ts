import { randomUUID } from "expo-crypto";
import useEncryptionStore from "./encryptionStore";

const encryptionAPI = useEncryptionStore.getState();
function symmetricEncrypt(plain: string): Promise<string> {
  const transactionID = randomUUID();
  const prom = new Promise<string>((resolve, reject) => {
    useEncryptionStore.subscribe((change) => {
      const response = change.encryptedData[transactionID];
      if (response !== null && response !== undefined) {
        if (response !== "error") {
          resolve(response);
        } else {
          reject("error");
        }
      }
    });
    encryptionAPI.setPlain({ [transactionID]: plain });
  });
  return prom;
}

export { symmetricEncrypt };
