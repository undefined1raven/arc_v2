import { useEffect, useState } from "react";
import { BackgroundTaskRunner } from "../BackgroundTaskRunner";
import { encrypt } from "@/fn/crypto/encrypt";
import { stringToCharCodeArray } from "@/fn/stringToCharCode";

type SingleEncryptProps = {
  plainText: string | null;
  symsk: string | null;
  onError?: Function;
  onEncrypted: Function;
};
function SingleEncrypt(props: SingleEncryptProps) {
  const [isReady, setIsReady] = useState<boolean>(false);
  useEffect(() => {
    if (
      props.plainText !== null &&
      props.plainText !== undefined &&
      props.symsk !== null &&
      props.symsk !== undefined
    ) {
      setIsReady(true);

    }
  }, [props.plainText, props.symsk]);

  return isReady ? (
    <BackgroundTaskRunner
      code={encrypt(props.symsk as string, props.plainText)}
      tx={Date.now()}
      messageHandler={(e) => {
        const response = JSON.parse(e.nativeEvent.data);
        if (response.status === "failed") {
          if (props.onError) {
            props.onError({ status: "failed", error: response.error });
          }
        } else {
          const encodedEncryptedData = JSON.stringify(
            stringToCharCodeArray(response.payload)
          );
          props.onEncrypted(encodedEncryptedData);
        }
      }}
    ></BackgroundTaskRunner>
  ) : (
    <></>
  );
}

export { SingleEncrypt };
