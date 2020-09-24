import Binance from 'index'
import { getProxyHttpAgent } from 'proxy-http-agent'

import { checkFields } from '../utils'


export const testAuthenticated = (test) => {  
  const client = Binance({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  });

  const proxyAgent = getProxyHttpAgent({
    proxy: `http://localhost:${process.env.PROXY_PORT}`
  });

  test('[REST] order', async t => {
    await client.orderTest({
      symbol: 'ETHBTC',
      side: 'BUY',
      quantity: 1,
      type: 'MARKET',
    }, proxyAgent)
  
    t.pass()
  })
  
  test('[REST] allOrders / getOrder', async t => {
    // Note that this test will fail if you don't have any AST order in your account
    const orders = await client.allOrders({
      symbol: 'ASTETH',
    }, proxyAgent)
  
    t.true(Array.isArray(orders))
    t.truthy(orders.length)
  
    const [order] = orders
  
    checkFields(t, order, ['orderId', 'symbol', 'price', 'type', 'side'])
  
    const res = await client.getOrder({
      symbol: 'ASTETH',
      orderId: order.orderId,
    }, proxyAgent)
  
    t.truthy(res)
    checkFields(t, res, ['orderId', 'symbol', 'price', 'type', 'side'])
  })
  
  test('[REST] getOrder with useServerTime', async t => {
    const orders = await client.allOrders({
      symbol: 'ASTETH',
      useServerTime: true,
    }, proxyAgent)
  
    t.true(Array.isArray(orders))
    t.truthy(orders.length)
  })
  
  test('[REST] openOrders', async t => {
    const orders = await client.openOrders({
      symbol: 'ETHBTC',
    }, proxyAgent)
  
    t.true(Array.isArray(orders))
  })
  
  test('[REST] accountInfo', async t => {
    const account = await client.accountInfo(proxyAgent)
    t.truthy(account)
    checkFields(t, account, ['makerCommission', 'takerCommission', 'balances'])
    t.truthy(account.balances.length)
  })
  
  test('[REST] tradeFee', async t => {
    const tfee = await client.tradeFee(proxyAgent)
    t.truthy(tfee)
    t.truthy(tfee.length)
    checkFields(t, tfee[0], ['symbol', 'maker', 'taker'])
  })
  
  test('[REST] depositHistory', async t => {
    const history = await client.depositHistory(proxyAgent)
    t.true(history.success)
    t.truthy(history.depositList.length)
  })
  
  test('[REST] withdrawHistory', async t => {
    const history = await client.withdrawHistory(proxyAgent)
    t.true(history.success)
    t.is(typeof history.withdrawList.length, 'number')
  })
  
  test('[REST] depositAddress', async t => {
    const out = await client.depositAddress({ asset: 'ETH' }, proxyAgent)
    t.true(out.success)
    t.is(out.asset, 'ETH')
    t.truthy(out.address)
  })
  
  test('[REST] myTrades', async t => {
    const trades = await client.myTrades({ symbol: 'ASTETH' }, proxyAgent)
    t.true(Array.isArray(trades))
    const [trade] = trades
    checkFields(t, trade, ['id', 'orderId', 'qty', 'commission', 'time'])
  })
  
  test('[REST] tradesHistory', async t => {
    const trades = await client.tradesHistory({ symbol: 'ETHBTC', fromId: 28457 }, proxyAgent)
    t.is(trades.length, 500)
  })
  
  test('[REST] error code', async t => {
    try {
      await client.orderTest({
        symbol: 'TRXETH',
        side: 'SELL',
        type: 'LIMIT',
        quantity: '-1337.00000000',
        price: '1.00000000',
      }, proxyAgent)
    } catch (e) {
      t.is(e.code, -1100)
    }
  })
};
