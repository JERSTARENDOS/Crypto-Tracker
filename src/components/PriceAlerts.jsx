import { useState, useEffect } from "react";

export default function PriceAlerts({ coins }) {
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem("priceAlerts");
    return saved ? JSON.parse(saved) : [];
  });
  const [newAlert, setNewAlert] = useState({ coinId: "", type: "above", price: "" });
  const [notifications, setNotifications] = useState([]);

  // Check for alerts when coin prices change
  useEffect(() => {
    const showNotification = (coinName, currentPrice, type, alertPrice) => {
      const msg = `${coinName} is now ${type === "above" ? "above" : "below"} $${alertPrice} (Current: $${currentPrice.toFixed(2)})`;
      setNotifications(prev => [...prev, { id: Date.now(), msg }]);

      // Browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Crypto Tracker Alert", { body: msg, icon: "/crypto-icon.png" });
      }

      // Auto remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== Date.now()));
      }, 5000);
    };

    alerts.forEach(alert => {
      const coin = coins.find(c => c.id === alert.coinId);
      if (!coin) return;

      let triggered = false;
      if (alert.type === "above" && coin.current_price >= parseFloat(alert.price)) {
        triggered = true;
      } else if (alert.type === "below" && coin.current_price <= parseFloat(alert.price)) {
        triggered = true;
      }

      if (triggered && !alert.notified) {
        showNotification(coin.name, coin.current_price, alert.type, alert.price);
        alert.notified = true;
      }
    });
  }, [coins, alerts]);

  const addAlert = () => {
    if (newAlert.coinId && newAlert.price) {
      const alert = {
        id: Date.now(),
        coinId: newAlert.coinId,
        type: newAlert.type,
        price: parseFloat(newAlert.price),
        notified: false,
      };
      const updatedAlerts = [...alerts, alert];
      setAlerts(updatedAlerts);
      localStorage.setItem("priceAlerts", JSON.stringify(updatedAlerts));
      setNewAlert({ coinId: "", type: "above", price: "" });

      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  };

  const removeAlert = (id) => {
    const updatedAlerts = alerts.filter(a => a.id !== id);
    setAlerts(updatedAlerts);
    localStorage.setItem("priceAlerts", JSON.stringify(updatedAlerts));
  };

  const resetNotified = (id) => {
    const updatedAlerts = alerts.map(a => a.id === id ? { ...a, notified: false } : a);
    setAlerts(updatedAlerts);
  };

  return (
    <div className="alerts-section">
      <h2>🔔 Price Alerts</h2>

      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notif => (
            <div key={notif.id} className="notification alert-popup">
              ✓ {notif.msg}
            </div>
          ))}
        </div>
      )}

      <div className="add-alert">
        <h3>Create Alert</h3>
        <div className="alert-inputs">
          <select
            value={newAlert.coinId}
            onChange={(e) => setNewAlert({ ...newAlert, coinId: e.target.value })}
            className="select-coin"
          >
            <option value="">Select Coin</option>
            {coins.map(coin => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()}) - ${coin.current_price.toFixed(2)}
              </option>
            ))}
          </select>

          <select
            value={newAlert.type}
            onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
            className="select-type"
          >
            <option value="above">Price goes ABOVE</option>
            <option value="below">Price goes BELOW</option>
          </select>

          <input
            type="number"
            placeholder="Price Target"
            value={newAlert.price}
            onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
            step="0.01"
          />
          <button onClick={addAlert} className="btn-add-primary">Create Alert</button>
        </div>
      </div>

      <div className="alerts-list">
        <h3>Active Alerts ({alerts.length})</h3>
        {alerts.length === 0 ? (
          <p className="empty">No alerts yet. Create one to get started!</p>
        ) : (
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Current Price</th>
                <th>Alert Type</th>
                <th>Target Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => {
                const coin = coins.find(c => c.id === alert.coinId);
                if (!coin) return null;

                return (
                  <tr key={alert.id} className={alert.notified ? "triggered" : ""}>
                    <td className="coin-name">
                      <img src={coin.image} alt={coin.name} width="20" />
                      {coin.name}
                    </td>
                    <td>${coin.current_price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${alert.type}`}>
                        {alert.type.toUpperCase()}
                      </span>
                    </td>
                    <td>${alert.price.toFixed(2)}</td>
                    <td>
                      <span className={`status ${alert.notified ? "triggered" : "waiting"}`}>
                        {alert.notified ? "✓ TRIGGERED" : "⏳ WAITING"}
                      </span>
                    </td>
                    <td className="actions">
                      {alert.notified && (
                        <button 
                          onClick={() => resetNotified(alert.id)}
                          className="btn-secondary"
                          title="Reset"
                        >
                          Reset
                        </button>
                      )}
                      <button 
                        onClick={() => removeAlert(alert.id)}
                        className="btn-delete"
                        title="Delete"
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
