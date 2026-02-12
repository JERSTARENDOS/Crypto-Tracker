# 🚀 Advanced Crypto Tracker

A feature-rich, real-time cryptocurrency tracking application built with React, Vite, and the CoinGecko API. Track your favorite cryptocurrencies, manage your portfolio, set price alerts, and get real-time market insights!

## Features

### 📈 Real-Time Market Data
- **Live Price Tracking**: Real-time cryptocurrency prices updated every 30 seconds
- **Advanced Sorting**: Sort coins by market cap, price, or price change (1h, 24h, 7d)
- **Search Functionality**: Quickly find cryptocurrencies by name or symbol
- **Detailed Charts**: Interactive price charts with multiple timeframe options (1D, 7D, 30D, 90D)
- **Top 50 Cryptocurrencies**: View the top 50 cryptocurrencies by market cap

### 💼 Portfolio Management
- **Track Holdings**: Add and manage your cryptocurrency holdings
- **Portfolio Value**: Monitor your total investment value and current portfolio worth
- **ROI Tracking**: Track your return on investment for each position
- **Gain/Loss Monitoring**: See your profit or loss in real-time with percentage calculations
- **Buy Price Tracking**: Record the price you bought each cryptocurrency at
- **Easy Management**: Add or remove holdings with a simple interface

### 🔔 Smart Price Alerts
- **Custom Alerts**: Set alerts for "above" or "below" price targets
- **Real-Time Monitoring**: Continuous price monitoring with instant notifications
- **Browser Notifications**: Get desktop notifications when alerts are triggered
- **Alert Status**: Track which alerts have been triggered
- **Reset Alerts**: Easily reset triggered alerts to monitor them again
- **Local Storage**: Your alerts persist across browser sessions

### 📊 Advanced Market Insights
- **Global Market Statistics**: View total market cap, 24h volume, and BTC dominance
- **Top Gainers & Losers**: See the top 5 gainers and losers in the last 24 hours
- **Trending Cryptocurrencies**: Stay updated with currently trending coins
- **Market Trends**: Get comprehensive market data for better decision-making

### 📊 Interactive Charts
- **Interactive Candlestick & Line Charts**: Beautiful, responsive charts powered by Chart.js
- **Multiple Timeframes**: Choose between 1D, 7D, 30D, and 90D charts
- **Price Statistics**: View min, max, average, and percentage change
- **Detailed Coin Information**: See market cap, volume, and circulating supply

## Technology Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **HTTP Client**: Axios 1.13.5
- **Charts**: Chart.js 4.5.1 + react-chartjs-2 5.3.1
- **Styling**: Modern CSS with gradients and animations
- **API**: CoinGecko API (Free, no key required)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## Project Structure

```
crypto-tracker/
├── src/
│   ├── components/
│   │   ├── coinTable.jsx          # Main cryptocurrency table
│   │   ├── chartModal.jsx         # Interactive price charts
│   │   ├── Portfolio.jsx          # Portfolio management component
│   │   ├── PriceAlerts.jsx        # Price alert management
│   │   └── MarketInsights.jsx     # Market statistics and trends
│   ├── services/
│   │   └── api.js                 # CoinGecko API service
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Application styles
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Application entry point
├── public/                        # Static assets
├── package.json                   # Project dependencies
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

## How to Use

### 📍 Market Tab
1. Browse the top 50 cryptocurrencies
2. Search by coin name or symbol
3. Sort by market cap, price, or price change
4. Click on any coin to view detailed price chart
5. Click "+ Add" to add a coin to your portfolio

### 💼 Portfolio Tab
1. View your total investment and current portfolio value
2. See your overall profit/loss
3. Add new holdings with:
   - Select cryptocurrency
   - Enter amount held
   - Enter purchase price
4. Monitor individual coin performance (ROI, gain/loss)
5. Remove holdings with the "✕" button

### 🔔 Alerts Tab
1. Create custom price alerts
2. Choose between "above" or "below" price targets
3. Monitor all active alerts
4. Get notified when prices trigger your alerts
5. Reset triggered alerts to monitor again
6. Delete alerts you no longer need

### 📊 Insights Tab
1. View global cryptocurrency market statistics
2. See top gainers and losers over 24 hours
3. Browse trending cryptocurrencies
4. Monitor market cap and trading volume trends

### 📈 Using Charts
1. Click on any cryptocurrency to open the chart modal
2. Select different timeframes (1D, 7D, 30D, 90D)
3. View price statistics (current, min, max, average)
4. See percentage change over the selected period
5. Check market cap and trading volume information

## Features in Detail

### Real-Time Updates
- Cryptocurrency prices update every 30 seconds
- Market insights update every 60 seconds
- Charts update automatically when timeframe changes

### Data Persistence
- Portfolio holdings saved to browser's local storage
- Price alerts automatically saved
- Your data persists across browser sessions

### Notifications
- Visual in-app notifications when alerts trigger
- Optional browser desktop notifications (requires permission)
- Auto-dismissing notification popups

### Responsive Design
- Mobile-friendly interface
- Responsive tables and grids
- Optimized for all screen sizes

## API Information

This application uses the **CoinGecko API**, which provides:
- Free access (no API key required)
- Real-time cryptocurrency data
- Historical price data
- Market statistics
- No rate limiting for reasonable use

Learn more: https://www.coingecko.com/api

## Browser Notifications

To receive browser notifications:
1. Click "Create Alert" to enable notification permission
2. Allow notifications when prompted by your browser
3. Notifications will appear when alerts trigger

## Performance

- Optimized API calls to minimize requests
- Efficient state management with React hooks
- Lazy loading of charts
- Smooth animations and transitions
- Fast image loading from CoinGecko CDN

## Future Enhancements

- [ ] TypeScript support
- [ ] Advanced technical analysis tools
- [ ] Multiple portfolio support
- [ ] Historical data export
- [ ] Dark/Light theme toggle
- [ ] Mobile app version
- [ ] Advanced charting features
- [ ] Integration with trading APIs

## Troubleshooting

### Charts not showing?
- Ensure browser is allowing images from external sources
- Check your internet connection
- Refresh the page

### Alerts not working?
- Make sure you enable browser notifications
- Check if your browser supports notifications
- Verify the price target is valid

### Portfolio data disappeared?
- Check if your browser's local storage is enabled
- Clear browser cache carefully (won't affect data if stored properly)
- Try re-adding your holdings

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## License

This project is open source and available for personal and commercial use.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests for any improvements.

## Support

For issues, feature requests, or questions, please open an issue on the repository.

---

**Made with ❤️ for cryptocurrency enthusiasts and traders**

Happy tracking! 🚀💹
