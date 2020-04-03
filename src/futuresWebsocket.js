import zip from 'lodash.zipobject'

import httpMethods from 'http-client'
import openWebSocket from 'open-websocket'

const BASE = 'wss://fstream.binance.com'

function getStreamNameFromObj(symbolMethodObject) {
  return `${symbolMethodObject.symbol.toLowerCase()}@${symbolMethodObject.endPoint}`
}

const multiStreams = (symbolMethodObjects, cb) => {
  if (!Array.isArray(symbolMethodObjects)) { symbolMethodObjects = [symbolMethodObjects] };

  const streamsNamesPath = symbolMethodObjects
    .map(sm => getStreamNameFromObj(sm))
    .join('/');

  const ws = openWebSocket(`${BASE}/stream?streams=${streamsNamesPath}`);
  ws.onmessage = msg => {
    const data = JSON.parse(msg);
    cb(data);
    // TODO:
  }

  return {
    ws,
    subscribe(symbolMethodObjects) {
      if (!Array.isArray(symbolMethodObjects)) {
        symbolMethodObjects = [symbolMethodObjects];
      } 
    },
    unsubscribe(symbolMethodObjects) {
      if (!Array.isArray(symbolMethodObjects)) {
        symbolMethodObjects = [symbolMethodObjects];
      }
    },
    close(options) {
      ws.close(1000, 'Close handle was called', { keepClosed: true, ...options });
    }
  }
}

// ________________________________ aggTrade
const aggTradesOutputMapping = (d) => ({
  eventType: d.e,
  eventTime: d.E,
  symbol: d.s,
  aggId: d.a,
  price: d.p,
  quantity: d.q,
  firstTradeId: d.f,
  lastTradeId: d.l,
  tradeTime: d.T,
  isBuyerMaker: d.m
})
const aggTrades = (payload, cb) => tradesInternal(payload, 'aggTrade', aggTradesOutputMapping, cb)

// ____________________________ trade

const tradesInternal = (payload, streamName, outputMap, cb) => {
  const { symbol } = payload;
  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@${streamName}`)
  w.onmessage = msg => {
    cb(outputMap(JSON.parse(msg.data)))
  }

  return options =>
    w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
}

// _______________________________ markPrice
const markPrice = (payload, cb) => {
  const { symbol, speed } = payload;
  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@markPrice${speed ? `@${speed}` : ''}`);

  w.onmessage = msg => {
    const {
      e: eventType,
      E: eventTime,
      s: symbol,
      p: markPrice,
      r: fundingRate,
      T: nextFundingTime
    } = JSON.parse(msg.data);

    cb({
      eventType,
      eventTime,
      symbol,
      markPrice,
      fundingRate,
      nextFundingTime
    });
  }

  return options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options });
}

// _______________________________ markPrice for all market
const markPriceAll = (payload, cb) => {
  const { speed, reduce } = payload;
  const w = openWebSocket(`${BASE}/ws/!markPrice@arr${speed ? `@${speed}` : ''}`);

  w.onmessage = msg => {
    const data = JSON.parse(msg.data)
      .map(d => ({
        eventType: d.e,
        eventTime: d.E,
        symbol: d.s,
        markPrice: d.p,
        fundingRate: d.r,
        nextFundingTime: d.T
      }));

    if (reduce) {
      const reducedData = data.reduce(
        (reducedData, d) => {
          reducedData[d.symbol] = d;
          return reducedData;
        },
        {} 
      );

      return cb(reducedData, data);
    }
    return cb(data);
  }

  return options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options });
}

// _______________________________ candles (Kline/Candlestick)

const candles = (symbol, interval, cb) => {
  if (!interval || !cb) {
    throw new Error('Please pass a symbol, interval and callback.')
  }

  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@kline_${interval}`)

  w.onmessage(msg => {
    const { e: eventType, E: eventTime, s: symbol, k: tick } = JSON.parse(msg.data)
    const {
      t: startTime,
      T: closeTime,
      i: interval,
      f: firstTradeId,
      L: lastTradeId,
      o: open,
      c: close,
      h: high,
      l: low,
      v: volume,
      n: trades,
      x: isFinal,
      q: quoteAssetVolume,
      V: buyAssetVolume,
      Q: quoteBuyAssetVolume,
    } = tick

    cb({
      eventType,
      eventTime,
      symbol,
      startTime,
      closeTime,
      firstTradeId,
      lastTradeId,
      open,
      high,
      low,
      close,
      volume,
      trades,
      interval,
      isFinal,
      quoteAssetVolume,
      buyAssetVolume,
      quoteBuyAssetVolume
    });
  });

  return options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
}

// _______________________________ tickers

// ____________ mini ticker
const miniTicker = (symbol, cb) => {
  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@miniTicker`)

  w.onmessage = msg => {
    cb(miniTickerTransform(JSON.parse(msg.data)))
  }

  return options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
};


