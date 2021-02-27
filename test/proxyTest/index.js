import test from 'ava'
import dotenv from 'dotenv'
import Binance from 'index'
import { candleFields } from 'http-client'

import { checkFields } from '../utils'

import { ProxyServer } from 'net-proxy';

import { testAuthenticated } from './authenticated';

import { getProxyHttpAgent } from 'proxy-http-agent';


dotenv.load();

let proxyServer;
const client = Binance();

let proxyAgent;

test.before(async () => {
    proxyServer = new ProxyServer();

    console.log('Launch proxy ..');
    await proxyServer.awaitStartedListening();
    console.log(`Proxy connected on port  ${proxyServer.port}  !`);

    process.env.PROXY_PORT = proxyServer.port.toString();

    proxyAgent = getProxyHttpAgent({
        proxy: `http://localhost:${proxyServer.port}`
    });
});

test('[REST] ping (Proxy)', async t => {
    const res = await client.ping(proxyAgent)
    t.truthy(res, 'A simple ping should work')
})

test('[REST] time (Proxy)', async t => {
    const ts = await client.time(proxyAgent)
    t.truthy(new Date(ts).getTime() > 0, 'The returned timestamp should be valid')
})

test('[REST] exchangeInfo (Proxy)', async t => {
    const res = await client.exchangeInfo(proxyAgent)
    checkFields(t, res, ['timezone', 'serverTime', 'rateLimits', 'symbols'])
})

test('[REST] book (Proxy)', async t => {
    const book = await client.book({ symbol: 'ETHBTC' }, proxyAgent)
    t.truthy(book.lastUpdateId)
    t.truthy(book.asks.length)
    t.truthy(book.bids.length)

    const [bid] = book.bids
    t.truthy(typeof bid.price === 'string')
    t.truthy(typeof bid.qty === 'string')
})

test('[REST] candles (Proxy)', async t => {
    const candles = await client.candles({ symbol: 'ETHBTC', interval: '15m' }, proxyAgent)

    t.truthy(candles.length)

    const [candle] = candles
    checkFields(t, candle, candleFields)
})

test('[REST] aggTrades (Proxy)', async t => {
    const trades = await client.aggTrades({ symbol: 'ETHBTC' }, proxyAgent)
    t.truthy(trades.length)

    const [trade] = trades
    t.truthy(trade.aggId)
})

test('[REST] trades (Proxy)', async t => {
    const trades = await client.trades({ symbol: 'ETHBTC' }, proxyAgent)
    t.is(trades.length, 500)
})

test('[REST] dailyStats (Proxy)', async t => {
    const res = await client.dailyStats({ symbol: 'ETHBTC' }, proxyAgent)
    t.truthy(res)
    checkFields(t, res, ['highPrice', 'lowPrice', 'volume', 'priceChange'])
})

test('[REST] prices (Proxy)', async t => {
    const prices = await client.prices(proxyAgent)
    t.truthy(prices)
    t.truthy(prices.ETHBTC)
})

test('[REST] avgPrice (Proxy)', async t => {
    const res = await client.avgPrice({ symbol: 'ETHBTC' }, proxyAgent)
    t.truthy(res)
    checkFields(t, res, ['mins', 'price'])
})

test('[REST] allBookTickers (Proxy)', async t => {
    const tickers = await client.allBookTickers(proxyAgent)
    t.truthy(tickers)
    t.truthy(tickers.ETHBTC)
})

// TODO: After implementing Proxy support for ws (test them too) 

if (process.env.API_KEY) {
    testAuthenticated(test);
}
