import { DecryptionWorker } from "@/components/common/DecryptionWorker";
import RBox from "@/components/common/RBox";
import { updateArcFeatureConfig } from "@/hooks/arcFeatureConfig";
import { useEffect, useState } from "react";

type FetureConfigDecryptorPropsType = {
  encryptedFeatureConfig: string | null;
  symsk: string | null;
  onError: Function;
  onDecryption: Function;
};
function FeatureConfigDecryptor(props: FetureConfigDecryptorPropsType) {
  const [encodedCipher, setEncodedCipher] = useState<null | string>(null);
  const [encodedIV, setEncodedIV] = useState<null | string>(null);
  const [readyToDecrypt, setReadyToDecrypt] = useState<boolean>(false);
  function encode(str: string) {
    const enc = new TextEncoder().encode(str);
    return JSON.stringify(enc);
  }

  useEffect(() => {
    if (
      props.encryptedFeatureConfig !== null &&
      props.encryptedFeatureConfig.length > 0
    ) {
      try {
        const { iv, cipher } = JSON.parse(props.encryptedFeatureConfig);
        if (cipher && iv) {
          const eCipher = encode(cipher);
          const eIV = encode(iv);
          setEncodedCipher(eCipher);
          setEncodedIV(eIV);
        }
      } catch (e) {}
    }
  }, [props.encryptedFeatureConfig]);

  useEffect(() => {
    if (encodedCipher !== null && encodedIV !== null && props.symsk !== null) {
      setReadyToDecrypt(true);
    }
  }, [encodedCipher, encodedIV, props.symsk]);

  return readyToDecrypt ? (
    <DecryptionWorker
      onError={(e) => {
        try {
          props.onError(e);
        } catch (e) {}
      }}
      iv={encodedIV as string}
      symsk={props.symsk}
      onDecrypted={(e) => {
        try {
          const parsedFC = JSON.parse(e);
          props.onDecryption(parsedFC);
        } catch (e) {
          props.onDecryption({ error: "uwu" });
        }
      }}
      cipher={encodedCipher as string}
    ></DecryptionWorker>
  ) : (
    <RBox></RBox>
  );
}

export { FeatureConfigDecryptor };
