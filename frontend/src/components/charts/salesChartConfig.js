// src/charts/salesChartConfig.js

export const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Sales & Orders Over Time',
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

export const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales ($)',
      data: [12, 45, 68, 45, 23, 44, 60],
      borderColor: "#198753",
      backgroundColor: 'rgba(42,117,38,0.5)',
      yAxisID: 'y',
    },
    {
      label: 'Orders',
      data: [12, 45, 68, 45, 78, 4, 30],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      yAxisID: 'y1',
    },
  ],
};
