import { BackgroundTaskRunner } from "@/components/common/BackgroundTaskRunner";
import { unwrapTessKey } from "@/fn/unwrapTessSymkey";
import { useLocalUserIDsStore } from "@/stores/localUserIDsActual";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import * as jsesc from "jsesc";
import Animated from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import { getVal } from "@/app/config/defaultTransitionConfig";
function UnwrapTessSymkey(props: {
  pin: string | null;
  onSuccess: Function;
  onError: Function;
  userID?: string;
}) {
  const [codeTrigger, setCodeTrigger] = useState("");
  const [encryptedKey, setEncryptedKey] = useState("");
  const db = useSQLiteContext();
  const activeUserID = useLocalUserIDsStore().getActiveUserID();
  type UnwrapKeysType = {
    status: "failed" | "success";
    error: null | string | object;
    taskID: "unwrapTessSymkey";
    payload?: string;
  };

  useEffect(() => {
    if (props.pin !== null && encryptedKey !== null) {
      setCodeTrigger(Date.now().toString());
    }
  }, [props.pin, encryptedKey]);

  useEffect(() => {
    if (props.pin !== null) {
      db.getFirstAsync("SELECT PIKBackup FROM users WHERE id=?", [
        getVal(props.userID, activeUserID),
      ])
        .then((res) => {
          const parsed = JSON.parse(
            jsesc.default(res?.PIKBackup, { json: true })
          ) as object;
          const encryptedKey = JSON.stringify(JSON.parse(JSON.parse(parsed)));
          setEncryptedKey(encryptedKey);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.pin]);

  function handleWrappedKeys(e) {
    console.log(e.nativeEvent.data);
    if (codeTrigger !== "" && props.pin !== null) {
      const eventResponse: UnwrapKeysType = JSON.parse(e.nativeEvent.data);
      if (
        eventResponse.status === "success" &&
        typeof eventResponse.payload === "string"
      ) {
        SecureStore.setItemAsync(
          `${getVal(props.userID, activeUserID)}-tess-symkey`,
          eventResponse.payload
        )
          .then(() => {
            props.onSuccess();
          })
          .catch((e) => {
            props.onError({
              status: "failed",
              error: "Failed to save key to keychain",
            });
          });
      } else {
        props.onError({ status: "failed", error: "Cannot unwrap key" });
      }
    }
  }

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <BackgroundTaskRunner
        messageHandler={(e) => {
          handleWrappedKeys(e);
        }}
        tx={codeTrigger}
        triggeredCode={unwrapTessKey(props.pin, encryptedKey)}
      ></BackgroundTaskRunner>
    </Animated.View>
  );
}

export { UnwrapTessSymkey };
