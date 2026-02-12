import { useState, useEffect } from "react";

export default function Portfolio({ onUpdate, coins }) {
  const [holdings, setHoldings] = useState(() => {
    const saved = localStorage.getItem("cryptoHoldings");
    return saved ? JSON.parse(saved) : [];
  });
  const [newHolding, setNewHolding] = useState({ coinId: "", amount: "", buyPrice: "" });

  useEffect(() => {
    localStorage.setItem("cryptoHoldings", JSON.stringify(holdings));
    onUpdate(holdings);
  }, [holdings, onUpdate]);

  const addHolding = () => {
    if (newHolding.coinId && newHolding.amount && newHolding.buyPrice) {
      setHoldings([
        ...holdings,
        {
          ...newHolding,
          id: Date.now(),
          amount: parseFloat(newHolding.amount),
          buyPrice: parseFloat(newHolding.buyPrice),
          dateBought: new Date().toLocaleDateString(),
        },
      ]);
      setNewHolding({ coinId: "", amount: "", buyPrice: "" });
    }
  };

  const removeHolding = (id) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  const getPortfolioStats = () => {
    let totalInvested = 0;
    let totalCurrentValue = 0;

    holdings.forEach(holding => {
      const coin = coins.find(c => c.id === holding.coinId);
      const invested = holding.amount * holding.buyPrice;
      const current = holding.amount * (coin?.current_price || 0);
      totalInvested += invested;
      totalCurrentValue += current;
    });

    const gain = totalCurrentValue - totalInvested;
    const gainPercent = totalInvested > 0 ? (gain / totalInvested * 100) : 0;

    return { totalInvested, totalCurrentValue, gain, gainPercent };
  };

  const stats = getPortfolioStats();

  return (
    <div className="portfolio-section">
      <h2>💼 Portfolio Management</h2>

      <div className="portfolio-stats">
        <div className="stat">
          <label>Total Invested:</label>
          <span>${stats.totalInvested.toFixed(2)}</span>
        </div>
        <div className="stat">
          <label>Current Value:</label>
          <span>${stats.totalCurrentValue.toFixed(2)}</span>
        </div>
        <div className={`stat ${stats.gain >= 0 ? "gain" : "loss"}`}>
          <label>P&L:</label>
          <span>${stats.gain.toFixed(2)} ({stats.gainPercent.toFixed(2)}%)</span>
        </div>
      </div>

      <div className="add-holding">
        <h3>Add Holding</h3>
        <div className="holding-inputs">
          <select
            value={newHolding.coinId}
            onChange={(e) => setNewHolding({ ...newHolding, coinId: e.target.value })}
            className="select-coin"
          >
            <option value="">Select Coin</option>
            {coins.map(coin => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={newHolding.amount}
            onChange={(e) => setNewHolding({ ...newHolding, amount: e.target.value })}
            step="0.00000001"
          />
          <input
            type="number"
            placeholder="Buy Price"
            value={newHolding.buyPrice}
            onChange={(e) => setNewHolding({ ...newHolding, buyPrice: e.target.value })}
            step="0.00000001"
          />
          <button onClick={addHolding} className="btn-add-primary">Add</button>
        </div>
      </div>

      <div className="holdings-list">
        <h3>Your Holdings</h3>
        {holdings.length === 0 ? (
          <p className="empty">No holdings yet. Add your first cryptocurrency!</p>
        ) : (
          <table className="holdings-table">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Amount</th>
                <th>Current Price</th>
                <th>Current Value</th>
                <th>Invested</th>
                <th>Gain/Loss</th>
                <th>ROI %</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(holding => {
                const coin = coins.find(c => c.id === holding.coinId);
                if (!coin) return null;
                const invested = holding.amount * holding.buyPrice;
                const currentValue = holding.amount * coin.current_price;
                const gainLoss = currentValue - invested;
                const roi = (gainLoss / invested * 100);

                return (
                  <tr key={holding.id} className={gainLoss >= 0 ? "positive" : "negative"}>
                    <td className="coin-name">
                      <img src={coin.image} alt={coin.name} width="20" />
                      {coin.name}
                    </td>
                    <td>{holding.amount.toFixed(8)}</td>
                    <td>${coin.current_price.toLocaleString('en-US', {maximumFractionDigits: 2})}</td>
                    <td>${currentValue.toFixed(2)}</td>
                    <td>${invested.toFixed(2)}</td>
                    <td className={gainLoss >= 0 ? "green" : "red"}>
                      ${gainLoss.toFixed(2)}
                    </td>
                    <td className={roi >= 0 ? "green" : "red"}>
                      {roi.toFixed(2)}%
                    </td>
                    <td>
                      <button 
                        onClick={() => removeHolding(holding.id)}
                        className="btn-delete"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
