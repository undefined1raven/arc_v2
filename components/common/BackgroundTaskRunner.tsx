import { getVal } from "@/app/config/defaultTransitionConfig";
import { useEffect, useRef } from "react";
import WebView from "react-native-webview";

type BackgroundTaskRunnerProps = {
  code: string;
  messageHandler: Function;
  source?: string;
  triggeredCode?: string;
  tx?: string | number;
  allowTriggering?: boolean | undefined;
  JSObjectInsert?: object;
};
function BackgroundTaskRunner(props: BackgroundTaskRunnerProps) {
  const worker = useRef(null);

  useEffect(() => {
    if (worker !== null || props.triggeredCode !== "") {
      worker.current.injectJavaScript(getVal(props.triggeredCode, ""));
    }
  }, [props.tx]);
  const html = `
  <html>
  <head>
  </head>
  <body>
  </body>
  `;
  return (
    <WebView
      ref={worker}
      webviewDebuggingEnabled={true}
      style={{ width: 0, height: 0, opacity: 0, display: "none" }}
      originWhitelist={["*"]}
      injectedJavaScript={getVal(props.code, "")}
      onMessage={(e) => {
        props.messageHandler(e);
      }}
      source={{
        html: html,
        mixedContentMode: "never",
        baseUrl: "https://localhost",
      }}
    ></WebView>
  );
}

export { BackgroundTaskRunner };