const allMiniTickers = (cb) => {
  const w = openWebSocket(`${BASE}/ws/!miniTicker@arr`)

  w.onmessage = msg => {
    cb(
      JSON.parse(msg.data)
        .map(d => miniTickerTransform(d))
    );
  }

  return options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
};

const miniTickerTransform = (d) => ({
  eventType: d.e,
  eventTime: d.E,
  symbol: d.s,
  close: d.c,
  open: d.o,
  high: d.h,
  low: d.l,
  volume: d.v,
  quoteVolume: d.q
});

// _______ ticker
const ticker = (symbol, cb) => {
  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@ticker`)

  w.onmessage = msg => {
    cb(tickerTransform(JSON.parse(msg.data)))
  }

  return options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
};

const allTickers = cb => {
  const w = new openWebSocket(`${BASE}/ws/!ticker@arr`)

  w.onmessage = msg => {
    cb(
      JSON.parse(msg.data)
        .map(m => tickerTransform(m))
    )
  }

  return options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
};

const tickerTransform = m => ({
  eventType: m.e,
  eventTime: m.E,
  symbol: m.s,
  priceChange: m.p,
  priceChangePercent: m.P,
  weightedAvgPrice: m.w,
  lastPrice: m.c,
  lastQuantity: m.Q,
  open: m.o,
  high: m.h,
  low: m.l,
  volume: m.v,
  volumeQuote: m.q,
  openTime: m.O,
  closeTime: m.C,
  firstTradeId: m.F,
  lastTradeId: m.L,
  totalTrades: m.n,
  // TODO:
  // prevDayClose: m.x,
  // bestBid: m.b,
  // bestBidQnt: m.B,
  // bestAsk: m.a,
  // bestAskQnt: m.A
});

// ________ book Ticker
const bookTicker = (symbol, cb) => {
  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@bookTicker`);

  w.onmessage = msg => {
    cb(
      bookTickerTransform(
        JSON.parse(msg.data)
      )
    );
  }
}

const allBookTicker = cb => {
  const w = openWebSocket(`${BASE}/ws/!bookTicker`);

  w.onmessage = msg => {
    cb(
      JSON.parse(msg.data)
        .map(d => bookTickerTransform(d))
    );
  }
}

const bookTickerTransform = d => ({
  updateId: d.u,
  bestBidPrice: d.b,
  bestBidQty: d.B,
  bestAskPrice: d.a,
  bestAskQty: d.A
})

// ______________________________ liquidation order
const liquidationOrder = (symbol, cb) => {
  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@forceOrder`);

  w.onmessage = msg => {
    cb(liquidationOrderTransform(
      JSON.parse(msg.data)
    ));
  }
}

const allLiquidationOrder = cb => {
  const w = openWebSocket(`${BASE}/ws/!forceOrder@arr`);

  w.onmessage = msg => {
    cb(
      JSON.parse(msg.data)
        .map(d => liquidationOrderTransform(d))
    );
  }
}

const liquidationOrderTransform = ({
  e: eventType,
  E: eventTime,
  o
}) => ({
  eventType,
  eventTime,
  order: {
    symbol: o.s,
    side: o.S,
    orderType: o.o,
    timeInForce: o.f,
    quantity: o.q,
    averagePrice: o.ap,
    status: o.X,
    lastFilledQuantity: o.l,
    filledAccumulatedQuantity: o.z,
    tradeTime: o.T
  }
});

// TODO: CONTINUE FROM HERE

// _______________________________ depth

const partialDepth = (payload, cb) => {
  const { symbol, speed } = payload;
  let { level } = payload;
  if (!level) { level = 10; };

  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@depth${level}${speed && speed !== '250ms' ? `@${speed}` : ''}`);

  w.onmessage = msg => {
    const {
      e: eventType,
      E: eventTime,
      T: transactionTime,
      s: symbol,
      U: firstUpdateId,
      u: finalUpdateId,
      pu: lastUpdateIdInLastStream,
      b: bidDepth,
      a: askDepth,
    } = JSON.parse(msg.data)

    cb({
      eventType,
      eventTime,
      symbol,
      firstUpdateId,
      finalUpdateId,
      transactionTime,
      lastUpdateIdInLastStream,
      bidDepth: bidDepth.map(b => zip(['price', 'quantity'], b)),
      askDepth: askDepth.map(a => zip(['price', 'quantity'], a)),
    })
  }

  return options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
}



