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
import { SingleEncrypt } from "@/components/common/crypto/SingleEncrypt";
import { SingleDecrypt } from "@/components/common/crypto/SingleDecrypt";
import { defaultFeatureConfig } from "@/app/config/defaultFeatureConfig";
import { getInsertStringFromObject } from "@/fn/dbUtils";
import { useStore } from "@/stores/arcChunks";

type LoadDataProps = { symsk: string | null; activeUserID: string | null };
function LoadData(props: LoadDataProps) {
  const db = useSQLiteContext();
  const [readyToDecrypt, setReadyToDecrypt] = useState<boolean>(false);
  const [encoded, setEncoded] = useState<null | string>(null);
  const appendDecryptionQueue = useStore(
    (state) => state.appendDecryptionQueue
  );

  useEffect(() => {
    if (encoded !== null && props.activeUserID !== null) {
      // const chunkDefault: ARC_ChunksType = {
      //   id: `ARC-${Date.now()}-${randomUUID()}`,
      //   userID: props.activeUserID as string,
      //   encryptedContent: encoded,
      //   tx: Date.now(),
      //   iv: 'x',
      //   version: "0.1.1",
      // };
      // const insertString = getInsertStringFromObject(chunkDefault);
      // if (insertString.error === null && insertString.queryString) {
      //   console.log("here");
      //   db.runAsync(
      //     `INSERT INTO ARC_Chunks ${insertString.queryString}`,
      //     insertString.values
      //   )
      //     .then(() => {
      //       console.log("inserted");
      //     })
      //     .catch((e) => {
      //       console.log(e)
      //     });
      // }

      db.getAllAsync("SELECT * FROM ARC_Chunks WHERE userID = ? ORDER BY tx DESC", [
        props.activeUserID,
      ])
        .then((res) => {
          for(let ix = 0; ix < 2; ix++) {
            appendDecryptionQueue(res[ix].id);
          }
        })
        .catch((e) => {});
      setReadyToDecrypt(true);
    }
  }, [encoded, props.activeUserID]);

  return (
    <>
      <SingleEncrypt
        symsk={props.symsk}
        plainText={JSON.stringify([])}
        onEncrypted={(e) => {
          setEncoded(e);
        }}
      ></SingleEncrypt>
      {readyToDecrypt ? (
        <SingleDecrypt
          symsk={props.symsk}
          encryptedObj={encoded}
          onDecrypted={(e) => {
            console.log(e);
          }}
        ></SingleDecrypt>
      ) : (
        <></>
      )}
    </>
  );
}

export { LoadData };
