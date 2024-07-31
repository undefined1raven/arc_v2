import { getVal } from "@/app/config/defaultTransitionConfig";
import { BackgroundTaskRunner } from "./BackgroundTaskRunner";
import { encryptData } from "@/fn/encrypt";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { dataCryptoOps } from "@/fn/dataCryptoOps";

type EncryptionWorkerReturnType = { error: string | null | object, payload?: object, status: 'success' | 'failed', taskID: string };
type EncryptionWorkerProps = { cipher: string, iv: string, onDecrypted: Function, onError: Function, symsk: string };
function DecryptionWorker(props: EncryptionWorkerProps) {
    const [tx, setTx] = useState(Date.now());
    useEffect(() => {
        setTimeout(() => {
            if (props.cipher !== undefined && props.iv !== undefined) {
                setTx(Date.now());
            }
        }, 50);
    }, [props.cipher])

    return (<View>
        <BackgroundTaskRunner
            tx={tx}
            triggeredCode={dataCryptoOps(props.symsk, 'decrypt', props.iv + '^' + props.cipher)}
            code={dataCryptoOps(props.symsk, 'decrypt', props.iv + '^' + props.cipher)}
            messageHandler={(res: { nativeEvent: { data: string } }) => {
                const respone: EncryptionWorkerReturnType = JSON.parse(res.nativeEvent.data);
                if (respone.status === 'success') {
                    props.onDecrypted.apply(null, [respone.payload])
                } else {
                    props.onError.apply(null, [respone.error]);
                }
            }}></BackgroundTaskRunner>
    </View>)

}


export { DecryptionWorker };