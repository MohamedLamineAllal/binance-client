import crypto from 'crypto'
import zip from 'lodash.zipobject'

import 'isomorphic-fetch'

const BASE = 'https://api.binance.com'
const FUTURE_BASE = 'https://fapi.binance.com';
const API_PATH_BASE = 'api';
const FUTURES_API_PATH_BASE = 'fapi';

const defaultGetTime = () => Date.now()

/**
 * Build query string for uri encoded url based on json object
 */
const makeQueryString = q =>
  q
    ? `?${Object.keys(q)
        .filter(k => !!q[k])
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`)
        .join('&')}`
    : ''

/**
 * Finalize API response
 */
const sendResult = call =>
  call.then(res => {
    // If response is ok, we can safely assume it is valid JSON
    // TODO: add headers easy access
    if (res.ok) {
      return res.json()
    }

    // Errors might come from the API itself or the proxy Binance is using.
    // For API errors the response will be valid JSON,but for proxy errors
    // it will be HTML
    return res.text().then(text => {
      let error;
      try {
        const json = JSON.parse(text)
        // The body was JSON parsable, assume it is an API response error
        error = new Error(json.msg || `${res.status} ${res.statusText}`)
        error.code = json.code
      } catch (e) {
        // The body was not JSON parsable, assume it is proxy error
        error = new Error(`${res.status} ${res.statusText} ${text}`)
        error.response = res
        error.responseText = text
      }
      throw error
    })
  })

/**
 * Util to validate existence of required parameter(s)
 */
const checkParams = (name, payload, requires = []) => {
  if (!payload) {
    throw new Error('You need to pass a payload object.')
  }

  requires.forEach(r => {
    if (!payload[r] && isNaN(payload[r])) {
      throw new Error(`Method ${name} requires ${r} parameter.`)
    }
  })

  return true
}

/**
 * Make public calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
const publicCall = ({ base, apiPathBase }) => (path, data, method = 'GET', headers = {}) =>
  sendResult(
    fetch(`${base}/${apiPathBase}${path}${makeQueryString(data)}`, {
      method,
      json: true,
      headers,
    }),
  )

/**
 * Factory method for partial private calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @returns {object} The api response
 */
const keyCall = ({ apiKey, pubCall }) => (path, data, method = 'GET') => {
  if (!apiKey) {
    throw new Error('You need to pass an API key to make this call.')
  }

  return pubCall(path, data, method, {
    'X-MBX-APIKEY': apiKey,
  })
}

/**
 * Factory method for private calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
const privateCall = ({ apiKey, apiSecret, base, apiBase, getTime = defaultGetTime, pubCall }) => (
  path,
  data = {},
  method = 'GET',
  noData,
  noExtra,
) => {
  if (!apiKey || !apiSecret) {
    throw new Error('You need to pass an API key and secret to make authenticated calls.')
  }

  return (data && data.useServerTime
    ? pubCall('/v1/time').then(r => r.serverTime)
    : Promise.resolve(getTime())
  ).then(timestamp => {
    if (data) {
      delete data.useServerTime
    }

    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(makeQueryString({ ...data, timestamp }).substr(1))
      .digest('hex')

    const newData = noExtra ? data : { ...data, timestamp, signature }

    return sendResult(
      fetch(
        `${base}${(path.includes('/wapi') || path.includes('/sapi')) ? '' : `/${apiBase}`}${path}${noData
          ? ''
          : makeQueryString(newData)}`,
        {
          method,
          headers: { 'X-MBX-APIKEY': apiKey },
          json: true,
        },
      ),
    )
  })
}

const renameProps = (elements, mapping) => {
  if (!Array.isArray(elements)) {
    return renameObjProp(elements, mapping);
  }

  return elements.map(el => renameObjProp(el, mapping));
}

const renameObjProp = (el, mapping) => {
  return Object.keys(el).reduce((newEl, prop) => {
    if (mapping[prop]) {
      newEl[mapping[prop]] = el[prop];
    } else {
      newEl[prop] = el[prop]
    }
    return newEl;
  }, {});
}

export const candleFields = [
  'openTime',
  'open',
  'high',
  'low',
  'close',
  'volume',
  'closeTime',
  'quoteAssetVolume', // TODO: update the doc
  'trades',
  'buyBaseAssetVolume',
  'buyQuoteAssetVolume'
]

/**
 * Get candles for a specific pair and interval and convert response
 * to a user friendly collection.
 */
const candles = (pubCall, payload) =>
  pubCall('/v1/klines', payload).then(candles =>
    candles.map(candle => zip(candleFields, candle)),
  )

/**
 * Create a new order wrapper for market order simplicity
 */
const order = (privCall, payload = {}, url) => {
  const newPayload =
    (['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(payload.type) || !payload.type) // TODO: check
      ? { timeInForce: 'GTC', ...payload }
      : payload
  return checkParams('order', newPayload, ['symbol', 'side', 'quantity']) && privCall(url, { type: 'LIMIT', ...newPayload }, 'POST') // TODO: check params
}

/**
 * Zip asks and bids response from order book
 */
const book = (pubCall, payload) =>
  pubCall('/v1/depth', payload).then(({ lastUpdateId, asks, bids }) => ({
    lastUpdateId,
    asks: asks.map(a => zip(['price', 'quantity'], a)),
    bids: bids.map(b => zip(['price', 'quantity'], b)),
  }))

const aggTrades = (pubCall, payload) =>
  pubCall('/v1/aggTrades', payload).then(trades =>
    trades.map(trade => ({
      aggId: trade.a,
      price: trade.p,
      quantity: trade.q,
      firstTradeId: trade.f, // TODO: change the doc (And Exchange api)
      lastTradeId: trade.l,
      time: trade.T,
      isBuyerMaker: trade.m,
      isBestMatch: trade.M,
    })),
  )



const futuresCandles = candles;
/**
 * Create a new order wrapper for market order simplicity
 */
const futuresOrder = (privCall, payload = {}, url) => {
  const newPayload =
    (['LIMIT', 'STOP', 'TAKE_PROFIT'].includes(payload.type) || !payload.type) // TODO: TO CHECK
      ? { timeInForce: 'GTC', ...payload }
      : payload

  if (!payload.type) payload.type = 'LIMIT';

  if (payload.type && payload.type === 'MARKET' && payload.timeInForce) {
    throw new Error('timeInForce parameter cannot be send with type MARKET');
  }

  return (
    checkParams('futuresOrder', newPayload, [
      'symbol',
      'side',
      'type',
      'quantity',
      ...((payload.type && payload.type === 'LIMIT' && ['price', 'timeInForce']) || []),
      ...((payload.type && ['STOP', 'TAKE_PROFIT'].includes(payload.type) && ['price', 'stopPrice']) || []),
      ...((payload.type && ['STOP_MARKET', 'TAKE_PROFIT_MARKET'].includes(payload.type) && ['stopPrice']) || []),
    ]) &&
    privCall(url, newPayload, 'POST')
  )
}
const futuresBook = book;
const futuresAggTrades = aggTrades;



export default opts => {
  const base = opts && opts.httpBase || BASE;
  const futureBase = opts && opts.httpFutureBase || FUTURE_BASE;
  const pubCall = publicCall({ ...opts, base, apiPathBase: API_PATH_BASE })
  const privCall = privateCall({ ...opts, base, pubCall })
  const kCall = keyCall({ ...opts, pubCall })
  const futuresPubCall = publicCall({ ...opts, base: futureBase, apiPathBase: FUTURES_API_PATH_BASE });
  const futuresPrivCall = privateCall({ ...opts, base: futureBase, pubCall });
  const futuresKCall = keyCall({ ...opts, pubCall: futuresPubCall });

  return {
    // _______________________________________ normal binance api
    ping: () => pubCall('/v1/ping').then(() => true),
    time: () => pubCall('/v1/time').then(r => r.serverTime),
    exchangeInfo: () => pubCall('/v1/exchangeInfo'),
    book: payload => checkParams('book', payload, ['symbol']) && book(pubCall, payload),
    trades: (payload) => checkParams('trades', payload, ['symbol']) && pubCall('/v1/trades', payload).then(
      trades => renameProps(trades, { qty: 'quantity'})
    ),
    tradesHistory: (payload) => checkParams('tradesHistory', payload, ['symbol']) && kCall('/v1/historicalTrades', payload).then(
      trades => renameProps(trades, { qty: 'quantity'})
    ),
    aggTrades: payload => checkParams('aggTrades', payload, ['symbol']) && aggTrades(pubCall, payload),
    candles: payload => checkParams('candles', payload, ['symbol', 'interval']) &&  candles(pubCall, payload),
    dailyStats: payload => pubCall('/v1/ticker/24hr', payload),
    prices: () =>
      pubCall('/v1/ticker/allPrices').then(r =>
        r.reduce((out, cur) => ((out[cur.symbol] = cur.price), out), {}),
      ),
    avgPrice: payload => pubCall('/v3/avgPrice', payload),
    allBookTickers: () =>
      pubCall('/v1/ticker/allBookTickers').then(r =>
        r.reduce((out, cur) => ((out[cur.symbol] = cur), out), {}),
      ),
    order: payload => order(privCall, payload, '/v3/order'),
    orderTest: payload => order(privCall, payload, '/v3/order/test'),
    getOrder: payload => privCall('/v3/order', payload),
    cancelOrder: payload => privCall('/v3/order', payload, 'DELETE'),
    openOrders: payload => privCall('/v3/openOrders', payload), // TODO: to check (cancel)
    allOrders: payload => privCall('/v3/allOrders', payload),
    accountInfo: payload => privCall('/v3/account', payload),
    myTrades:  (payload) => privCall('/v3/myTrades', payload),
    withdraw: payload => privCall('/wapi/v3/withdraw.html', payload, 'POST'),
    withdrawHistory: payload => privCall('/wapi/v3/withdrawHistory.html', payload),
    depositHistory: payload => privCall('/wapi/v3/depositHistory.html', payload),
    depositAddress: payload => privCall('/wapi/v3/depositAddress.html', payload),
    tradeFee: payload => privCall('/wapi/v3/tradeFee.html', payload).then(res => res.tradeFee),
    assetDetail: payload => privCall('/wapi/v3/assetDetail.html', payload),
    getDataStream: () => privCall('/v1/userDataStream', null, 'POST', true),
    keepDataStream: payload => privCall('/v1/userDataStream', payload, 'PUT', false, true),
    closeDataStream: payload => privCall('/v1/userDataStream', payload, 'DELETE', false, true),

    // ______________________________________ futures binance api

    futuresPing: () => futuresPubCall('/v1/ping').then(() => true),
    futuresTime: () => futuresPubCall('/v1/time').then(r => r.serverTime),
    futuresExchangeInfo: () => futuresPubCall('/v1/exchangeInfo'),
    futuresBook: payload => checkParams('futuresBook', payload, ['symbol']) && futuresBook(futuresPubCall, payload),
    futuresTrades: (payload) => checkParams('futuresTrades', payload, ['symbol']) && futuresPubCall('/v1/trades', payload).then(
      trades => renameProps(trades, { qty: 'quantity'})
    ),
    futuresTradesHistory: (payload) => checkParams('futuresTradesHistory', payload, ['symbol']) && futuresKCall('/v1/historicalTrades', payload).then(
      trades => renameProps(trades, { qty: 'quantity'})
    ),
    futuresAggTrades: payload => checkParams('futuresAggTrades', payload, ['symbol']) && futuresAggTrades(futuresPubCall, payload),
    futuresCandles: payload => checkParams('futuresCandles', payload, ['symbol', 'interval']) && futuresCandles(futuresPubCall, payload),
    // ______________ futures exclusive
    futuresMarkPrice: payload => futuresPubCall('/v1/premiumIndex', payload),
    futuresFundingRate: payload => checkParams('futuresFundingRate', payload, ['symbol']) && futuresKCall('/v1/fundingRate', payload),
    futuresDailyStats: payload => futuresPubCall('/v1/ticker/24hr', payload),
    futuresPrice: payload =>
      futuresPubCall('/v1/ticker/price', payload).then(r =>
        Array.isArray(r) ?
          (
            (payload.reduce && r.reduce((out, cur) => ((out[cur.symbol] = cur.price), out), {})) || r
          ):
          r.price // TODO: docs
      ),
    futuresAvgPrice: payload => futuresPubCall('/v3/avgPrice', payload),
    futuresBookTicker: payload =>
      futuresPubCall('/v1/ticker/bookTicker', payload).then(r =>
        (
          payload.reduce && Array.isArray(r) && 
          r.reduce((out, cur) => ((out[cur.symbol] = cur), out), {})
        ) || r // TODO: docs
      ),
    futuresAllForceOrders: payload => futuresPubCall('/v1/allForceOrders', payload),
    futuresOpenInterest: payload => checkParams('futuresOpenInterest', payload, ['symbol']) && futuresPubCall('/v1/openInterest', payload),
    futuresLeverageBracket: payload => futuresPubCall('/v1/leverageBracket', payload).then(r => 
        Array.isArray(r) ?
          (
            (payload.reduce && r.reduce((out, cur) => ((out[cur.symbol] = cur.brackets), out), {}) || r)
          ):
          r.brackets // TODO: docs
    ),
    futuresAccountTransfer: payload => checkParams('futuresAccountTransfer', payload, ['asset', 'amount', 'type']) && privCall('/sapi/v1/futures/transfer ', payload, 'POST'),
    // eslint-disable-next-line id-length
    futuresAccountTransactionHistory: payload => checkParams('futuresAccountTransactionHistory', payload, ['asset', 'startTime']) && privCall('/sapi/v1/futures/transfer', payload),
    futuresOrder: payload => futuresOrder(futuresPrivCall, payload, '/v1/order'),
    futuresOrderTest: payload => futuresOrder(futuresPrivCall, payload, '/v3/order/test'), // TODO: remove
    futuresGetOrder: payload => checkParams('futuresQueryOrder', payload, ['symbol']) && futuresPrivCall('/v1/order', payload),
    futuresCancelOrder: payload => checkParams('futuresCancelOrder', payload, ['symbol']) && futuresPrivCall('/v1/order', payload, 'DELETE'),
    futuresCancelAllOpenOrders: payload => checkParams('futuresCancelOrder', payload, ['symbol']) && futuresPrivCall('/v1/allOpenOrders', payload, 'DELETE'),
    futuresCancelMultipleOrders: payload => checkParams('futuresCancelMultipleOrders', payload, ['symbol']) && futuresPrivCall('/v1/batchOrders', payload),
    futuresGetOpenOrder: payload => checkParams('futuresGetOpenOrder', payload, ['symbol']) && futuresPrivCall('/v1/openOrder', payload),
    futuresGetAllOpenOrders: payload => futuresPrivCall('/v1/openOrders', payload).then(r => (payload.reduce && r.reduce((out, cur) => ((out[cur.symbol] = cur), out), {})) || r),
    futuresGetAllOrders: payload => checkParams('futuresGetAllOrders', payload, ['symbol']) && futuresPrivCall('/v1/allOrders', payload),
    futuresAccountBalance: payload => futuresPrivCall('/v1/balance', payload),
    futuresAccountInfo: payload => futuresPrivCall('/v1/account', payload),
    futuresChangeLeverage: payload => checkParams('futuresChange<Leverage', payload, ['symbol', 'leverage']) && futuresPrivCall('/v1/leverage', payload, 'POST'),
    futuresChangeMarginType: payload => checkParams('futuresChangeMarginType', payload, ['symbol', 'marginType']) && futuresPrivCall('/v1/marginType', payload, 'POST'),
    futuresModifyPositionMargin: payload => checkParams('futuresModifyPositionMargin', payload, ['symbol', 'amount']) && futuresPrivCall('/v1/positionMargin', payload, 'POST'),
    futuresPositionMarginHistory: payload => checkParams('futuresPositionMarginHistory', payload, ['symbol']) && futuresPrivCall('/v1/positionMargin/history', payload),
    futuresPositionRisk: payload => futuresPrivCall('/v1/positionRisk', payload),
    futuresUserTrades: payload => checkParams('futuresUserTrades', payload, ['symbol']) && futuresPrivCall('/v1/userTrades', payload),
    futuresIncomeHistory: payload => futuresPrivCall('/v1/income', payload)
  }
}


/**
 * TODO: think about adding easy wait access (of every end point) (see local caching too)
 */
