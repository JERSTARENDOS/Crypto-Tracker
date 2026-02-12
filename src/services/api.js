import axios from "axios"

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
})

export const fetchCoins = () =>
    api.get("/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d");

export const fetchChart = (id, days = 7) =>
    api.get(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`);

export const fetchCoinDetails = (id) =>
    api.get(`/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);

export const fetchGlobal = () =>
    api.get("/global");

export const fetchTrending = () =>
    api.get("/search/trending");

export const fetchMarketData = () =>
    api.get("/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&price_change_percentage=1h,24h,7d");

export const fetchCoinChart = (id, days = 30) =>
    api.get(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`);