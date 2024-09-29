import useEncryptionStore from "./encryptionStore";

const encryptionAPI = useEncryptionStore.getState();
function symmetricEncrypt(plain: string): Promise<string> {
  const prom = new Promise<string>((resolve, reject) => {
    useEncryptionStore.subscribe((change) => {
      if (change.encryptedData !== null) {
        if (change.encryptedData !== "error") {
          resolve(change.encryptedData);
        } else {
          reject("error");
        }
      }
    });
    encryptionAPI.setPlain(plain);
  });
  return prom;
}

export { symmetricEncrypt };
