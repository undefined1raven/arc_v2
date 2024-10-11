import { randomUUID } from "expo-crypto";
import useEncryptionStore from "./encryptionStore";

const encryptionAPI = useEncryptionStore.getState();
function symmetricEncrypt(
  plain: string,
  transactionID?: string | null | undefined
): Promise<string> {
  const prom = new Promise<string>((resolve, reject) => {
    function processResponse(response: { encryptedData: string }) {
      if (response.encryptedData !== "error") {
        resolve(response.encryptedData);
      } else {
        reject("error");
      }
    }
    useEncryptionStore.subscribe((change) => {
      const response = change.encryptedData;
      if (response !== null && response !== undefined) {
        if (typeof transactionID === "string") {
          if (response.transactionID === transactionID) {
            console.log("got a match using transactionID", transactionID);
            processResponse(response);
          }
        } else {
          processResponse(response);
        }
      }
    });
    encryptionAPI.setPlain(plain);
    encryptionAPI.setTransactionID(transactionID);
  });
  return prom;
}

export { symmetricEncrypt };
