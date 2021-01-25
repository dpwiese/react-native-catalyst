import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chartJsHtml = require("./index.html");

// TODO@dpwiese - Import Chart.js from separate .js source file without copy-paste

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
  data: DataPoint[];
  chartConfig: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

let webref: WebView<{ originWhitelist: string[]; ref: unknown; source: { html: string } }> | null;

export const addData = (data: DataPoint[]): void => {
  // Update chart data
  webref?.injectJavaScript(`window.canvasLine.config.data.datasets[0].data = ${JSON.stringify(data)};`);
  webref?.injectJavaScript(`window.canvasLine.update();`);
};

export default (props: Props): ReactElement => {
  const chartConfig = JSON.stringify(props.chartConfig);
  // Configure single chart with chartConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addChart = (config: any): void => {
    webref?.injectJavaScript(`const canvasEl = document.getElementById('canvasId');true;`);
    webref?.injectJavaScript(`window.canvasLine = new Chart(canvasEl.getContext('2d'), ${config});true;`);
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        ref={(r): WebView<{ originWhitelist: string[]; ref: unknown; source: { html: string } }> | null => (webref = r)}
        source={chartJsHtml}
        onLoadEnd={(): void => {
          addChart(chartConfig);
          addData(props.data);
        }}
      />
    </View>
  );
};
