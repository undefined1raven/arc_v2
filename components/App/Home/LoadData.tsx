import { useSQLiteContext } from "expo-sqlite";
import { ARC_ChunksDecryptor } from "../decryptors/ARC_ChunksDecryptor";
import { useEffect, useState } from "react";
import { ARC_ChunksType } from "@/app/config/commonTypes";
import store from "@/app/store";
import { updateArcChunks } from "@/hooks/arcChunks";
import { randomUUID } from "expo-crypto";
import { ARC_ChunksEncryptor } from "../encryptors/ARC_ChunksEncryptor";
import RBox from "@/components/common/RBox";
import { BackgroundTaskRunner } from "@/components/common/BackgroundTaskRunner";
import { dataCryptoOps } from "@/fn/dataCryptoOps";
import * as jsesc from "jsesc";
import { encrypt } from "@/fn/crypto/encrypt";
import { decrypt } from "@/fn/crypto/decrypt";

type LoadDataProps = { symsk: string | null; activeUserID: string | null };
function LoadData(props: LoadDataProps) {
  const db = useSQLiteContext();
  const [readyToDecrypt, setReadyToDecrypt] = useState<boolean>(false);
  const [encoded, setEncoded] = useState<null | string>(null);

  useEffect(() => {
    if (encoded !== null) {
      setReadyToDecrypt(true);
    }
  }, [encoded]);
  function stringToCharCodeArray(str) {
    const charCodeArray = [];
    for (let i = 0; i < str.length; i++) {
      charCodeArray.push(str.charCodeAt(i));
    }
    return charCodeArray;
  }
  return (
    <>
      <BackgroundTaskRunner
        code={encrypt(props.symsk, JSON.stringify({ hi: "helooooo" }))}
        tx={Date.now()}
        messageHandler={(e) => {
          const response = JSON.parse(e.nativeEvent.data);
          const xx = JSON.stringify(
            stringToCharCodeArray(response.payload)
          );
          setEncoded(xx);
        }}
      ></BackgroundTaskRunner>
      {readyToDecrypt ? (
        <BackgroundTaskRunner
          code={decrypt(props.symsk, encoded)}
          tx={Date.now()}
          messageHandler={(e) => {
            const response = JSON.parse(e.nativeEvent.data);
            console.log(response);
          }}
        ></BackgroundTaskRunner>
      ) : (
        <></>
      )}
    </>
  );
}

export { LoadData };
