import { useEffect, useState } from "react";
import { BackgroundTaskRunner } from "../BackgroundTaskRunner";
import { encrypt } from "@/fn/crypto/encrypt";
import { stringToCharCodeArray } from "@/fn/stringToCharCode";
import { View } from "react-native";

type SingleEncryptProps = {
  plainText: string | null;
  symsk: string | null;
  transactionID?: string;
  onError?: Function;
  onEncrypted: Function;
  onEncryptedWatching?: Function;
};
function SingleEncrypt(props: SingleEncryptProps) {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);
  useEffect(() => {
    setKey(Math.random());
    if (
      props.plainText !== null &&
      props.plainText !== undefined &&
      props.symsk !== null &&
      props.symsk !== undefined
    ) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [props.plainText, props.symsk]);

  return isReady ? (
    <View style={{ opacity: 0 }}>
      <BackgroundTaskRunner
        key={key}
        code={encrypt(
          props.symsk as string,
          props.plainText,
          props.transactionID || "no transaction id"
        )}
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
            if (props.onEncryptedWatching) {
              props.onEncryptedWatching({
                payload: encodedEncryptedData,
                transactionID: response.transactionID,
              });
            }
          }
        }}
      ></BackgroundTaskRunner>
    </View>
  ) : (
    <></>
  );
}

export { SingleEncrypt };
