import React, { ReactElement, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { ScrollView } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chartJsHtml = require("../chart/index.html");

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "white",
  },
  body: {
    backgroundColor: "white",
    height: 1000,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    height: 100,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "black",
  },
});

// TODO@dpwiese
//  - Import Chart.js from separate .js file
//  - Put all of this in nice wrapper?

type DataPoint = {
  x: number;
  y: string;
};

export default (): ReactElement => {
  const [num, setNum] = useState(0);
  const [allData, setAllData] = useState<DataPoint[]>([]);

  let webref: WebView<{ originWhitelist: string[]; ref: unknown; source: { html: string } }> | null;

  const chartConfig = JSON.stringify(require("../chart/chartConfig").chartConfig);

  const addData = (data: DataPoint[]): void => {
    // Update chart data
    webref?.injectJavaScript(`window.canvasLine.config.data.datasets[0].data = ${JSON.stringify(data)};`);
    webref?.injectJavaScript(`window.canvasLine.update();`);
  };

  const genData = (): void => {
    const newData = [];
    for (let i = 0; i < 500; i++) {
      newData.push({ x: num + i, y: (Math.random() * 100).toString() });
    }
    setAllData(allData.concat(newData));
    if (allData.length > 1000) {
      allData.splice(0, allData.length - 1000);
    }
    setNum(num + 500);
    addData(allData);
  };

  // Configure single chart with chartConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addChart = (config: any): void => {
    webref?.injectJavaScript(`const canvasEl = document.getElementById('canvasId');true;`);
    webref?.injectJavaScript(`window.canvasLine = new Chart(canvasEl.getContext('2d'), ${config});true;`);
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Home</Text>
            <Button onPress={genData} text={"Add Data"} />
          </View>
          <WebView
            originWhitelist={["*"]}
            ref={(r): WebView<{ originWhitelist: string[]; ref: unknown; source: { html: string } }> | null =>
              (webref = r)
            }
            source={chartJsHtml}
            onLoadEnd={(): void => addChart(chartConfig)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
