'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopProductsChartProps {
    chartData: {
        labels: string[];
        data: number[];
    }
}

export default function TopProductsChart({ chartData }: TopProductsChartProps) {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Клики',
                data: chartData.data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const, 
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Топ-5 товаров по кликам',
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            }
        }
    };

    return <Bar options={options} data={data} />;
}