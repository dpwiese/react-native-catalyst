import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chartJsHtml = require("./index.html");

// TODO@dpwiese
//  - Import Chart.js from separate .js source file without copy-paste
//  - Type Chart.js configuration

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 1000,
  },
});

export type DataPoint = {
  x: number;
  y: string;
};

type Props = {
  config: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  data: DataPoint[];
};

let webref: WebView<{ originWhitelist: string[]; ref: unknown; source: { html: string } }> | null;

export const setData = (data: DataPoint[]): void => {
  webref?.injectJavaScript(`window.canvasLine.config.data.datasets[0].data = ${JSON.stringify(data)};`);
  webref?.injectJavaScript(`window.canvasLine.update();`);
};

export default (props: Props): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addChart = (config: any): void => {
    webref?.injectJavaScript(`const canvasEl = document.getElementById('canvasId');true;`);
    webref?.injectJavaScript(
      `window.canvasLine = new Chart(canvasEl.getContext('2d'), ${JSON.stringify(config)});true;`
    );
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        ref={(r): WebView<{ originWhitelist: string[]; ref: unknown; source: { html: string } }> | null => (webref = r)}
        source={chartJsHtml}
        onLoadEnd={(): void => {
          addChart(props.config);
          setData(props.data);
        }}
      />
    </View>
  );
};
