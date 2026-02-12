import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { fetchChart, fetchCoinDetails } from "../services/api";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

export default function ChartModal({ coinId, close }) {
  const [prices, setPrices] = useState([]);
  const [coinDetails, setCoinDetails] = useState(null);
  const [timeframe, setTimeframe] = useState("7");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [chartData, details] = await Promise.all([
          fetchChart(coinId, timeframe),
          fetchCoinDetails(coinId),
        ]);
        
        setPrices(chartData.data.prices);
        setCoinDetails(details.data);
      } catch (error) {
        console.error("Error loading chart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [coinId, timeframe]);

  if (!prices.length) {
    return (
      <div className="modal">
        <button onClick={close} className="btn-close">✕ Close</button>
        <div className="loading">Loading chart data...</div>
      </div>
    );
  }

  const chartPrices = prices.map(p => p[1]);
  const chartLabels = prices.map((_, i) => {
    const date = new Date(prices[i][0]);
    if (timeframe === "1") return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (timeframe === "7") return date.toLocaleDateString([], { month: "short", day: "numeric" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  });

  const minPrice = Math.min(...chartPrices);
  const maxPrice = Math.max(...chartPrices);
  const avgPrice = chartPrices.reduce((a, b) => a + b) / chartPrices.length;
  const change = chartPrices[chartPrices.length - 1] - chartPrices[0];
  const changePercent = (change / chartPrices[0] * 100);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: `${coinDetails?.name} Price`,
        data: chartPrices,
        borderColor: changePercent >= 0 ? "#10b981" : "#ef4444",
        backgroundColor: changePercent >= 0 
          ? "rgba(16, 185, 129, 0.1)" 
          : "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: changePercent >= 0 ? "#10b981" : "#ef4444",
        pointBorderColor: "#fff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: { usePointStyle: true },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "rgba(200, 200, 200, 0.1)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            <img src={coinDetails?.image?.large} alt={coinDetails?.name} width="40" />
            <div>
              <h2>{coinDetails?.name}</h2>
              <span className="modal-symbol">{coinDetails?.symbol?.toUpperCase()}</span>
            </div>
          </div>
          <button onClick={close} className="btn-close">✕</button>
        </div>

        <div className="modal-stats">
          <div className="stat">
            <label>Current Price:</label>
            <span>${chartPrices[chartPrices.length - 1]?.toFixed(2)}</span>
          </div>
          <div className="stat">
            <label>24h Change:</label>
            <span className={changePercent >= 0 ? "green" : "red"}>
              ${change.toFixed(2)} ({changePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="stat">
            <label>Avg Price:</label>
            <span>${avgPrice.toFixed(2)}</span>
          </div>
          <div className="stat">
            <label>High:</label>
            <span>${maxPrice.toFixed(2)}</span>
          </div>
          <div className="stat">
            <label>Low:</label>
            <span>${minPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="timeframe-buttons">
          {["1", "7", "30", "90"].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`btn-timeframe ${timeframe === tf ? "active" : ""}`}
            >
              {tf === "1" ? "1D" : tf + "D"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        {coinDetails && (
          <div className="coin-info">
            <div className="info-row">
              <label>Market Cap:</label>
              <span>${(coinDetails.market_data?.market_cap?.usd / 1e9).toFixed(2)}B</span>
            </div>
            <div className="info-row">
              <label>24h Volume:</label>
              <span>${(coinDetails.market_data?.total_volume?.usd / 1e9).toFixed(2)}B</span>
            </div>
            <div className="info-row">
              <label>Circulating Supply:</label>
              <span>{coinDetails.market_data?.circulating_supply?.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}