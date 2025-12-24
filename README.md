# 📈 Real-Time Cryptocurrency Tracker

A professional cryptocurrency tracking application featuring live prices, portfolio management, and market analytics. Track top 100 cryptocurrencies with real-time updates from CoinGecko API.

![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![API](https://img.shields.io/badge/API-CoinGecko-00B8D4?style=flat-square)

## ✨ Features

- 📊 **Live Price Tracking** - Real-time prices for top 100 cryptocurrencies
- 💼 **Portfolio Management** - Track your crypto holdings and profits
- ⭐ **Favorites System** - Quick access to your favorite coins
- 🔍 **Advanced Search** - Find any cryptocurrency instantly
- 📈 **7-Day Charts** - Visual price trends for each coin
- 🔄 **Auto-Refresh** - Updates every 60 seconds automatically
- 💰 **Profit/Loss Calculator** - Track investment performance
- 🎯 **Market Overview** - Total market cap, gainers, and losers
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 💾 **Data Persistence** - Favorites and portfolio saved locally
- ⚡ **Fast Performance** - Optimized rendering for 100+ coins

## 🚀 Live Demo

[View Live Demo](https://your-crypto-tracker.vercel.app) *(Add your deployment link)*

## 📸 Screenshots

*Add screenshots of your application*

```
Suggested screenshots:
- Market overview dashboard
- Cryptocurrency list with live prices
- Portfolio management interface
- Favorites section
- 7-day price charts
- Mobile responsive view
```

## 🛠️ Built With

**Frontend:**
- **React** - UI library with Hooks
- **Recharts** - Data visualization library
- **Tailwind CSS** - Modern styling framework
- **Lucide React** - Beautiful icons

**API Integration:**
- **CoinGecko API** - Real-time cryptocurrency data
- **Fetch API** - Async data fetching

**Storage:**
- **LocalStorage** - Persistent favorites and portfolio

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- No API key required (CoinGecko is free!)

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone https://github.com/TPADEJUWON/crypto-tracker.git
cd crypto-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Install required packages**
```bash
npm install lucide-react recharts
npm install -D tailwindcss@3.4.17 postcss autoprefixer
npx tailwindcss init -p
```

4. **Configure Tailwind CSS**

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. **Start development server**
```bash
npm start
```

6. **Open your browser**
Navigate to `http://localhost:3000`

## 📖 How to Use

### Tracking Cryptocurrencies
1. **Browse List**: View top 100 cryptocurrencies by market cap
2. **Search**: Type coin name or symbol to filter
3. **Sort**: Change sorting (Market Cap, Price, 24h Change)
4. **Refresh**: Click refresh button for latest prices

### Managing Favorites
1. Click the **star icon** next to any cryptocurrency
2. View all favorites in the **"Your Favorites"** section
3. Quick access to coins you track most

### Portfolio Management
1. Click **"Add to Portfolio"** button
2. Select cryptocurrency from dropdown
3. Enter amount of coins you own
4. Enter your buy price
5. View real-time profit/loss calculations

### Understanding the Data
- **Price**: Current USD price per coin
- **24h Change**: Price change in last 24 hours
- **Market Cap**: Total value of all coins in circulation
- **7d Chart**: Visual trend for past week

## 🏗️ Project Structure

```
crypto-tracker/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── CryptoTracker.jsx    # Main tracker component
│   ├── App.js                    # Root component
│   ├── index.js                  # Entry point
│   └── index.css                 # Global styles
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🎯 Key Features Breakdown

### 📊 Real-Time Data Integration

```javascript
// Fetch live cryptocurrency data
const fetchCryptos = async () => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?' +
    'vs_currency=usd&order=market_cap_desc&per_page=100&' +
    'sparkline=true&price_change_percentage=1h,24h,7d'
  );
  const data = await response.json();
  setCryptos(data);
};
```

### 💼 Portfolio Calculations

```javascript
// Real-time profit/loss tracking
const invested = holding.amount * holding.buyPrice;
const currentValue = holding.amount * currentPrice;
const profit = currentValue - invested;
const profitPercent = ((profit / invested) * 100).toFixed(2);
```

### ⭐ Favorites System
- Persistent across sessions
- Quick access panel
- Visual star indicators
- Easy toggle on/off

### 📈 Market Statistics
- **Total Market Cap**: Combined value of all cryptocurrencies
- **Average 24h Change**: Market trend indicator
- **Gainers**: Coins with positive price movement
- **Losers**: Coins with negative price movement

## 💡 What I Learned

This project taught me:
- Working with real-time financial APIs
- Complex state management with portfolios
- Data transformation and calculations
- Chart integration with live data
- Performance optimization with large datasets
- Error handling for API failures
- Auto-refresh mechanisms
- Number formatting for financial data
- Responsive table design
- LocalStorage for complex objects

## 🔮 Future Enhancements

Planned features:

- [ ] **Price Alerts** - Notifications when price hits target
- [ ] **Historical Data** - View prices for any date range
- [ ] **Advanced Charts** - Candlestick, volume charts
- [ ] **News Integration** - Latest crypto news
- [ ] **Multiple Portfolios** - Separate portfolios for different strategies
- [ ] **Exchange Integration** - Connect to Binance, Coinbase
- [ ] **Tax Reports** - Generate tax documents
- [ ] **Watchlists** - Multiple custom watchlists
- [ ] **Market Sentiment** - Fear & Greed Index
- [ ] **DeFi Integration** - Track DeFi positions
- [ ] **NFT Tracking** - Monitor NFT collections
- [ ] **Social Features** - Share portfolios with friends

## 🌐 API Information

### CoinGecko API
- **Base URL**: `https://api.coingecko.com/api/v3`
- **Rate Limit**: 50 calls/minute (free tier)
- **Cost**: Completely free, no API key required
- **Data Coverage**: 13,000+ cryptocurrencies
- **Update Frequency**: Real-time to 5 minutes

### API Endpoints Used

```javascript
// Market data with sparklines
GET /coins/markets
  ?vs_currency=usd
  &order=market_cap_desc
  &per_page=100
  &sparkline=true
  &price_change_percentage=1h,24h,7d
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
- Visit [vercel.com](https://vercel.com)
- Import your GitHub repository
- Vercel auto-detects React settings
- Click Deploy

3. **Custom Domain** (Optional)
- Add custom domain in Vercel dashboard
- Update DNS settings

### Deploy to Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🐛 Known Issues

- API rate limit may cause temporary loading issues
- Very rapid price changes may cause brief UI flicker
- Large portfolios (50+ holdings) may slow calculations
- 7-day chart data sometimes unavailable for new coins

## 💡 Tips for Users

- **Refresh regularly** for most accurate prices
- **Add to favorites** for quick access to watched coins
- **Track small investments** to learn without risk
- **Check 24h change** before making decisions
- **Use 7d charts** to identify trends

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Tosin Adejuwon**
- GitHub: [@TPADEJUWON](https://github.com/TPADEJUWON)
- Email: tosin0601@gmail.com
- Portfolio: *[Your portfolio link]*
- LinkedIn: *[Your LinkedIn profile]*

## 🙏 Acknowledgments

- Cryptocurrency data by [CoinGecko](https://www.coingecko.com)
- Charts powered by [Recharts](https://recharts.org)
- Icons from [Lucide](https://lucide.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Built with [React](https://react.dev)

## ⚠️ Disclaimer

**Investment Warning:**
- This app is for educational purposes only
- Not financial advice
- Cryptocurrency investments are highly risky
- Past performance doesn't guarantee future results
- Always do your own research (DYOR)
- Never invest more than you can afford to lose

## 🔐 Privacy & Security

- No personal data collected
- All portfolio data stored locally
- No account creation required
- No third-party tracking
- Open source and transparent

## 📊 Performance Metrics

- **Load Time**: < 2 seconds
- **API Response**: ~500ms average
- **Chart Rendering**: Optimized with React
- **Data Refresh**: Every 60 seconds
- **Browser Storage**: < 1MB

## 📞 Support

Need help?
- Open an issue on GitHub
- Email: tosin0601@gmail.com
- Check CoinGecko API status

## ⭐ Show Your Support

If this project helps you track crypto, give it a ⭐ on GitHub!

---

**Track. Analyze. Profit. 📈 | Built by Tosin Adejuwon**