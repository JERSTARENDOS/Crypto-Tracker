import { useState, useEffect } from "react";
import { fetchGlobal, fetchTrending } from "../services/api";

export default function MarketInsights({ coins }) {
  const [globalData, setGlobalData] = useState(null);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarketData();
    const interval = setInterval(loadMarketData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      const [globalRes, trendingRes] = await Promise.all([
        fetchGlobal(),
        fetchTrending(),
      ]);
      setGlobalData(globalRes.data.data);
      setTrending(trendingRes.data.coins);
    } catch (error) {
      console.error("Error loading market data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTopGainers = () => {
    return [...coins]
      .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
      .slice(0, 5);
  };

  const getTopLosers = () => {
    return [...coins]
      .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
      .slice(0, 5);
  };

  const topGainers = getTopGainers();
  const topLosers = getTopLosers();

  return (
    <div className="insights-section">
      <h2>📊 Market Insights</h2>

      {loading && <p className="loading">Updating market data...</p>}

      {globalData && (
        <div className="global-stats">
          <div className="stat-card">
            <h4>Market Cap</h4>
            <p className="stat-value">
              ${(globalData.total_market_cap.usd / 1e12).toFixed(2)}T
            </p>
            <span className={globalData.market_cap_change_percentage_24h_usd > 0 ? "green" : "red"}>
              {globalData.market_cap_change_percentage_24h_usd?.toFixed(2)}%
            </span>
          </div>

          <div className="stat-card">
            <h4>24h Volume</h4>
            <p className="stat-value">
              ${(globalData.total_volume.usd / 1e9).toFixed(2)}B
            </p>
          </div>

          <div className="stat-card">
            <h4>BTC Dominance</h4>
            <p className="stat-value">
              {globalData.btc_market_cap_percentage?.toFixed(2)}%
            </p>
          </div>

          <div className="stat-card">
            <h4>Active Cryptocurrencies</h4>
            <p className="stat-value">
              {globalData.active_cryptocurrencies}
            </p>
          </div>
        </div>
      )}

      <div className="market-movers">
        <div className="movers-section">
          <h3>🚀 Top Gainers (24h)</h3>
          <div className="movers-list">
            {topGainers.map(coin => (
              <div key={coin.id} className="mover-card positive">
                <img src={coin.image} alt={coin.name} width="30" />
                <div className="mover-info">
                  <span className="mover-name">{coin.name}</span>
                  <span className="mover-symbol">{coin.symbol.toUpperCase()}</span>
                </div>
                <div className="mover-price">
                  <span>${coin.current_price?.toFixed(2)}</span>
                  <span className="green">+{coin.price_change_percentage_24h?.toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="movers-section">
          <h3>📉 Top Losers (24h)</h3>
          <div className="movers-list">
            {topLosers.map(coin => (
              <div key={coin.id} className="mover-card negative">
                <img src={coin.image} alt={coin.name} width="30" />
                <div className="mover-info">
                  <span className="mover-name">{coin.name}</span>
                  <span className="mover-symbol">{coin.symbol.toUpperCase()}</span>
                </div>
                <div className="mover-price">
                  <span>${coin.current_price?.toFixed(2)}</span>
                  <span className="red">{coin.price_change_percentage_24h?.toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {trending.length > 0 && (
        <div className="trending-section">
          <h3>🔥 Trending Now</h3>
          <div className="trending-grid">
            {trending.slice(0, 6).map((item, idx) => (
              <div key={idx} className="trending-card">
                <div className="trending-rank">#{idx + 1}</div>
                <img src={item.item.thumb} alt={item.item.name} width="40" />
                <div className="trending-info">
                  <span className="trending-name">{item.item.name}</span>
                  <span className="trending-symbol">{item.item.symbol}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
