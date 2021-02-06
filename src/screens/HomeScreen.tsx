import { ChartJs, DataPoint, SetData } from "@dpwiese/react-native-canvas-charts";
import React, { ReactElement, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
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
    height: 100,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "black",
  },
  chart: {
    height: 500,
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

export default (): ReactElement => {
  const [num, setNum] = useState(0);
  const [allData, setAllData] = useState<DataPoint[]>(initialData1);
  const setDataRef = useRef<SetData>();

  const genData = (): void => {
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

  chartConfig1.data.datasets[0].data = initialData1;

  chartConfig2.data.datasets[0].data = initialData1;
  chartConfig2.data.datasets[1].data = initialData2;

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Button onPress={genData} text={"Add Data"} />
          </View>
          <ChartJs config={chartConfig1} style={styles.chart} ref={setDataRef} />
          <ChartJs config={chartConfig3} style={styles.chart} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
