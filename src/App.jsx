import { useState, useEffect } from "react";
import CoinTable from "./components/coinTable";
import ChartModal from "./components/chartModal";
import Portfolio from "./components/Portfolio";
import PriceAlerts from "./components/PriceAlerts";
import MarketInsights from "./components/MarketInsights";
import { fetchCoins } from "./services/api";
import "./App.css";
import "./responsive.css";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [coins, setCoins] = useState([]);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("market");
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        setCoinsLoading(true);
        const { data } = await fetchCoins();
        if (isMounted) {
          setCoins(data);
          setCoinsLoading(false);
        }
      } catch (error) {
        console.error("Error loading coins:", error);
        if (isMounted) setCoinsLoading(false);
      }
    };

    loadInitialData();

    const interval = setInterval(loadInitialData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleAddToPortfolio = () => {
    setActiveTab("portfolio");
    // Scroll to portfolio section
    setTimeout(() => {
      document.querySelector(".portfolio-section")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🚀 Advanced Crypto Tracker</h1>
          <p className="app-subtitle">Real-time tracking, alerts, portfolio & market insights</p>
        </div>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "market" ? "active" : ""}`}
          onClick={() => setActiveTab("market")}
        >
          📈 Market
        </button>
        <button
          className={`tab-btn ${activeTab === "portfolio" ? "active" : ""}`}
          onClick={() => setActiveTab("portfolio")}
        >
          💼 Portfolio
        </button>
        <button
          className={`tab-btn ${activeTab === "alerts" ? "active" : ""}`}
          onClick={() => setActiveTab("alerts")}
        >
          🔔 Alerts
        </button>
        <button
          className={`tab-btn ${activeTab === "insights" ? "active" : ""}`}
          onClick={() => setActiveTab("insights")}
        >
          📊 Insights
        </button>
      </nav>

      <div className="container">
        {activeTab === "market" && (
          <>
            <CoinTable coins={coins} loading={coinsLoading} onSelect={setSelected} onAddToPortfolio={handleAddToPortfolio} />
            {selected && (
              <ChartModal coinId={selected} close={() => setSelected(null)} />
            )}
          </>
        )}

        {activeTab === "portfolio" && (
          <Portfolio portfolio={portfolio} onUpdate={setPortfolio} coins={coins} />
        )}

        {activeTab === "alerts" && (
          <PriceAlerts coins={coins} />
        )}

        {activeTab === "insights" && (
          <MarketInsights coins={coins} />
        )}
      </div>
    </div>
  );
}