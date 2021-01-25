import ChartJs, { DataPoint } from "../chart/ChartJs";
import React, { ReactElement, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { ScrollView } from "react-native-gesture-handler";

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

type AddData = {
  addData: (data: DataPoint[]) => void;
};

export default (): ReactElement => {
  const [num, setNum] = useState(0);
  const [allData, setAllData] = useState<DataPoint[]>([]);
  const addDataRef = useRef<AddData>();

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
    // Pass fake data to ChartJs component
    addDataRef.current?.addData(allData);
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Home</Text>
            <Button onPress={genData} text={"Add Data"} />
          </View>
          <ChartJs ref={addDataRef} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
