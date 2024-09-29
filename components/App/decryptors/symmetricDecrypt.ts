import { useGlobalStyleStore } from "@/stores/globalStyles";
import useDecryptionStore from "./decryptionStore";

const decryptionApi = useDecryptionStore.getState();
function symmetricDecrypt(cipherText: string): Promise<string> {
  const prom = new Promise<string>((resolve, reject) => {
    useDecryptionStore.subscribe((change) => {
      if (change.decryptedData !== null) {
        if (change.decryptedData !== "error") {
          resolve(change.decryptedData);
        } else {
          reject("error");
        }
      }
    });
    decryptionApi.setCipherText(cipherText);
  });
  return prom;
}

export { symmetricDecrypt };
