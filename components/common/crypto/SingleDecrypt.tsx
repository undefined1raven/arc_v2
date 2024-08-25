import { useEffect, useState } from "react";
import { BackgroundTaskRunner } from "../BackgroundTaskRunner";
import { decrypt } from "@/fn/crypto/decrypt";
import { View } from "react-native";

type SingleDecryptProps = {
  encryptedObj: string | null;
  symsk: string | null;
  onError?: Function;
  onDecrypted: Function;
};
function SingleDecrypt(props: SingleDecryptProps) {
  const [isReady, setIsReady] = useState<boolean>(false);
  useEffect(() => {
    if (
      props.encryptedObj !== null &&
      props.encryptedObj !== undefined &&
      props.symsk !== null &&
      props.symsk !== undefined
    ) {
      setIsReady(true);
    }
  }, [props.encryptedObj, props.symsk]);

  return isReady ? (
    <View style={{ opacity: 0 }}>
      <BackgroundTaskRunner
        code={decrypt(props.symsk as string, props.encryptedObj)}
        tx={Date.now()}
        messageHandler={(e) => {
          const response = JSON.parse(e.nativeEvent.data);
          if (response.status === "failed") {
            if (props.onError) {
              props.onError({ status: "failed", error: response.error });
            }
          } else {
            try {
              const decodedDecryptedData = JSON.parse(response.payload);
              props.onDecrypted(decodedDecryptedData);
            } catch (e) {
              if (props.onError) {
                props.onError({ status: "failed", error: "Decryption failed" });
              }
            }
          }
        }}
      ></BackgroundTaskRunner>
    </View>
  ) : (
    <></>
  );
}

export { SingleDecrypt };
