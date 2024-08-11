import { getVal } from "@/app/config/defaultTransitionConfig";
import { BackgroundTaskRunner } from "./BackgroundTaskRunner";
import { encryptData } from "@/fn/encrypt";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { dataCryptoOps } from "@/fn/dataCryptoOps";

type EncryptionWorkerReturnType = { error: string | null | object, payload?: object, status: 'success' | 'failed', taskID: string };
type EncryptionWorkerProps = { JSONstring: string, onEncrypted: Function, onError: Function, symsk: string };
function EncryptionWorker(props: EncryptionWorkerProps) {
    const [tx, setTx] = useState(Date.now());
    useEffect(() => {
        setTimeout(() => {
            setTx(Date.now());
        }, 30);
    }, [])

    return (<View>
        <BackgroundTaskRunner
            tx={tx}
            code={'true'}
            triggeredCode={dataCryptoOps(props.symsk, 'encrypt', props.JSONstring)}
            messageHandler={(res: { nativeEvent: { data: string } }) => {
                const respone: EncryptionWorkerReturnType = JSON.parse(res.nativeEvent.data);
                if (respone.status === 'success') {
                    props.onEncrypted.apply(null, [respone.payload])
                } else {
                    props.onError.apply(null, [respone.error]);
                }
            }}></BackgroundTaskRunner>
    </View>)

}


export { EncryptionWorker };