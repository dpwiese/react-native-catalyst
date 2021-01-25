import ChartJs, { DataPoint, addData } from "../chart/ChartJs";
import React, { ReactElement, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { ScrollView } from "react-native-gesture-handler";
import { chartConfig } from "../chart/chartConfig";

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


const initialData: DataPoint[] = [];

export default (): ReactElement => {
  const [num, setNum] = useState(0);
  const [allData, setAllData] = useState<DataPoint[]>(initialData);

  const genData = (): void => {
    const increment = 500;
    const maxLength = 1500;
    const newData = [];
    for (let i = 0; i < increment; i++) {
      newData.push({ x: num + i, y: (Math.random() * 100).toString() });
    }
    setAllData(allData.concat(newData));
    if (allData.length > maxLength) {
      allData.splice(0, allData.length - maxLength);
    }
    setNum(num + increment);
    // Pass fake data to ChartJs component
    addData(allData.concat(newData));
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Home</Text>
            <Button onPress={genData} text={"Add Data"} />
          </View>
          <ChartJs data={initialData} chartConfig={chartConfig} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
