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

export const chartConfig3 = {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        scaleLabel: xScaleLabelOptions,
        ticks: xTickOptions,
      },
      y: {
        beginAtZero: true,
        scaleLabel: yScaleLabelOptions,
        ticks: yTickOptions,
      },
    },
  },
};
