import { SetData as CSetData, Chart, DataPoint } from "@dpwiese/react-native-canvas-charts/ChartJs";
import React, { ReactElement, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { UPlot, SetData as USetData } from "@dpwiese/react-native-canvas-charts/UPlot";
import Button from "../components/Button";
import { ScrollView } from "react-native-gesture-handler";
import { chartConfig1 } from "../chart/chartConfig1";
import { chartConfig2 } from "../chart/chartConfig2";
import { chartConfig3 } from "../chart/chartConfig3";

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "white",
  },
  body: {
    backgroundColor: "white",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    height: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "black",
  },
  chart: {
    height: 370,
  },
});

const initialData1: DataPoint[] = [
  { x: 1, y: 2 },
  { x: 2, y: 5 },
  { x: 3, y: 3 },
];

const initialData2: DataPoint[] = [
  { x: 1, y: 5 },
  { x: 2, y: 1 },
  { x: 3, y: 4 },
];

const opts = {
  title: "My Chart",
  id: "chart1",
  class: "my-chart",
  width: 400,
  height: 600,
  series: [
    {},
    {
      show: true,
      spanGaps: false,
      label: "RAM",
      value: (self: unknown, rawValue: number): string => "$" + rawValue.toFixed(2),
      stroke: "red",
      width: 1,
      fill: "rgba(255, 0, 0, 0.3)",
      dash: [10, 5],
    },
  ],
};

const initialData = [
  [0, 100],
  [35, 71],
  [90, 15],
];

export default (): ReactElement => {
  const [num, setNum] = useState(0);
  const [allData, setAllData] = useState<DataPoint[]>(initialData1);
  const setDataRef = useRef<CSetData>();
  const setUPlotDataRef = useRef<USetData>();

  const genChartJsData = (): void => {
    const increment = 500;
    const maxLength = 1500;
    const newData = [];
    for (let i = 0; i < increment; i++) {
      newData.push({ x: num + i, y: Math.random() * 100 });
    }
    setAllData(allData.concat(newData));
    if (allData.length > maxLength) {
      allData.splice(0, allData.length - maxLength);
    }
    setNum(num + increment);
    // Pass fake data to ChartJs component
    setDataRef.current?.setData([allData.concat(newData)]);
  };

  const genUPlotData = (): void => {
    const newXData = [];
    const newY1Data = [];
    const newY2Data = [];
    for (let i = 0; i < 5000; i++) {
      newXData.push(i * 100);
      newY1Data.push(Math.random() * 100);
      newY2Data.push(Math.random() * 100);
    }

    // Pass fake data to UPlot component
    setUPlotDataRef.current?.setData([newXData, newY1Data, newY2Data]);
  };

  chartConfig1.data.datasets[0].data = initialData1;

  chartConfig2.data.datasets[0].data = initialData1;
  chartConfig2.data.datasets[1].data = initialData2;

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Button onPress={genUPlotData} text={"Add Data"} />
          </View>
          <UPlot opts={opts} data={initialData} style={styles.chart} ref={setUPlotDataRef} />
          <View style={styles.sectionContainer}>
            <Button onPress={genChartJsData} text={"Add Data"} />
          </View>
          <Chart config={chartConfig1} style={styles.chart} ref={setDataRef} />
          <Chart config={chartConfig3} style={styles.chart} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
