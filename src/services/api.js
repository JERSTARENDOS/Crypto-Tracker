import axios from "axios"

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 10000,
})

// Simple cache mechanism
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

const getCacheKey = (endpoint) => endpoint;

const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

const cachedFetch = async (endpoint, cacheKey = null) => {
  const key = cacheKey || getCacheKey(endpoint);
  const cached = cache.get(key);
  
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }
  
  const response = await api.get(endpoint);
  cache.set(key, {
    data: response,
    timestamp: Date.now()
  });
  return response;
};

export const fetchCoins = () =>
    cachedFetch("/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d", "coins");

export const fetchChart = (id, days = 7) =>
    api.get(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`);

export const fetchCoinDetails = (id) =>
    api.get(`/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);

export const fetchGlobal = () =>
    cachedFetch("/global", "global");

export const fetchTrending = () =>
    cachedFetch("/search/trending", "trending");

export const fetchMarketData = () =>
    api.get("/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&price_change_percentage=1h,24h,7d");

export const fetchCoinChart = (id, days = 30) =>
    api.get(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`);

export const clearCache = (key = null) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};