import { useEffect, useState } from "react";
import { SingleEncrypt } from "../common/crypto/SingleEncrypt";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import * as SecureStore from "expo-secure-store";
import useEncryptionStore from "./encryptors/encryptionStore";
function CryptoMain() {
  const encryptionAPI = useEncryptionStore();
  const activeUserID = useLocalUserIDsStore().getActiveUserID();
  const [encryptionLen, setEncryptionLen] = useState<number>(0);
  const [encryptionQueue, setEncryptionQueue] = useState<
    { plain: string; transactionID: string }[]
  >([]);

  useEffect(() => {
    const keys = Object.keys(encryptionAPI.plain);
    const queue = keys.map((key) => {
      return { plain: encryptionAPI.plain[key], transactionID: key };
    });
    setEncryptionQueue(queue);
  }, [encryptionAPI.plain]);

  useEffect(() => {
    setEncryptionLen(encryptionQueue.length);
  }, [encryptionQueue]);

  return encryptionLen > 0 ? (
    <>
      {encryptionQueue.forEach((item) => {
        <SingleEncrypt
          key={item.transactionID}
          plainText={item.plain}
          symsk={SecureStore.getItem(`${activeUserID}-symsk`)}
          onEncrypted={(e) => {
            encryptionAPI.setEncryptedData({ [item.transactionID]: e });
          }}
          onError={() => {
            encryptionAPI.setEncryptedData({ [item.transactionID]: "error" });
          }}
        ></SingleEncrypt>;
      })}
    </>
  ) : (
    <></>
  );
}

export { CryptoMain };
