import { ARC_ChunksType } from "@/app/config/commonTypes";
import { DecryptionWorker } from "@/components/common/DecryptionWorker";
import RBox from "@/components/common/RBox";
import { updateArcFeatureConfig } from "@/hooks/arcFeatureConfig";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type ARC_ChunksDecryptorPropsType = {
  encryptedChunks: string[] | null;
  symsk: string | null;
  onError: Function;
  onDecryption: Function;
};
function ARC_ChunksDecryptor(props: ARC_ChunksDecryptorPropsType) {
  const [encodedEncryptedObjects, setEncodedEncryptedObjects] = useState<
    { cipher: string; iv: string }[]
  >([]);
  const [readyToDecrypt, setReadyToDecrypt] = useState<boolean>(false);
  const [decryptedChunks, setDecryptedChunks] = useState<ARC_ChunksType[]>([]);
  function encode(str: string) {
    const enc = new TextEncoder().encode(str);
    return JSON.stringify(enc);
  }

  useEffect(() => {
    if (props.encryptedChunks !== null && props.encryptedChunks.length > 0) {
      try {
        for (let ix = 0; ix < props.encryptedChunks.length; ix++) {
          const chunk = props.encryptedChunks[ix];
          const { iv, cipher } = JSON.parse(chunk);
          if (cipher && iv) {
            const eCipher = encode(cipher);
            const eIV = encode(iv);
            setEncodedEncryptedObjects((prev) => [
              ...prev,
              { cipher: eCipher, iv: eIV },
            ]);
          }
        }
      } catch (e) {}
    }
  }, [props.encryptedChunks]);

  useEffect(() => {
    if (props.encryptedChunks !== null) {
      if (
        encodedEncryptedObjects !== null &&
        encodedEncryptedObjects.length === props.encryptedChunks.length &&
        props.symsk !== null
      ) {
        setReadyToDecrypt(true);
      }
    }
  }, [encodedEncryptedObjects, props.symsk]);

  useEffect(() => {
    if (
      decryptedChunks.length === props.encryptedChunks?.length &&
      typeof props.onDecryption === "function"
    ) {
      props.onDecryption(JSON.stringify(decryptedChunks));
    }
  }, [decryptedChunks]);

  return readyToDecrypt ? (
    encodedEncryptedObjects.map((encoded) => {
      return (
        <DecryptionWorker
          onError={(e) => {
            try {
              props.onError(e);
            } catch (e) {}
          }}
          iv={encoded.iv}
          symsk={props.symsk as string}
          onDecrypted={(e) => {
            try {
              const parsedFC = JSON.parse(e);
              setDecryptedChunks((prev) => [...prev, parsedFC]);
            } catch (e) {
              props.onError(e);
            }
          }}
          cipher={encoded.cipher}
        ></DecryptionWorker>
      );
    })
  ) : (
    <RBox></RBox>
  );
}

export { ARC_ChunksDecryptor };
