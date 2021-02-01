import { DataPoint } from "@dpwiese/react-native-canvas-charts";

const ticksOptions = {
  autoSkipPadding: 100,
  autoSkip: true,
  minRotation: 0,
  maxRotation: 0,
};

const scaleLabelOptions = {
  display: true,
  labelString: "X-Axis Label",
};

export const chartConfig = {
  type: "line",
  data: {
    datasets: [
      {
        label: "My Legend Label",
        backgroundColor: "rgb(224, 110, 60)",
        borderColor: "rgb(224, 110, 60)",
        data: [] as DataPoint[],
        fill: false,
        pointRadius: 0,
        lineTension: 0.1,
        borderJoinStyle: "round",
      },
    ],
  },
  options: {
    animation: {
      duration: 0,
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "My Title",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    hover: {
      mode: "nearest",
      intersect: true,
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
          labelString: "My Y-Axis Label",
        },
      },
    },
  },
};
