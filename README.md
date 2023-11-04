# binance-client

🥎🥎🥎🥎🥎  ❌❌❌ ❌❌❌ ❌❌❌ ❌❌❌ ❌❌❌ ❌❌❌    🥎🥎🥎🥎🥎
 - This package is no more being maintained. Deprecated. ❗

🥎🥎🥎🥎🥎  ❌❌❌ ❌❌❌ ❌❌❌ ❌❌❌ ❌❌❌ ❌❌❌    🥎🥎🥎🥎🥎

> NOTICE: Proxy support was Added (check the last section in the doc)

> NOTICE: BINANCE FUTURES support
>
> (User stream for Binance futures is fully supported ! Doc updated to reflect it! Go all bellow!)

> Binance futures typescript supported

> The doc for Binance (spot, margin,) wasn't updated! Neither **futures** is well documented! If you go for this package check the code source and the official doc! Still we are updating and adding more reference from time to time!

> To note the Binance futures official doc is way nice
>
> https://binance-docs.github.io/apidocs/futures/en/

> The same order as the official doc was followed for the function implementation

> The Doc here is just a big mess! We don't have time for it now! It will be updated at a later time! (If any one want to contribute! And match things between the code source and the official doc! And update the different sections! Special for normal Binance! Just a little updates are required! We will accept and review all PR! The library is just getting more complete and richer! With options that are not supported anywhere else! A good doc will make it helpful for a lot! And we want to make it so!)

> For the future we will take full support and development responsibility for the package so it will be helpful to other people! As our work is based on it! We will keep it sharp at all times

> No may be this is just the wrong destination! the package is well usable and all good! And getting better and better! But there is no support! And all the doc is a mess

