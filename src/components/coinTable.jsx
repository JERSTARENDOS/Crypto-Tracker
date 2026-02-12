import { useState } from "react";

export default function CoinTable({ coins, onSelect, onAddToPortfolio, loading }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [viewMode, setViewMode] = useState("auto"); // auto, table, card

  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price") return b.current_price - a.current_price;
    if (sortBy === "24h") return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
    if (sortBy === "market_cap") return (b.market_cap || 0) - (a.market_cap || 0);
    return 0;
  });

  // Determine view mode based on screen size if set to auto
  const isMobile = () => window.innerWidth <= 768;
  const renderAsCard = viewMode === "card" || (viewMode === "auto" && isMobile());

  return (
    <div className="coin-section">
      <div className="controls">
        <input
          placeholder="Search coin by name or symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="market_cap">Sort: Market Cap</option>
          <option value="price">Sort: Price</option>
          <option value="24h">Sort: 24h Change</option>
        </select>
        <div className="view-mode-toggle">
          <button
            className={`view-btn ${renderAsCard ? "active" : ""}`}
            onClick={() => setViewMode(renderAsCard ? "table" : "card")}
            title={renderAsCard ? "Switch to Table" : "Switch to Cards"}
          >
            {renderAsCard ? "📋 Table" : "🎴 Cards"}
          </button>
        </div>
      </div>

      {loading && !coins.length ? (
        <div className="skeleton-rows">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ))}
        </div>
      ) : null}

      {!loading && coins.length === 0 ? (
        <p className="loading">No coins found. Try refreshing.</p>
      ) : null}

      {renderAsCard ? (
        <div className="coin-cards">
          {sorted.map((coin, idx) => (
            <div key={coin.id} className={`coin-card ${coin.price_change_percentage_24h > 0 ? "positive" : "negative"}`}>
              <div className="card-header">
                <div className="card-rank">#{coin.market_cap_rank || idx + 1}</div>
                <div className="card-coin-info" onClick={() => onSelect(coin.id)}>
                  <img src={coin.image} alt={coin.name} width="32" />
                  <div>
                    <div className="card-name">{coin.name}</div>
                    <div className="card-symbol">{coin.symbol.toUpperCase()}</div>
                  </div>
                </div>
              </div>
              <div className="card-price">
                ${coin.current_price?.toLocaleString('en-US', {maximumFractionDigits: 2})}
              </div>
              <div className="card-changes">
                <div className="change-item">
                  <span>1h:</span>
                  <span className={coin.price_change_percentage_1h_in_currency > 0 ? "green" : "red"}>
                    {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                  </span>
                </div>
                <div className="change-item">
                  <span>24h:</span>
                  <span className={coin.price_change_percentage_24h > 0 ? "green" : "red"}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
                <div className="change-item">
                  <span>7d:</span>
                  <span className={coin.price_change_percentage_7d_in_currency > 0 ? "green" : "red"}>
                    {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="card-market-cap">
                Market Cap: ${coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) + "B" : "N/A"}
              </div>
              <button 
                className="btn-add-card"
                onClick={() => onAddToPortfolio(coin)}
                title="Add to Portfolio"
              >
                + Add to Portfolio
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="coin-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Price</th>
            <th>1h %</th>
            <th>24h %</th>
            <th>7d %</th>
            <th>Market Cap</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((coin, idx) => (
            <tr key={coin.id} className={coin.price_change_percentage_24h > 0 ? "positive" : "negative"}>
              <td>{coin.market_cap_rank || idx + 1}</td>
              <td className="coin-name" onClick={() => onSelect(coin.id)}>
                <img src={coin.image} alt={coin.name} width="20" />
                <span>{coin.name}</span>
                <span className="symbol">({coin.symbol.toUpperCase()})</span>
              </td>
              <td>${coin.current_price?.toLocaleString('en-US', {maximumFractionDigits: 2})}</td>
              <td className={coin.price_change_percentage_1h_in_currency > 0 ? "green" : "red"}>
                {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
              </td>
              <td className={coin.price_change_percentage_24h > 0 ? "green" : "red"}>
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td className={coin.price_change_percentage_7d_in_currency > 0 ? "green" : "red"}>
                {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
              </td>
              <td>${coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) + "B" : "N/A"}</td>
              <td>
                <button 
                  className="btn-add"
                  onClick={() => onAddToPortfolio(coin)}
                  title="Add to Portfolio"
                >
                  + Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      )}
    </div>
  );
}