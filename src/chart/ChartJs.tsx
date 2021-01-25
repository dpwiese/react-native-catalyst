import React, { ReactElement, forwardRef, useImperativeHandle } from "react";
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

export default forwardRef(
  (props: {}, ref): ReactElement => {
    let webref: WebView<{ originWhitelist: string[]; ref: unknown; source: { html: string } }> | null;

    const chartConfig = JSON.stringify(require("./chartConfig").chartConfig);

    // Configure single chart with chartConfig
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addChart = (config: any): void => {
      webref?.injectJavaScript(`const canvasEl = document.getElementById('canvasId');true;`);
      webref?.injectJavaScript(`window.canvasLine = new Chart(canvasEl.getContext('2d'), ${config});true;`);
    };

    useImperativeHandle(ref, () => ({
      addData(data: DataPoint[]): void {
        // Update chart data
        webref?.injectJavaScript(`window.canvasLine.config.data.datasets[0].data = ${JSON.stringify(data)};`);
        webref?.injectJavaScript(`window.canvasLine.update();`);
      },
    }));

    return (
      <View style={styles.container}>
        <WebView
          originWhitelist={["*"]}
          ref={(r): WebView<{ originWhitelist: string[]; ref: unknown; source: { html: string } }> | null =>
            (webref = r)
          }
          source={chartJsHtml}
          onLoadEnd={(): void => {
            addChart(chartConfig);
          }}
        />
      </View>
    );
  }
);
