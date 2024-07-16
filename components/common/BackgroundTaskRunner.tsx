import { getVal } from "@/app/config/defaultTransitionConfig";
import { useEffect, useRef } from "react";
import WebView from "react-native-webview";


type BackgroundTaskRunnerProps = { code: string, messageHandler: Function, source?: string, triggeredCode?: string, tx?: string };
function BackgroundTaskRunner(props: BackgroundTaskRunnerProps) {
    const worker = useRef(null);

    useEffect(() => {
        if (worker !== null || props.triggeredCode !== '') {
            worker.current.injectJavaScript(getVal(props.triggeredCode, ''));
        }
    }, [props.tx])

    return (
        <WebView
            ref={worker}
            style={{ width: 0, height: 0, position: 'absolute', opacity: 0 }}
            originWhitelist={['*']}
            injectedJavaScript={getVal(props.code, '')}
            onMessage={getVal(props.messageHandler, () => { })}
            source={{
                uri: 'https://ankaryn.online',
            }}></WebView>
    )
}

export { BackgroundTaskRunner }