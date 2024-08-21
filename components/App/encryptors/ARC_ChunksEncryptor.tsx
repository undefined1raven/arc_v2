import { ARC_ChunksType } from "@/app/config/commonTypes";
import { DecryptionWorker } from "@/components/common/DecryptionWorker";
import { EncryptionWorker } from "@/components/common/EncryptionWorker";
import RBox from "@/components/common/RBox";
import { updateArcFeatureConfig } from "@/hooks/arcFeatureConfig";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type ARC_ChunksEncryptorPropsType = {
  plainChunk: string | null;
  symsk: string | null;
  onError: Function;
  onEncryption: Function;
};
function ARC_ChunksEncryptor(props: ARC_ChunksEncryptorPropsType) {
  const [readyToEncrypt, setReadyToEncrypt] = useState<boolean>(false);
  const [JSONString, setJSONString] = useState<string | null>(null);

  useEffect(() => {
    if (props.plainChunk !== null) {
      setJSONString(props.plainChunk);
    }
    if (JSONString !== null && props.symsk !== null) {
      setReadyToEncrypt(true);
    }
  }, [props.symsk, props.plainChunk]);

  return readyToEncrypt ? (
    <EncryptionWorker
      JSONstring={JSONString as string}
      onError={(e) => {
        try {
          props.onError(e);
        } catch (e) {}
      }}
      symsk={props.symsk as string}
      onEncrypted={(e) => {
        try {
          props.onEncryption(e);
        } catch (e) {
          props.onError(e);
        }
      }}
    ></EncryptionWorker>
  ) : (
    <RBox></RBox>
  );
}

export { ARC_ChunksEncryptor };
