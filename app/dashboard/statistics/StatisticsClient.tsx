"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { FlyboothWithPrint } from "./page";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StatisticsClient({
  flybooths,
}: {
  flybooths: FlyboothWithPrint[];
}) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [timeGrouping, setTimeGrouping] = useState<"minute" | "hour" | "day">(
    "day"
  );

  // Function to format date based on time grouping
  const formatDateForGrouping = (
    dateString: string,
    grouping: "minute" | "hour" | "day"
  ): string => {
    const date = new Date(dateString);

    switch (grouping) {
      case "minute":
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      case "hour":
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:00`;
      case "day":
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
      default:
        return dateString.slice(0, 10); // YYYY-MM-DD format
    }
  };

  // Function to process data based on time grouping
  const processDataByTimeGrouping = () => {
    const timeStats: { [key: string]: { [flyboothName: string]: number } } = {};

    flybooths.forEach((flybooth) => {
      flybooth.print.forEach((print) => {
        const timeKey = formatDateForGrouping(
          print.createdAt.toISOString(),
          timeGrouping
        );

        if (!timeStats[timeKey]) {
          timeStats[timeKey] = {};
        }

        if (!timeStats[timeKey][flybooth.name]) {
          timeStats[timeKey][flybooth.name] = 0;
        }
        timeStats[timeKey][flybooth.name]++;
      });
    });

    return timeStats;
  };

  // Get processed data based on current time grouping
  const processedTimeStats = processDataByTimeGrouping();
  const timeKeys = Object.keys(processedTimeStats).sort();
  const allFlybooths = Array.from(
    new Set(
      Object.values(processedTimeStats).flatMap((time) => Object.keys(time))
    )
  );

  // Generate chart data based on time grouping
  const dynamicChartData = {
    labels: timeKeys,
    datasets: allFlybooths.map((flyboothName, index) => {
      const colors = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(153, 102, 255)",
        "rgb(255, 159, 64)",
        "rgb(199, 199, 199)",
        "rgb(83, 102, 147)",
      ];

      return {
        label: flyboothName,
        data: timeKeys.map(
          (timeKey) => processedTimeStats[timeKey][flyboothName] || 0
        ),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 2,
        fill: false,
      };
    }),
  };

  const getTimeGroupingLabel = () => {
    switch (timeGrouping) {
      case "minute":
        return "minute";
      case "hour":
        return "heure";
      case "day":
        return "jour";
      default:
        return "jour";
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: `Nombre d'impressions par ${getTimeGroupingLabel()} et par flybooth`,
        color: "white",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        beginAtZero: true,
      },
    },
  };

  if (!flybooths) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Statistiques</h1>
          <div className="bg-white/5 p-6 rounded-lg">
            <div className="text-white text-center">
              Aucune donnée disponible
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Statistiques</h1>
          <div className="flex gap-2">
            {/* Time Grouping Select */}
            <select
              value={timeGrouping}
              onChange={(e) =>
                setTimeGrouping(e.target.value as "minute" | "hour" | "day")
              }
              className="px-4 py-2 rounded bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="minute" className="bg-gray-800 text-white">
                Par minute
              </option>
              <option value="hour" className="bg-gray-800 text-white">
                Par heure
              </option>
              <option value="day" className="bg-gray-800 text-white">
                Par jour
              </option>
            </select>

            {/* Chart Type Buttons */}
            <button
              onClick={() => setChartType("line")}
              className={`px-4 py-2 rounded ${
                chartType === "line"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Ligne
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`px-4 py-2 rounded ${
                chartType === "bar"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Barres
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              Total Flybooths
            </h3>
            <p className="text-3xl font-bold text-blue-400">
              {flybooths.length}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              Total Impressions
            </h3>
            <p className="text-3xl font-bold text-green-400">
              {flybooths
                .map((fb) => fb.print.length)
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              Périodes ({getTimeGroupingLabel()}s)
            </h3>
            <p className="text-3xl font-bold text-purple-400">
              {timeKeys.length}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white/5 p-6 rounded-lg mb-6">
          <div className="h-96">
            {chartType === "line" ? (
              <Line data={dynamicChartData} options={chartOptions} />
            ) : (
              <Bar data={dynamicChartData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
