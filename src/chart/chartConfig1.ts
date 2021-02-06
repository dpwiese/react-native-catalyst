import { DataPoint } from "@dpwiese/react-native-canvas-charts";

const xTickOptions = {
  autoSkipPadding: 100,
  autoSkip: true,
  minRotation: 0,
  maxRotation: 0,
  font: {
    size: 12,
  },
};

const xScaleLabelOptions = {
  display: true,
  labelString: "X-Axis Label",
  font: {
    size: 12,
  },
};

const yScaleLabelOptions = {
  display: true,
  labelString: "Y-Axis Label",
  font: {
    size: 12,
  },
};

const yTickOptions = {
  autoSkipPadding: 100,
  autoSkip: true,
  minRotation: 0,
  maxRotation: 0,
  font: {
    size: 12,
  },
};

export const chartConfig1 = {
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
        font: {
          size: 12,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      legend: {
        labels: {
          font: {
            size: 12,
          },
        },
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
        scaleLabel: xScaleLabelOptions,
        ticks: xTickOptions,
      },
      y: {
        display: true,
        scaleLabel: yScaleLabelOptions,
        ticks: yTickOptions,
      },
    },
  },
};
