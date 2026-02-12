import { useEffect, useState } from "react";
import { fetchCoins } from "../services/api";

export default function CoinTable({ onSelect, onAddToPortfolio }) {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("market_cap");

  async function loadCoins() {
    try {
      setLoading(true);
      const { data } = await fetchCoins();
      setCoins(data);
    } catch (error) {
      console.error("Error loading coins:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoins();
    const interval = setInterval(loadCoins, 30000);
    return () => clearInterval(interval);
  }, []);

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
      </div>

      {loading && <p className="loading">Loading coins...</p>}

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
  );
}