const depth = (payload, cb) => {
  const { symbol, speed } = payload;
  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@depth${speed ? `@${speed}` : ''}`);

  w.onmessage = msg => {
    const {
      e: eventType,
      E: eventTime,
      T: transactionTime,
      s: symbol,
      U: firstUpdateId,
      u: finalUpdateId,
      pu: lastUpdateIdInLastStream,
      b: bidDepth,
      a: askDepth,
    } = JSON.parse(msg.data)

    cb({
      eventType,
      eventTime,
      symbol,
      firstUpdateId,
      finalUpdateId,
      transactionTime,
      lastUpdateIdInLastStream,
      bidDepth: bidDepth.map(b => zip(['price', 'quantity'], b)),
      askDepth: askDepth.map(a => zip(['price', 'quantity'], a)),
    })
  }

  return options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
}



const tradesOutputMapping = (d) => ({
  eventType: d.e,
  eventTime: d.E,
  symbol: d.s,
  tradeId: d.t,
  price: d.p,
  quantity: d.q,
  buyerOrderId: d.b,
  sellerOrderId: d.a,
  tradeTime: d.T,
  isBuyerMaker: d.m,
  isBestMatch: d.M
})
const trades = (payload, cb) => tradesInternal(payload, 'trade', tradesOutputMapping, cb)

const userTransforms = {
  outboundAccountInfo: m => ({
    eventType: 'account',
    eventTime: m.E,
    makerCommissionRate: m.m,
    takerCommissionRate: m.t,
    buyerCommissionRate: m.b,
    sellerCommissionRate: m.s,
    canTrade: m.T,
    canWithdraw: m.W,
    canDeposit: m.D,
    lastAccountUpdate: m.u,
    balances: m.B.reduce((out, cur) => {
      out[cur.a] = { available: cur.f, locked: cur.l }
      return out
    }, {}),
  }),
  executionReport: m => ({
    eventType: 'executionReport',
    eventTime: m.E,
    symbol: m.s,
    newClientOrderId: m.c,
    originalClientOrderId: m.C,
    side: m.S,
    orderType: m.o,
    timeInForce: m.f,
    quantity: m.q,
    price: m.p,
    executionType: m.x,
    stopPrice: m.P,
    icebergQuantity: m.F,
    orderStatus: m.X,
    orderRejectReason: m.r,
    orderId: m.i,
    orderTime: m.T,
    lastTradeQuantity: m.l,
    totalTradeQuantity: m.z,
    priceLastTrade: m.L,
    commission: m.n,
    commissionAsset: m.N,
    tradeId: m.t,
    isOrderWorking: m.w,
    isBuyerMaker: m.m,
    creationTime: m.O,
    totalQuoteTradeQuantity: m.Z,
  }),
}

export const userEventHandler = cb => msg => {
  const { e: type, ...rest } = JSON.parse(msg.data)
  cb(userTransforms[type] ? userTransforms[type](rest) : { type, ...rest })
}

export const keepStreamAlive = (method, listenKey) => method({ listenKey })

const user = opts => cb => {
  const { getDataStream, keepDataStream, closeDataStream } = httpMethods(opts)
  let currentListenKey = null
  let int = null
  let w = null

  const keepAlive = isReconnecting => {
    if (currentListenKey) {
      keepStreamAlive(keepDataStream, currentListenKey).catch(() => {
        closeStream({}, true)

        if (isReconnecting) {
          setTimeout(() => makeStream(true), 30e3)
        } else {
          makeStream(true)
        }
      })
    }
  }

  const closeStream = (options, catchErrors) => {
    if (currentListenKey) {
      clearInterval(int)

      const p = closeDataStream({ listenKey: currentListenKey })

      if (catchErrors) {
        p.catch(f => f)
      }

      w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
      currentListenKey = null
    }
  }

  const makeStream = isReconnecting => {
    return getDataStream()
      .then(({ listenKey }) => {
        w = openWebSocket(`${BASE}/${listenKey}`)
        w.onmessage = msg => userEventHandler(cb)(msg)

        currentListenKey = listenKey

        int = setInterval(() => keepAlive(false), 50e3)

        keepAlive(true)

        return options => closeStream(options)
      })
      .catch(err => {
        if (isReconnecting) {
          setTimeout(() => makeStream(true), 30e3)
        } else {
          throw err
        }
      })
  }

  return makeStream(false)
}

export default opts => ({
  depth,
  partialDepth,
  markPrice,
  markPriceAll,
  candles,
  trades,
  aggTrades,
  ticker,
  miniTicker,
  allMiniTickers,
  allTickers,
  bookTicker,
  allBookTicker,
  liquidationOrder,
  allLiquidationOrder,
  user: user(opts),
  multiStreams
})
