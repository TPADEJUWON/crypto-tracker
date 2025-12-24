import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, Star, RefreshCw, DollarSign, Activity, BarChart3, Sparkles, Plus, X } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function CryptoTracker() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [sortBy, setSortBy] = useState('market_cap');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Portfolio form
  const [portfolioForm, setPortfolioForm] = useState({
    coinId: '',
    amount: '',
    buyPrice: ''
  });

  // Load favorites and portfolio
  useEffect(() => {
    const savedFavorites = localStorage.getItem('cryptoFavorites');
    const savedPortfolio = localStorage.getItem('cryptoPortfolio');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
  }, []);

  // Save favorites and portfolio
  useEffect(() => {
    localStorage.setItem('cryptoFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Fetch crypto data
  const fetchCryptos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d'
      );
      const data = await response.json();
      setCryptos(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCryptos();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchCryptos, 60000);
    return () => clearInterval(interval);
  }, []);

  // Toggle favorite
  const toggleFavorite = (coinId) => {
    if (favorites.includes(coinId)) {
      setFavorites(favorites.filter(id => id !== coinId));
    } else {
      setFavorites([...favorites, coinId]);
    }
  };

  // Add to portfolio
  const addToPortfolio = () => {
    if (!portfolioForm.coinId || !portfolioForm.amount || !portfolioForm.buyPrice) return;

    const coin = cryptos.find(c => c.id === portfolioForm.coinId);
    if (!coin) return;

    const newHolding = {
      id: Date.now(),
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      amount: parseFloat(portfolioForm.amount),
      buyPrice: parseFloat(portfolioForm.buyPrice),
      currentPrice: coin.current_price
    };

    setPortfolio([...portfolio, newHolding]);
    setPortfolioForm({ coinId: '', amount: '', buyPrice: '' });
    setShowAddPortfolio(false);
  };

  // Remove from portfolio
  const removeFromPortfolio = (id) => {
    setPortfolio(portfolio.filter(h => h.id !== id));
  };

  // Calculate portfolio stats
  const portfolioStats = portfolio.reduce((acc, holding) => {
    const coin = cryptos.find(c => c.id === holding.coinId);
    const currentPrice = coin?.current_price || holding.currentPrice;
    const invested = holding.amount * holding.buyPrice;
    const currentValue = holding.amount * currentPrice;
    const profit = currentValue - invested;
    
    return {
      invested: acc.invested + invested,
      currentValue: acc.currentValue + currentValue,
      profit: acc.profit + profit
    };
  }, { invested: 0, currentValue: 0, profit: 0 });

  const portfolioReturn = portfolioStats.invested > 0 
    ? ((portfolioStats.profit / portfolioStats.invested) * 100).toFixed(2)
    : 0;

  // Filter and sort cryptos
  const filteredCryptos = cryptos
    .filter(crypto => 
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'market_cap') return b.market_cap - a.market_cap;
      if (sortBy === 'price') return b.current_price - a.current_price;
      if (sortBy === 'change') return b.price_change_percentage_24h - a.price_change_percentage_24h;
      return 0;
    });

  const favoriteCryptos = cryptos.filter(c => favorites.includes(c.id));

  // Market overview stats
  const marketStats = {
    totalMarketCap: cryptos.reduce((sum, c) => sum + (c.market_cap || 0), 0),
    avgChange24h: (cryptos.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / cryptos.length).toFixed(2),
    gainers: cryptos.filter(c => c.price_change_percentage_24h > 0).length,
    losers: cryptos.filter(c => c.price_change_percentage_24h < 0).length
  };

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur">
                <Activity size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Crypto Tracker</h1>
                <p className="text-purple-100">Real-time cryptocurrency prices</p>
              </div>
            </div>
            <button
              onClick={fetchCryptos}
              disabled={loading}
              className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition backdrop-blur disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-purple-100 mb-1">Market Cap</div>
              <div className="text-2xl font-bold">{formatNumber(marketStats.totalMarketCap)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-purple-100 mb-1">24h Change</div>
              <div className={`text-2xl font-bold ${marketStats.avgChange24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {marketStats.avgChange24h}%
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-purple-100 mb-1">Gainers</div>
              <div className="text-2xl font-bold text-green-300">{marketStats.gainers}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-purple-100 mb-1">Losers</div>
              <div className="text-2xl font-bold text-red-300">{marketStats.losers}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Portfolio Section */}
        {portfolio.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Your Portfolio</h2>
              <button
                onClick={() => setShowAddPortfolio(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="text-sm text-blue-600 mb-1">Invested</div>
                <div className="text-2xl font-bold text-blue-900">${portfolioStats.invested.toFixed(2)}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="text-sm text-purple-600 mb-1">Current Value</div>
                <div className="text-2xl font-bold text-purple-900">${portfolioStats.currentValue.toFixed(2)}</div>
              </div>
              <div className={`bg-gradient-to-br ${portfolioStats.profit >= 0 ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'} rounded-lg p-4`}>
                <div className={`text-sm ${portfolioStats.profit >= 0 ? 'text-green-600' : 'text-red-600'} mb-1`}>
                  Profit/Loss
                </div>
                <div className={`text-2xl font-bold ${portfolioStats.profit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  ${portfolioStats.profit.toFixed(2)} ({portfolioReturn}%)
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {portfolio.map(holding => {
                const coin = cryptos.find(c => c.id === holding.coinId);
                const currentPrice = coin?.current_price || holding.currentPrice;
                const value = holding.amount * currentPrice;
                const profit = value - (holding.amount * holding.buyPrice);
                const profitPercent = ((profit / (holding.amount * holding.buyPrice)) * 100).toFixed(2);

                return (
                  <div key={holding.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {coin?.image && <img src={coin.image} alt={holding.coinName} className="w-10 h-10" />}
                      <div>
                        <div className="font-bold text-gray-800">{holding.coinName}</div>
                        <div className="text-sm text-gray-500">
                          {holding.amount} {holding.coinSymbol.toUpperCase()} @ ${holding.buyPrice}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">${value.toFixed(2)}</div>
                      <div className={`text-sm ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}{profitPercent}%
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromPortfolio(holding.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Portfolio Modal */}
        {showAddPortfolio && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Add to Portfolio</h3>
              <div className="space-y-3">
                <select
                  value={portfolioForm.coinId}
                  onChange={(e) => setPortfolioForm({...portfolioForm, coinId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Cryptocurrency</option>
                  {cryptos.map(coin => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={portfolioForm.amount}
                  onChange={(e) => setPortfolioForm({...portfolioForm, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Buy Price (USD)"
                  value={portfolioForm.buyPrice}
                  onChange={(e) => setPortfolioForm({...portfolioForm, buyPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addToPortfolio}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddPortfolio(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="market_cap">Market Cap</option>
              <option value="price">Price</option>
              <option value="change">24h Change</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* Favorites */}
        {favoriteCryptos.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              Your Favorites
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {favoriteCryptos.map(crypto => (
                <div key={crypto.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                      <div>
                        <div className="font-bold text-gray-800">{crypto.symbol.toUpperCase()}</div>
                        <div className="text-xs text-gray-500">{crypto.name}</div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h?.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">${crypto.current_price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crypto List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Coin</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Price</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">24h</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Market Cap</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">7d Chart</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Favorite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <RefreshCw size={32} className="animate-spin mx-auto mb-2" />
                      Loading cryptocurrencies...
                    </td>
                  </tr>
                ) : (
                  filteredCryptos.map((crypto, index) => (
                    <tr key={crypto.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-600">{crypto.market_cap_rank}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={crypto.image} alt={crypto.name} className="w-10 h-10" />
                          <div>
                            <div className="font-bold text-gray-800">{crypto.name}</div>
                            <div className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-800">
                        ${crypto.current_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {crypto.price_change_percentage_24h >= 0 ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                          <span className="font-semibold">
                            {Math.abs(crypto.price_change_percentage_24h)?.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {formatNumber(crypto.market_cap)}
                      </td>
                      <td className="px-6 py-4">
                        {crypto.sparkline_in_7d?.price && (
                          <ResponsiveContainer width={100} height={40}>
                            <LineChart data={crypto.sparkline_in_7d.price.map(p => ({ value: p }))}>
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={crypto.price_change_percentage_7d_in_currency >= 0 ? '#10b981' : '#ef4444'}
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleFavorite(crypto.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Star
                            size={20}
                            className={favorites.includes(crypto.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}