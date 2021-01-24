import React, { ReactElement, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { ScrollView } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";

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
//  - Use local copy of Chart.js, not getting from CDN
//  - Put HTML in separate (HTML) file
//  - Make it easier to pass chart options from RN side
//  - Put all of this in nice wrapper?

type DataPoint = {
  x: number;
  y: string;
};

export default (): ReactElement => {
  const [num, setNum] = useState(0);
  const [allData, setAllData] = useState<DataPoint[]>([]);

  let webref: WebView<{ originWhitelist: string[]; ref: unknown; source: { html: string } }> | null;

  const addData = (): void => {
    const newData = [];
    for (let i = 0; i < 500; i++) {
      newData.push({ x: num + i, y: (Math.random() * 100).toString() });
    }
    setAllData(allData.concat(newData));
    if (allData.length > 1000) {
      allData.splice(0, allData.length - 1000);
    }
    webref?.injectJavaScript(`window.canvasLine.config.data.datasets[0].data = ${JSON.stringify(allData)};`);
    webref?.injectJavaScript(`window.canvasLine.update();`);
    setNum(num + 500);
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Home</Text>
            <Button onPress={addData} text={"Add Data"} />
          </View>
          <WebView
            originWhitelist={["*"]}
            ref={(r): WebView<{ originWhitelist: string[]; ref: unknown; source: { html: string } }> | null =>
              (webref = r)
            }
            source={{
              html: `
              <html>
                <head>
                  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.0.0-beta.8"></script>
                </head>

                <body>
                  <canvas id="canvasId" height="200"></canvas>

                  <script>
                    window.onload = function() {
                      const ticksOptions = {
                        autoSkipPadding: 100,
                        autoSkip: true,
                        minRotation: 0,
                        maxRotation: 0,
                      };

                      const scaleLabelOptions = {
                        display: true,
                        labelString: 'X-Axis Label',
                      }

                      const chartConfig = {
                        type: 'line',
                        data: {
                          datasets: [{
                            label: 'My Legend Label',
                            backgroundColor: 'rgb(224, 110, 60)',
                            borderColor: 'rgb(224, 110, 60)',
                            data: [],
                            fill: false,
                            pointRadius: 0,
                            lineTension: 0.1,
                            borderJoinStyle: "round",
                          }]
                        },
                        options: {
                          plugins: {
                            title: {
                              text: 'My Title',
                            },
                          },
                          scales: {
                            x: {
                              type: "linear",
                              display: true,
                              scaleLabel: scaleLabelOptions,
                              ticks: ticksOptions,
                            },
                            y: {
                              display: true,
                              scaleLabel: {
                                display: true,
                                labelString: 'My Y-Axis Label'
                              },
                            }
                          }
                        }
                      };

                      // Set tooltip timestamp
                      Chart.defaults.plugins.tooltip.mode = 'index';
                      Chart.defaults.plugins.tooltip.intersect = false;

                      // Reponsive chart with title
                      Chart.defaults.responsive = true;
                      Chart.defaults.plugins.title.display = true;

                      // Set hover
                      Chart.defaults.hover.mode = 'nearest';
                      Chart.defaults.hover.intersect = true;

                      //
                      Chart.defaults.animation.duration = 0;

                      const canvasEl = document.getElementById('canvasId');
                      window.canvasLine = new Chart(canvasEl.getContext('2d'), chartConfig);
                    }
                  </script>
                </body>
              </html>
              `,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