NOTICE: The Doc is out of date! Make sure to verify the outcomes! Or check the Declaration type file [here](https://github.com/MohamedLamineAllal/binance-client/blob/master/index.d.ts)! Or the code source itself! (Use CTRL + F To be productive)!

> NOTICE: if you use this library and just to save some hassle if it happen! In case you update! Then the code break! Immediately go check the package version! We may have add breaking changes updates! We are using semantic versioning! But still we made some partial breaking changes! Which we completed on the same version! We shouldn't have done that! But to move fast we did that! If anything check the version! Things will get more robust by the time that is coming!

> Including cleaning that big mess README and doc! That make people go away! GO AWAY! UNLESS you see real VALUE hhhhh! (And of course i'm awesome hhhhhh! Humor can be magic)

# DOC

> A complete API wrapper for the [Binance](https://binance.com) API.

> this project support typescript too.


### Installation

    npm install binance-client --save
  or
    yarn add binance-client

### Getting started

Import the module and create a new client. Passing api keys is optional only if
you don't plan on doing authenticated calls. You can create an api key
[here](https://www.binance.com/userCenter/createApi.html).

```js
import Binance from 'binance-client'

const client = Binance()

// Authenticated client, can make signed calls
const client2 = Binance({
  apiKey: 'xxx',
  apiSecret: 'xxx',
  getTime: xxx // time generator function, optional, defaults to () => Date.now()
})

client.time().then(time => console.log(time))
```

If you do not have an appropriate babel config, you will need to use the basic commonjs requires.

```js
const Binance = require('binance-client').default
```

Every REST method returns a Promise, making this library [async await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) ready.
Following examples will use the `await` form, which requires some configuration you will have to lookup.

### Table of Contents

- [binance-client](#binance-client)
- [DOC](#doc)
    - [Installation](#installation)
    - [Getting started](#getting-started)
    - [Table of Contents](#table-of-contents)
    - [Public REST Endpoints](#public-rest-endpoints)
      - [ping](#ping)
      - [time](#time)
      - [exchangeInfo](#exchangeinfo)
      - [book](#book)
      - [candles](#candles)
      - [aggTrades](#aggtrades)
      - [trades](#trades)
      - [dailyStats](#dailystats)
      - [avgPrice](#avgprice)
      - [prices](#prices)
      - [allBookTickers](#allbooktickers)
    - [Authenticated REST Endpoints](#authenticated-rest-endpoints)
      - [order](#order)
      - [orderTest](#ordertest)
      - [getOrder](#getorder)
      - [cancelOrder](#cancelorder)
      - [openOrders](#openorders)
      - [allOrders](#allorders)
      - [accountInfo](#accountinfo)
      - [myTrades](#mytrades)
      - [tradesHistory](#tradeshistory)
      - [depositHistory](#deposithistory)
      - [withdrawHistory](#withdrawhistory)
      - [withdraw](#withdraw)
      - [depositAddress](#depositaddress)
      - [tradeFee](#tradefee)
    - [WebSockets](#websockets)
      - [depth](#depth)
      - [partialDepth](#partialdepth)
      - [ticker](#ticker)
      - [allTickers](#alltickers)
      - [candles](#candles-1)
      - [trades](#trades-1)
      - [aggTrades](#aggtrades-1)
      - [user](#user)
    - [ErrorCodes](#errorcodes)
  - [Binance futures](#binance-futures)
    - [Futures Websocket](#futures-websocket)
      - [Normal streams](#normal-streams)
        - [Event description and info](#event-description-and-info)
          - [MARGIN\_CALL](#margin_call)
          - [ACCOUNT\_UPDATE](#account_update)
          - [ACCOUNT\_ORDER\_UPDATE](#account_order_update)
  - [Using proxy](#using-proxy)

### Public REST Endpoints

#### ping

Test connectivity to the API.

```js
console.log(await client.ping())
```

#### time

Test connectivity to the Rest API and get the current server time.

```js
console.log(await client.time())
```

<details>
<summary>Output</summary>

```js
1508478457643
```

</details>

#### exchangeInfo

Get the current exchange trading rules and symbol information.

```js
console.log(await client.exchangeInfo())
```

<details>
<summary>Output</summary>

```js
{
  "timezone": "UTC",
  "serverTime": 1508631584636,
  "rateLimits": [
    {
      "rateLimitType": "REQUEST_WEIGHT",
      "interval": "MINUTE",
      "intervalNum": 1,
      "limit": 1200
    },
    {
      "rateLimitType": "ORDERS",
      "interval": "SECOND",
      "intervalNum": 1,
      "limit": 10
    },
    {
      "rateLimitType": "ORDERS",
      "interval": "DAY",
      "intervalNum": 1,
      "limit": 100000
    }
  ],
  "exchangeFilters": [],
  "symbols": [{
    "symbol": "ETHBTC",
    "status": "TRADING",
    "baseAsset": "ETH",
    "baseAssetPrecision": 8,
    "quoteAsset": "BTC",
    "quotePrecision": 8,
    "orderTypes": ["LIMIT", "MARKET"],
    "icebergAllowed": false,
    "filters": [{
      "filterType": "PRICE_FILTER",
      "minPrice": "0.00000100",
      "maxPrice": "100000.00000000",
      "tickSize": "0.00000100"
    }, {
      "filterType": "LOT_SIZE",
      "minQty": "0.00100000",
      "maxQty": "100000.00000000",
      "stepSize": "0.00100000"
    }, {
      "filterType": "MIN_NOTIONAL",
      "minNotional": "0.00100000"
    }]
  }]
}
```

</details>

#### book

Get the order book for a symbol.

```js
console.log(await client.book({ symbol: 'ETHBTC' }))
```

|Param|Type|Required|Default|
|--- |--- |--- |--- |
|symbol|String|true|
|limit|Number|false|`100`|

<details>
<summary>Output</summary>

```js
{
  lastUpdateId: 17647759,
  asks:
   [
     { price: '0.05411500', qty: '5.55000000' },
     { price: '0.05416700', qty: '11.80100000' }
   ],
  bids:
   [
     { price: '0.05395500', qty: '2.70000000' },
     { price: '0.05395100', qty: '11.84100000' }
   ]
}
```

</details>

#### candles

Retrieves Candlestick for a symbol. Candlesticks are uniquely identified by their open time.

```js
console.log(await client.candles({ symbol: 'ETHBTC' }))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|interval|String|false|`5m`|`1m`, `3m`, `5m`, `15m`, `30m`, `1h`, `2h`,<br>`4h`, `6h`, `8h`, `12h`, `1d`, `3d`, `1w`, `1M`|
|limit|Number|false|`500`|Max `1000`|
|startTime|Number|false|
|endTime|Number|false|

<details>
<summary>Output</summary>

```js
[{
  openTime: 1508328900000,
  open: '0.05655000',
  high: '0.05656500',
  low: '0.05613200',
  close: '0.05632400',
  volume: '68.88800000',
  closeTime: 1508329199999,
  quoteAssetVolume: '2.29500857',
  trades: 85,
  baseAssetVolume: '40.61900000'
}]
```

</details>

#### aggTrades

Get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated.

```js
console.log(await client.aggTrades({ symbol: 'ETHBTC' }))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|fromId|String|false||ID to get aggregate trades from INCLUSIVE.|
|startTime|Number|false||Timestamp in ms to get aggregate trades from INCLUSIVE.
|endTime|Number|false||Timestamp in ms to get aggregate trades until INCLUSIVE.|
|limit|Number|false|`500`|Max `500`|

Note: If both `startTime` and `endTime` are sent, `limit` should not be sent AND the distance between `startTime` and `endTime` must be less than 24 hours.

Note: If `frondId`, `startTime`, and `endTime` are not sent, the most recent aggregate trades will be returned.

<details>
<summary>Output</summary>

```js
[{
  aggId: 2107132,
  price: '0.05390400',
  qty: '1.31000000',
  firstId: 2215345,
  lastId: 2215345,
  time: 1508478599481,
  isBuyerMaker: true,
  isBestMatch: true
}]
```

</details>

#### trades

Get recent trades of a symbol.

```js
console.log(await client.trades({ symbol: 'ETHBTC' }))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|limit|Number|false|`500`|Max `500`|

<details>
<summary>Output</summary>

```js
[
  {
    "id": 28457,
    "price": "4.00000100",
    "qty": "12.00000000",
    "time": 1499865549590,
    "isBuyerMaker": true,
    "isBestMatch": true
  }
]
```

</details>

#### dailyStats

24 hour price change statistics, not providing a symbol will return all tickers and is resource-expensive.

```js
console.log(await client.dailyStats({ symbol: 'ETHBTC' }))
```

|Param|Type|Required|
|--- |--- |--- |
|symbol|String|false|

<details>
<summary>Output</summary>

```js
{
  symbol: 'ETHBTC',
  priceChange: '-0.00112000',
  priceChangePercent: '-1.751',
  weightedAvgPrice: '0.06324784',
  prevClosePrice: '0.06397400',
  lastPrice: '0.06285500',
  lastQty: '0.63500000',
  bidPrice: '0.06285500',
  bidQty: '0.81900000',
  askPrice: '0.06291900',
  askQty: '2.93800000',
  openPrice: '0.06397500',
  highPrice: '0.06419100',
  lowPrice: '0.06205300',
  volume: '126240.37200000',
  quoteVolume: '7984.43091340',
  openTime: 1521622289427,
  closeTime: 1521708689427,
  firstId: 45409308, // First tradeId
  lastId: 45724293, // Last tradeId
  count: 314986 // Trade count
}
```

</details>

#### avgPrice

Current average price for a symbol.

```js
console.log(await client.avgPrice({ symbol: 'ETHBTC' }))
```

| Param  | Type   | Required |
| ------ | ------ | -------- |
| symbol | String | true     |

<details>
<summary>Output</summary>

```js
{
  "mins": 5,
  "price": "9.35751834"
}
```

</details>

#### prices

Latest price for all symbols.

```js
console.log(await client.prices())
```

<details>
<summary>Output</summary>

```js
{
  ETHBTC: '0.05392500',
  LTCBTC: '0.01041100',
  ...
}
```

</details>

#### allBookTickers

Best price/quantity on the order book for all symbols.

```js
console.log(await client.allBookTickers())
```

<details>
<summary>Output</summary>

```js
{
  DASHBTC: {
    symbol: 'DASHBTC',
    bidPrice: '0.04890400',
    bidQty: '0.74100000',
    askPrice: '0.05230000',
    askQty: '0.79900000'
  },
  DASHETH: {
    symbol: 'DASHETH',
    bidPrice: '0.89582000',
    bidQty: '0.63300000',
    askPrice: '1.02328000',
    askQty: '0.99900000'
  }
  ...
}
```

</details>

### Authenticated REST Endpoints

Note that for all authenticated endpoints, you can pass an extra parameter
`useServerTime` set to `true` in order to fetch the server time before making
the request.

#### order

Creates a new order.

```js
console.log(await client.order({
  symbol: 'XLMETH',
  side: 'BUY',
  qty: 100,
  price: 0.0002,
}))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|side|String|true||`BUY`,`SELL`|
|type|String|false|`LIMIT`|`LIMIT`, `MARKET`|
|quantity|Number|true|
|price|Number|true||Optional for `MARKET` orders|
|timeInForce|String|false|`GTC`|`FOK`, `GTC`, `IOC`|
|newClientOrderId|String|false||A unique id for the order. Automatically generated if not sent.|
|stopPrice|Number|false||Used with stop orders|
|newOrderRespType|String|false|`RESULT`|Returns more complete info of the order. `ACK`, `RESULT`, or `FULL`|
|icebergQty|Number|false||Used with iceberg orders|
|recvWindow|Number|false|

Additional mandatory parameters based on `type`:

Type | Additional mandatory parameters
------------ | ------------
`LIMIT` | `timeInForce`, `quantity`, `price`
`MARKET` | `quantity`
`STOP_LOSS` | `quantity`, `stopPrice`
`STOP_LOSS_LIMIT` | `timeInForce`, `quantity`,  `price`, `stopPrice`
`TAKE_PROFIT` | `quantity`, `stopPrice`
`TAKE_PROFIT_LIMIT` | `timeInForce`, `quantity`, `price`, `stopPrice`
`LIMIT_MAKER` | `quantity`, `price`

* `LIMIT_MAKER` are `LIMIT` orders that will be rejected if they would immediately match and trade as a taker.
* `STOP_LOSS` and `TAKE_PROFIT` will execute a `MARKET` order when the `stopPrice` is reached.
* Any `LIMIT` or `LIMIT_MAKER` type order can be made an iceberg order by sending an `icebergQty`.
* Any order with an `icebergQty` MUST have `timeInForce` set to `GTC`.

<details>
<summary>Output</summary>

```js
{
  symbol: 'XLMETH',
  orderId: 1740797,
  clientOrderId: '1XZTVBTGS4K1e',
  transactTime: 1514418413947,
  price: '0.00020000',
  origQty: '100.00000000',
  executedQty: '0.00000000',
  status: 'NEW',
  timeInForce: 'GTC',
  type: 'LIMIT',
  side: 'BUY'
}
```

</details>

#### orderTest

Test new order creation and signature/recvWindow. Creates and validates a new order but does not send it into the matching engine.

Same API as above, but does not return any output on success.

#### getOrder

Check an order's status.

```js
console.log(await client.getOrder({
  symbol: 'BNBETH',
  orderId: 50167927,
}))
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|symbol|String|true|
|orderId|Number|true|Not required if `origClientOrderId` is used|
|origClientOrderId|String|false|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  clientOrderId: 'NkQnNkdBV1RGjUALLhAzNy',
  cummulativeQuoteQty: '0.16961580',
  executedQty: '3.91000000',
  icebergQty: '0.00000000',
  isWorking: true,
  orderId: 50167927,
  origQty: '3.91000000',
  price: '0.04338000',
  side: 'SELL',
  status: 'FILLED',
  stopPrice: '0.00000000',
  symbol: 'BNBETH',
  time: 1547075007821,
  timeInForce: 'GTC',
  type: 'LIMIT',
  updateTime: 1547075016737
}

```

</details>

#### cancelOrder

Cancels an active order.

```js
console.log(await client.cancelOrder({
  symbol: 'ETHBTC',
  orderId: 1,
}))
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|symbol|String|true|
|orderId|Number|true|Not required if `origClientOrderId` is used|
|origClientOrderId|String|false|
|newClientOrderId|String|false|Used to uniquely identify this cancel. Automatically generated by default.|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  symbol: 'ETHBTC',
  origClientOrderId: 'bnAoRHgI18gRD80FJmsfNP',
  orderId: 1,
  clientOrderId: 'RViSsQPTp1v3WmLYpeKT11'
}
```

</details>

#### openOrders

Get all open orders on a symbol.

```js
console.log(await client.openOrders({
  symbol: 'XLMBTC',
}))
```

|Param|Type|Required|
|--- |--- |--- |
|symbol|String|true|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
[{
  symbol: 'XLMBTC',
  orderId: 11271740,
  clientOrderId: 'ekHkROfW98gBN80LTfufQZ',
  price: '0.00001081',
  origQty: '1331.00000000',
  executedQty: '0.00000000',
  status: 'NEW',
  timeInForce: 'GTC',
  type: 'LIMIT',
  side: 'BUY',
  stopPrice: '0.00000000',
  icebergQty: '0.00000000',
  time: 1522682290485,
  isWorking: true
}]
```

</details>

#### allOrders

Get all account orders on a symbol; active, canceled, or filled.

```js
console.log(await client.allOrders({
  symbol: 'ETHBTC',
}))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|orderId|Number|false||If set, it will get orders >= that orderId. Otherwise most recent orders are returned.|
|limit|Number|false|`500`|Max `500`|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
[{
  symbol: 'ENGETH',
  orderId: 191938,
  clientOrderId: '1XZTVBTGS4K1e',
  price: '0.00138000',
  origQty: '1.00000000',
  executedQty: '1.00000000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'LIMIT',
  side: 'SELL',
  stopPrice: '0.00000000',
  icebergQty: '0.00000000',
  time: 1508611114735,
  isWorking: true
}]
```

</details>

#### accountInfo

Get current account information.

```js
console.log(await client.accountInfo())
```

|Param|Type|Required|
|--- |--- |--- |
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  makerCommission: 10,
  takerCommission: 10,
  buyerCommission: 0,
  sellerCommission: 0,
  canTrade: true,
  canWithdraw: true,
  canDeposit: true,
  balances: [
    { asset: 'BTC', free: '0.00000000', locked: '0.00000000' },
    { asset: 'LTC', free: '0.00000000', locked: '0.00000000' },
  ]
}
```

</details>

#### myTrades

Get trades for the current authenticated account and symbol.

```js
console.log(await client.myTrades({
  symbol: 'ETHBTC',
}))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|limit|Number|false|`500`|Max `500`|
|fromId|Number|false||TradeId to fetch from. Default gets most recent trades.|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
[{
  id: 9960,
  orderId: 191939,
  price: '0.00138000',
  qty: '10.00000000',
  commission: '0.00001380',
  commissionAsset: 'ETH',
  time: 1508611114735,
  isBuyer: false,
  isMaker: false,
  isBestMatch: true
}]
```

</details>

#### tradesHistory

Lookup symbol trades history.

```js
console.log(await client.tradesHistory({ symbol: 'ETHBTC' }))
```

|Param|Type|Required|Default|Description|
|--- |--- |--- |--- |--- |
|symbol|String|true|
|limit|Number|false|`500`|Max `500`|
|fromId|Number|false|`null`|TradeId to fetch from. Default gets most recent trades.|

<details>
<summary>Output</summary>

```js
[
  {
    "id": 28457,
    "price": "4.00000100",
    "quantity": "12.00000000",
    "time": 1499865549590,
    "isBuyerMaker": true,
    "isBestMatch": true
  }
]
```

</details>

#### depositHistory

Get the account deposit history.

```js
console.log(await client.depositHistory())
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|asset|String|false|
|status|Number|false|0 (0: pending, 1: success)|
|startTime|Number|false|
|endTime|Number|false|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  "depositList": [
    {
      "insertTime": 1508198532000,
      "amount": 0.04670582,
      "asset": "ETH",
      "status": 1
    }
  ],
  "success": true
}
```

</details>

#### withdrawHistory

Get the account withdraw history.

```js
console.log(await client.withdrawHistory())
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|asset|String|false|
|status|Number|false|0 (0: Email Sent, 1: Cancelled 2: Awaiting Approval, 3: Rejected, 4: Processing, 5: Failure, 6: Completed)|
|startTime|Number|false|
|endTime|Number|false|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  "withdrawList": [
    {
      "amount": 1,
      "address": "0x6915f16f8791d0a1cc2bf47c13a6b2a92000504b",
      "asset": "ETH",
      "applyTime": 1508198532000
      "status": 4
    },
  ],
  "success": true
}
```

</details>

#### withdraw

Triggers the withdraw process (*untested for now*).

```js
console.log(await client.withdraw({
  asset: 'ETH',
  address: '0xfa97c22a03d8522988c709c24283c0918a59c795',
  amount: 100,
}))
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|asset|String|true|
|address|String|true|
|amount|Number|true|
|name|String|false|Description of the address|
|recvWindow|Number|false|

<details>
<summary>Output</summary>

```js
{
  "msg": "success",
  "success": true
}
```

</details>

#### depositAddress

Retrieve the account deposit address for a specific asset.

```js
console.log(await client.depositAddress({ asset: 'NEO' }))
```

|Param|Type|Required|Description|
|--- |--- |--- |--- |
|asset|String|true|The asset name|

<details>
<summary>Output</summary>

```js
{
  address: 'AM6ytPW78KYxQCmU2pHYGcee7GypZ7Yhhc',
  addressTag: '',
  asset: 'NEO',
  success: true,
}
```

</details>

#### tradeFee

Retrieve the account trade Fee per asset.

```js
console.log(await client.tradeFee())
```

<details>
<summary>Output</summary>

```js
[{
  symbol: 'BTC',
  maker: 0.0001,
  taker: 0.0001,
},
{
  symbol: 'LTC',
  maker: 0.0001,
  taker: 0.0001,
}
...]
```

</details>


### WebSockets

Every websocket utility returns an object that contain the `closeStream` function you can call it to close the opened
connection or connections and avoid memory issues.

And too a `ws` that refer to websocket or a list of websockets objects! That you can use to listen to the websocket cycle events! Sometimes you may need that! And we exposed the object! We needed that in our work!

Return object signature

```ts
export interface StreamReturnObj {
  closeStream: ReconnectingWebSocketHandler,
  ws: WebSocket | WebSocket[]
}
```

You can check the WebSocket object api!

https://developer.mozilla.org/en-US/docs/Web/API/WebSocket


```js
const { closeStream, ws } = client.ws.depth('ETHBTC', depth => {
  console.log(depth)
})

// After you're done
closeStream()
```

#### depth

Live depth market data feed. The first parameter can either
be a single symbol string or an array of symbols.

```js
client.ws.depth('ETHBTC', depth => {
  console.log(depth)
})
```

<details>
<summary>Output</summary>

```js
{
  eventType: 'depthUpdate',
  eventTime: 1508612956950,
  symbol: 'ETHBTC',
  firstUpdateId: 18331140,
  finalUpdateId: 18331145,
  bidDepth: [
    { price: '0.04896500', qty: '0.00000000' },
    { price: '0.04891100', qty: '15.00000000' },
    { price: '0.04891000', qty: '0.00000000' } ],
  askDepth: [
    { price: '0.04910600', qty: '0.00000000' },
    { price: '0.04910700', qty: '11.24900000' }
  ]
}
```

</details>

#### partialDepth

Top levels bids and asks, pushed every second. Valid levels are 5, 10, or 20.
Accepts an array of objects for multiple depths.

```js
client.ws.partialDepth({ symbol: 'ETHBTC', level: 10 }, depth => {
  console.log(depth)
})
```

<details>
<summary>Output</summary>

```js
{
  symbol: 'ETHBTC',
  level: 10,
  bids: [
    { price: '0.04896500', qty: '0.00000000' },
    { price: '0.04891100', qty: '15.00000000' },
    { price: '0.04891000', qty: '0.00000000' }
  ],
  asks: [
    { price: '0.04910600', qty: '0.00000000' },
    { price: '0.04910700', qty: '11.24900000' }
  ]
}
```

</details>

#### ticker

24hr Ticker statistics for a symbol pushed every second. Accepts an array of symbols.

```js
client.ws.ticker('HSRETH', ticker => {
  console.log(ticker)
})
```

<details>
<summary>Output</summary>

```js
{
  eventType: '24hrTicker',
  eventTime: 1514670820924,
  symbol: 'HSRETH',
  priceChange: '-0.00409700',
  priceChangePercent: '-11.307',
  weightedAvg: '0.03394946',
  prevDayClose: '0.03623500',
  curDayClose: '0.03213800',
  closeTradeqty: '7.02000000',
  bestBid: '0.03204200',
  bestBidQnt: '78.00000000',
  bestAsk: '0.03239800',
  bestAskQnt: '7.00000000',
  open: '0.03623500',
  high: '0.03659900',
  low: '0.03126000',
  volume: '100605.15000000',
  volumeQuote: '3415.49097353',
  openTime: 1514584420922,
  closeTime: 1514670820922,
  firstTradeId: 344803,
  lastTradeId: 351380,
  totalTrades: 6578
}
```

</details>

#### allTickers

Retrieves all the tickers.

```js
client.ws.allTickers(tickers => {
  console.log(tickers)
})
```

#### candles

Live candle data feed for a given interval. You can pass either a symbol string
or a symbol array.

```js
client.ws.candles('ETHBTC', '1m', candle => {
  console.log(candle)
})
```

<details>
<summary>Output</summary>

```js
{
  eventType: 'kline',
  eventTime: 1508613366276,
  symbol: 'ETHBTC',
  open: '0.04898000',
  high: '0.04902700',
  low: '0.04898000',
  close: '0.04901900',
  volume: '37.89600000',
  trades: 30,
  interval: '5m',
  isFinal: false,
  quoteVolume: '1.85728874',
  buyVolume: '21.79900000',
  quoteBuyVolume: '1.06838790'
}
```

</details>

#### trades

Live trade data feed. Pass either a single symbol string or an array of symbols. The trade streams push raw trade information; each trade has a unique buyer and seller.

```js
client.ws.trades(['BTCUSDT', 'ETHBTC'], trade => {
  console.log(trade)
})
```

<details>
<summary>Output</summary>

```js
......
{
  eventType: 'trade',
  eventTime: 1570196993155,
  symbol: 'ETHBTC',
  tradeId: 145470107,
  price: '0.02142700',
  qty: '0.06300000',
  buyerOrderId: 498249081,
  sellerOrderId: 498249078,
  tradeTime: 1570196993151,
  isBuyerMaker: false,
  isBestMatch: true
}
{
  eventType: 'trade',
  eventTime: 1570196993376,
  symbol: 'BTCUSDT',
  tradeId: 186166622,
  price: '8138.30000000',
  qty: '0.01722700',
  buyerOrderId: 684614964,
  sellerOrderId: 684614991,
  tradeTime: 1570196993372,
  isBuyerMaker: true,
  isBestMatch: true
}
.....

```

</details>

#### aggTrades

Live trade data feed. Pass either a single symbol string or an array of symbols. The aggregate trade streams push trade information that is aggregated for a single taker order.

```js
client.ws.aggTrades(['BTCUSDT', 'ETHBTC'], trade => {
  console.log(trade)
})
```

<details>
<summary>Output</summary>

```js
.....
{
  eventType: 'aggTrade',
  eventTime: 1570197286258,
  symbol: 'ETHBTC',
  aggId: 132178432,
  price: '0.02144000',
  qty: '0.42500000',
  firstTradeId: 145470333,
  lastTradeId: 145470333,
  tradeTime: 1570197286254,
  isBuyerMaker: true,
  isBestMatch: true
}
{
  eventType: 'aggTrade',
  eventTime: 1570197286697,
  symbol: 'BTCUSDT',
  aggId: 168291934,
  price: '8160.04000000',
  qty: '0.40000000',
  firstTradeId: 186167448,
  lastTradeId: 186167448,
  tradeTime: 1570197286693,
  isBuyerMaker: true,
  isBestMatch: true
}
....
```

</details>

#### user

Live user messages data feed.

**Requires authentication**

```js
const clean = await client.ws.user(msg => {
  console.log(msg)
})
```

Note that this method returns a promise which will resolve the `clean` callback.

<details>
<summary>Output</summary>

```js
{
  eventType: 'account',
  eventTime: 1508614885818,
  balances: {
    '123': { available: '0.00000000', locked: '0.00000000' },
    '456': { available: '0.00000000', locked: '0.00000000' },
    BTC: { available: '0.00000000', locked: '0.00000000' },
  ]
}
```

</details>

### ErrorCodes

An utility error code map is also being exported by the package in order for you to make readable
conditionals upon specific errors that could occur while using the API.

```js
import Binance, { ErrorCodes } from 'binance-client'

console.log(ErrorCodes.INVALID_ORDER_TYPE) // -1116
```

## Binance futures

### Futures Websocket

#### Normal streams

We gonna update that section later! But here a quick signature representation! You can check it here ([Declaration type file](https://github.com/MohamedLamineAllal/binance-client/blob/master/index.d.ts))! For more details (Use CTRL + F)

```ts
export interface FuturesWebSocket {
  depth: (payload: { symbol: string, speed?: string }, callback: (depth: FWsDepth) => void) => FStreamReturnObj;
  partialDepth: (payload: { symbol: string, speed?: string, level?: number }, callback: (depth: FWsPartialDepth) => void) => FStreamReturnObj;
  markPrice: (payload: { symbol: string, speed?: string }, callback: (markPrice: MarkPrice) => void) => FStreamReturnObj;
  markPriceAll: (payload: { speed?: string, reduce?: boolean }, callback: (markPrices: MarkPrice[] | ReducedMarkPrice) => void) => FStreamReturnObj;
  candles: (symbol: string, interval: string, callback: (candle: FWsCandle) => void) => FStreamReturnObj;
  trades: (symbols: string, callback: (trade: FWsTrade) => void) => FStreamReturnObj;
  aggTrades: (symbols: string, callback: (trade: FWsAggregatedTrade) => void) => FStreamReturnObj;
  ticker: (symbol: string | string[], callback: (ticker: FWsTicker) => void) => FStreamReturnObj;
  miniTicker: (symbol: string, callback: (miniTicker: FWsMiniTicker) => void) => FStreamReturnObj;
  allMiniTickers: (callback: (miniTickers: FWsMiniTicker[]) => void) => FStreamReturnObj;
  allTickers: (callback: (tickers: FWsTicker[]) => void) => FStreamReturnObj;
  bookTicker: (symbol: string, callback: (bookTicker: FWsBookTicker) => void) => FStreamReturnObj;
  allBookTicker: (callback: (bookTickers: FWsBookTicker[]) => void) => FStreamReturnObj;
  liquidationOrder: (symbol: string, callback: (liquidationOrder: FWsLiquidationOrder) => void) => FStreamReturnObj;
  allLiquidationOrder: (callback: (liquidationOrders: FWsLiquidationOrder[]) => void) => FStreamReturnObj;
  // ...
}
```

And you can check and compare with the official doc:

https://binance-docs.github.io/apidocs/futures/en/


#### user data stream

```ts
client.fws.user((data) => {
  // ...
});

```

3 main events (MARGIN_CALL, ACCOUNT_UPDATE, ACCOUNT_ORDER_UPDATE)

##### Signature

```ts
user: (callback: (msg: FWSUserOrderUpdateData | FWSUserAccountUpdateData | FWSUserMarginCallEventData | { eventType: string, [prop: string]: any }) => void) => Promise<StreamReturnObj>;
```

Orders updates data :

```ts
export interface FWSUserOrderUpdateData {
    eventType: 'ORDER_TRADE_UPDATE',
    eventTime: number,
    transactTime: number,
    order: FWSOrderUpdateOrder 
}

export interface FWSOrderUpdateOrder {
    symbol: string,
    clientOrderId: string,
    side: FOrderSide,
    type: FOrderType
    timeInForce: FTimeInForce,
    origQty: string,
    origPrice: string,
    avgPrice: string,
    stopPrice: string,
    execType: FExecutionType,
    status: FOrderStatus,
    orderId: number,
    lastFilledQty: string,
    filledAccumulatedQty: string,
    lastFilledPrice: string,
    commissionAsset: string,
    commission: string,
    tradeTime: number,
    tradeId: number,
    bidNational: string,
    askNational: string,
    isMaker: boolean,
    isReduceOnly: boolean,
    stopPriceType: string // TODO: type
}
```

Account update data (Balance and Position Update):

```ts
export interface FWSUserAccountUpdateData {
  eventType: 'ACCOUNT_UPDATE',
  eventTime: number,
  transactTime: number,
  updateData: {
      eventReasonType: FSWUserAccountUpdateEventReasonType,
      balances: FWSUserAccountUpdateBalance[],
      positions: FWSUserAccountUpdatePosition[]
  }
}

export type FSWUserAccountUpdateEventReasonType =
  | 'DEPOSIT'
  | 'WITHDRAW'
  | 'ORDER'
  | 'FUNDING_FEE'
  | 'WITHDRAW_REJECT'
  | 'ADJUSTMENT'
  | 'INSURANCE_CLEAR'
  | 'ADMIN_DEPOSIT'
  | 'ADMIN_WITHDRAW'
  | 'MARGIN_TRANSFER'
  | 'MARGIN_TYPE_CHANGE'
  | 'ASSET_TRANSFER'
  | 'OPTIONS_PREMIUM_FEE'
  | 'OPTIONS_SETTLE_PROFIT';

export interface FWSUserAccountUpdateBalance {
  asset: string,
  balance: string,
  crossWalletBalance: string
}

export interface FWSUserAccountUpdatePosition {
  symbol: string,
  positionAmount: string,
  entryPrice: string,
  preAccumulatedRealizedFee: string,
  marginType: string,
  isolatedWallet: string,
  positionSide: FPositionSide,
}
```


Margin call Data:

```ts    
export interface FWSUserMarginCallEventData {
    eventType: 'MARGIN_CALL',
    eventTime: number,
    crossWalletBalance: string,
    positions: FWSUserMarginCallEventPosition[] 
}

export interface FWSUserMarginCallEventPosition{
    symbol: string,
    positionSide: FPositionSide,
    positionAmount: string,
    marginType: string,
    isolatedWallet: string,
    markPrice: string,
    unrealizedPnL: string,
    maintenanceMarginRequired: string
}
```

#####  Event description and info

https://binance-docs.github.io/apidocs/futures/en/#user-data-streams

###### MARGIN_CALL

https://binance-docs.github.io/apidocs/futures/en/#event-user-data-stream-expired

- When the user's position risk ratio is too high, this stream will be pushed.
- This message is only used as risk guidance information and is not recommended for investment strategies.
- In the case of a highly volatile market, there may be the possibility that the user's position has been liquidated at the same time when this stream is pushed out.

###### ACCOUNT_UPDATE

Balance and Position Update

https://binance-docs.github.io/apidocs/futures/en/#event-balance-and-position-update

- Event type is ACCOUNT_UPDATE.

- When balance or position get updated, this event will be pushed.
  - ACCOUNT_UPDATE will be pushed only when update happens on user's account, including changes on balances, positions, or margin type.
  - Unfilled orders or cancelled orders will not make the event ACCOUNT_UPDATE pushed, since there's no change on positions.
  - Only positions of symbols with non-zero isolatd wallet or non-zero position amount will be pushed in the "position" part of the event ACCOUNT_UPDATE when any position changes.

- When "FUNDING FEE" changes to the user's balance, the event will be pushed with the brief message:
  - When "FUNDING FEE" occurs in a crossed position, ACCOUNT_UPDATE will be pushed with only the balance B(including the "FUNDING FEE" asset only), without any position P message.
  - When "FUNDING FEE" occurs in an isolated position, ACCOUNT_UPDATE will be pushed with only the balance B(including the "FUNDING FEE" asset only) and the relative position message P( including the isolated position on which the "FUNDING FEE" occurs only, without any other position message).

- The field "eventReasonType" represents the reason type for the event and may shows the following possible types:
  - DEPOSIT
  - WITHDRAW
  - ORDER
  - FUNDING_FEE
  - WITHDRAW_REJECT
  - ADJUSTMENT
  - INSURANCE_CLEAR
  - ADMIN_DEPOSIT
  - ADMIN_WITHDRAW
  - MARGIN_TRANSFER
  - MARGIN_TYPE_CHANGE
  - ASSET_TRANSFER
  - OPTIONS_PREMIUM_FEE
  - OPTIONS_SETTLE_PROFIT

###### ACCOUNT_ORDER_UPDATE

https://binance-docs.github.io/apidocs/futures/en/#event-order-update

When new order created, order status changed will push such event. event type is ORDER_TRADE_UPDATE.

**Side**

- BUY
- SELL

**Order Type**

- MARKET
- LIMIT
- STOP
- TAKE_PROFIT
- LIQUIDATION

**Execution Type**

- NEW
- PARTIAL_FILL
- FILL
- CANCELED
- CALCULATED - Liquidation Execution
- EXPIRED
- TRADE

**Order Status**

- NEW
- PARTIALLY_FILLED
- FILLED
- CANCELED
- EXPIRED
- NEW_INSURANCE - Liquidation with Insurance Fund
- NEW_ADL - Counterparty Liquidation`

**Time in force**

- GTC
- IOC
- FOK
- GTX

**Working Type**

- MARK_PRICE
- CONTRACT_PRICE



## Using proxy

To use a proxy we get to pass the agent object (http.Agent instance (or an object that inherit it))

And this is the way to use proxy with fetch or http.request!

(binance-client use fetch)

We do provide a helper for such agent creation

https://github.com/Glitnirian/ProxyHttpAgent

**ProxyHttpAgent** module!

Which wrap the [**tunnel**](https://github.com/koichik/node-tunnel) module for more flexibility!

Note that to setup a proxy usage you need to pass the **agent object** as the **last parameter of any function**!

``````ts
import { getProxyHttpAgent } = from 'proxy-http-agent';
import Binance from 'binance-client';

const client = Binance();

const proxyUrl = 'http://myCoolProxy.com:8123';

const agent getProxyHttpAgent({
  proxy: proxyUrl
});

const candles = await client.candles(
  { symbol: 'ETHBTC' },
  agent // here our agent object go as last param
);
```

Note too the proxy forwarding only work from nodejs!
Don't expect it to work in the browser!

As the browser platform have no support for proxy usages!
If you want to use proxy! You've got to pass through your own server to do that for you!

Because we may not know that! And expect it! And then wast time!
