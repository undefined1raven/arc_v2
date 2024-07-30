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
            setTx(Date.now());
        }, 30);
    }, [props.cipher])

    return (<View>
        <BackgroundTaskRunner
            tx={tx}

            JSObjectInsert={{ iv: props.iv, cipher: props.cipher }}
            triggeredCode={dataCryptoOps(props.symsk, 'decrypt', null)}
            code={dataCryptoOps(props.symsk, 'decrypt', null)}
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