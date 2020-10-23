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
const aggTrades = (symbol, cb) => tradesInternal(symbol, 'aggTrade', aggTradesOutputMapping, cb)

// ____________________________ trade

const tradesOutputMapping = (d) => ({
  eventType: d.e,
  eventTime: d.E,
  symbol: d.s,
  tradeId: d.t,
  price: d.p,
  quantity: d.q,
  tradeTime: d.T,
  isBuyerMaker: d.m
})
const trades = (symbol, cb) => tradesInternal(symbol, 'trade', tradesOutputMapping, cb)

const tradesInternal = (symbol, streamName, outputMap, cb) => {
  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@${streamName}`)
  w.onmessage = msg => {
    cb(outputMap(JSON.parse(msg.data)))
  }

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
  }
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

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
  }
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

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
  }
}

// _______________________________ candles (Kline/Candlestick)

const candles = (symbol, interval, cb) => {
  if (!symbol || !interval || !cb) {
    throw new Error('Please pass a symbol, interval and callback.')
  }

  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@kline_${interval}`)

  w.onmessage = msg => {
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
  };

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
  }
}

// _______________________________ tickers

// ____________ mini ticker
const miniTicker = (symbol, cb) => {
  const w = openWebSocket(`${BASE}/ws/${symbol.toLowerCase()}@miniTicker`)

  w.onmessage = msg => {
    cb(miniTickerTransform(JSON.parse(msg.data)))
  }

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
  }
};


const allMiniTickers = (cb) => {
  const w = openWebSocket(`${BASE}/ws/!miniTicker@arr`)

  w.onmessage = msg => {
    cb(
      JSON.parse(msg.data)
        .map(d => miniTickerTransform(d))
    );
  }

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
  }
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

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
  }
};

const allTickers = cb => {
  const w = new openWebSocket(`${BASE}/ws/!ticker@arr`)

  w.onmessage = msg => {
    cb(
      JSON.parse(msg.data)
        .map(m => tickerTransform(m))
    )
  }

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
  }
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

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
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

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
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

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
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

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
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
    price: o.p,
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

    return {
      closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
      ws: w
    }
  }

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
  }
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

  return {
    closeStream: options => w.close(1000, 'Close handle was called', { keepClosed: true, ...options }),
    ws: w
  }
}



// _____________________________________________ user data streams

const userTransforms = {
  MARGIN_CALL: m => {
    return {
      eventType: 'MARGIN_CALL',
      evenTime: m.E,
      crossWalletBalance: m.cw,
      positions: m.p.map(p => ({
        symbol: p.s,
        positionSide: p.ps,
        positionAmount: p.pa,
        marginType: p.mt,
        isolatedWallet: p.iw,
        markPrice: p.mp,
        unrealizedPnL: p.up,
        maintenanceMarginRequired: p.mm
      }))
    }
  },
  ACCOUNT_UPDATE: m => {
    const a = m.a;
    return {
      eventType: 'ACCOUNT_UPDATE',
      eventTime: m.E,
      transactTime: m.T,
      updateData: {
        eventReasonType: a.m,
        balances: a.B.map((d) => ({
          asset: d.a,
          balance: d.wb,
          crossWalletBalance: d.cw
        })),
        positions: a.P.map((d) => ({
          symbol: d.s,
          positionAmount: d.pa,
          entryPrice: d.ep,
          preAccumulatedRealizedFee: d.cr,
          marginType: d.mt,
          isolatedWallet: d.iw,
          positionSide: d.ps
        }))
      }
    }
  },
  ORDER_TRADE_UPDATE: m => {
    const o = m.o;
    return {
      eventType: 'ORDER_TRADE_UPDATE',
      eventTime: m.E,
      transactTime: m.T,
      order: {
        symbol: o.s,
        clientOrderId: o.c,
        side: o.S,
        type: o.o,
        timeInForce: o.f,
        origQty: o.q,
        origPrice: o.p,
        avgPrice: o.ap,
        stopPrice: o.sp,
        execType: o.x,
        status: o.X,
        orderId: o.i,
        lastFilledQty: o.l,
        filledAccumulatedQty: o.z,
        lastFilledPrice: o.L,
        commissionAsset: o.N,
        commission: o.n,
        tradeTime: o.T,
        tradeId: o.t,
        bidNational: o.b,
        askNational: o.a,
        isMaker: o.m,
        isReduceOnly: o.R,
        stopPriceType: o.wt
      } 
    }
  }
}

export const userEventHandler = cb => msg => {
  const { e: eventType, ...rest } = JSON.parse(msg.data)
  cb(userTransforms[eventType] ? userTransforms[eventType](rest) : { eventType, ...rest })
}

const user = opts => cb => {
  let recvWindow;
  if (arguments.length === 2) {
    recvWindow = arguments[0].recvWindow
    cb = arguments[1]
  }

  const {
    futuresGetUserDataStream,
    futuresKeepUserDataStream,
    futuresCloseUserDataStream
  } = httpMethods(opts)

  let currentListenKey = null
  let int = null
  let w = null

  const handleEvent = msg => {
    const { e: type, ...rest } = JSON.parse(msg.data)
    if (type === 'listenKeyExpired') {
      keepAlive(false);
      return;
    }
    cb(userTransforms[type] ? userTransforms[type](rest) : { type, ...rest })
  }

  const _futuresKeepUserDataStream = () => {
    if (recvWindow) {
      return futuresKeepUserDataStream({ recvWindow })
    }
    return futuresKeepUserDataStream()
  }

  const keepAlive = isReconnecting => {
    if (currentListenKey) {
      clearInterval(int)
      _futuresKeepUserDataStream().catch(() => {
        closeStream({}, true)

        if (isReconnecting) {
          setTimeout(() => makeStream(true), 30e3)
        } else {
          makeStream(true)
        }
      })
    }
  }

  const _futuresCloseUserDataStream = () => {
    if (recvWindow) {
      return futuresCloseUserDataStream({ recvWindow })
    }
    return futuresCloseUserDataStream()
  }

  const closeStream = (options, catchErrors) => {
    if (currentListenKey) {
      clearInterval(int)

      const p = _futuresCloseUserDataStream()

      if (catchErrors) {
        p.catch(f => f)
      }

      w.close(1000, 'Close handle was called', { keepClosed: true, ...options })
      currentListenKey = null
    }
  }

  const _futuresGetUserDataStream = () => {
    if (recvWindow) {
      return futuresGetUserDataStream({ recvWindow })
    }
    return futuresGetUserDataStream();
  }

  const makeStream = isReconnecting => {
    return new Promise((resolve) => {
      _futuresGetUserDataStream()
      .then(({ listenKey }) => {
        w = openWebSocket(`${BASE}/ws/${listenKey}`)
        w.onmessage = msg => handleEvent(msg)

        currentListenKey = listenKey

        if (!int) {
          int = setInterval(() => keepAlive(false), 55 * 60 * 50e3)
        }
        // TODO: think about using only listenKeyExpired

        resolve({
          closeStream: options => closeStream(options),
          ws: w
        })
      })
      .catch(err => {
        if (isReconnecting) {
          setTimeout(() => { resolve(makeStream(true)) }, 30e3)
        } else {
          throw err;
        }
      })
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
