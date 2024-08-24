import { defaultFeatureConfig } from "@/app/config/defaultFeatureConfig";
import { BackgroundTaskRunner } from "@/components/common/BackgroundTaskRunner";
import { SingleEncrypt } from "@/components/common/crypto/SingleEncrypt";
import { genenerateAccountCode } from "@/fn/generateAccountCode";
import { setTempCredentials } from "@/fn/setTempCredentials";
import { useHasCheckedTablesStore } from "@/stores/hasCheckedTables";
import { useLoadingScreenMessageStore } from "@/stores/loadingScreenMessage";
import { randomUUID } from "expo-crypto";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

type handleAccountInfoEventReturnSig = {
  status: "failed" | "success";
  error: null | string | object;
  taskID: "accountGen";
  symkey?: string;
  pk?: string;
  publicKey?: string;
};

type BasicAccountCreds = {
  pk: string;
  symkey: string;
  publicKey: string;
};

function AsyncGenNewAccountInfo() {
  const [
    completedFeatureConfigEncryption,
    setCompletedFeatureConfigEncryption,
  ] = useState<boolean>(false);
  const [arcEncryptedFeatureConfig, setArcEncryptedFeatureConfig] = useState<
    string | null
  >(null);
  const [sidEncryptedFeatureConfig, setSidEncryptedFeatureConfig] = useState<
    string | null
  >(null);

  const [tessEncryptedFeatureConfig, setTessEncryptedFeatureConfig] = useState<
    string | null
  >(null);

  const [basicAccountCreds, setBasicAccountCreds] =
    useState<null | BasicAccountCreds>(null);
  const featureConfigKeys = Object.keys(defaultFeatureConfig);

  function handleNewAccountInfo(e) {
    try {
      const data: handleAccountInfoEventReturnSig = JSON.parse(
        e.nativeEvent.data
      );
      if (data.status === "success") {
        setBasicAccountCreds({
          pk: data.pk as string,
          symkey: data.symkey as string,
          publicKey: data.publicKey as string,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  const updateLoadingScreenMessage = useLoadingScreenMessageStore(
    (store) => store.updateLoadingScreenMessage
  );
  const db = useSQLiteContext();
  const hasCheckedTables = useHasCheckedTablesStore().hasCheckedTables;
  useEffect(() => {
    updateLoadingScreenMessage({
      initialTime: Date.now(),
      message: "Generating Secure Keys",
    });
  }, []);

  useEffect(() => {
    if (
      sidEncryptedFeatureConfig !== null &&
      arcEncryptedFeatureConfig !== null &&
      tessEncryptedFeatureConfig !== null &&
      basicAccountCreds !== null
    ) {
      if (hasCheckedTables) {
        setTempCredentials({
          publicKey: basicAccountCreds.publicKey,
          symsk: basicAccountCreds.symkey,
          pk: basicAccountCreds.pk,
          arcFeatureConfig: arcEncryptedFeatureConfig,
          tessFeatureConfig: tessEncryptedFeatureConfig,
          SIDFeatureConfig: sidEncryptedFeatureConfig,
        }).then((res) => {
          console.log("done");
        });
      }
      setCompletedFeatureConfigEncryption(true);
      updateLoadingScreenMessage({
        initialTime: Date.now(),
        message: "Ready",
      });
    }
  }, [
    sidEncryptedFeatureConfig,
    arcEncryptedFeatureConfig,
    tessEncryptedFeatureConfig,
  ]);

  return basicAccountCreds !== null ? (
    <>
      {featureConfigKeys.map((key, index) =>
        !completedFeatureConfigEncryption ? (
          <View key={index} style={{ opacity: 0 }}>
            <SingleEncrypt
              symsk={basicAccountCreds.symkey}
              onEncrypted={(e) => {
                switch (key) {
                  case "arc":
                    setArcEncryptedFeatureConfig(e);
                    break;
                  case "sid":
                    setSidEncryptedFeatureConfig(e);
                    break;
                  case "tess":
                    setTessEncryptedFeatureConfig(e);
                    break;
                  default:
                    break;
                }
              }}
              onError={(e) => {
                console.log(e);
              }}
              plainText={JSON.stringify(defaultFeatureConfig[key])}
            />
          </View>
        ) : (
          <View key={index}></View>
        )
      )}
    </>
  ) : (
    <View style={{ opacity: 0 }}>
      <BackgroundTaskRunner
        tx={Date.now()}
        triggeredCode={genenerateAccountCode()}
        code={genenerateAccountCode()}
        messageHandler={(e) => {
          handleNewAccountInfo(e);
        }}
      ></BackgroundTaskRunner>
    </View>
  );
}

export { AsyncGenNewAccountInfo };
