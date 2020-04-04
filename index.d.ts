// tslint:disable:interface-name
declare module 'binance-client' {
    export default function (options?: { apiKey: string; apiSecret: string, getTime?: () => number | Promise<number> }): Binance;

    export enum ErrorCodes {
        UNKNOWN = -1000,
        DISCONNECTED = -1001,
        UNAUTHORIZED = -1002,
        TOO_MANY_REQUESTS = -1003,
        UNEXPECTED_RESP = -1006,
        TIMEOUT = -1007,
        INVALID_MESSAGE = -1013,
        UNKNOWN_ORDER_COMPOSITION = -1014,
        TOO_MANY_ORDERS = -1015,
        SERVICE_SHUTTING_DOWN = -1016,
        UNSUPPORTED_OPERATION = -1020,
        INVALID_TIMESTAMP = -1021,
        INVALID_SIGNATURE = -1022,
        ILLEGAL_CHARS = -1100,
        TOO_MANY_PARAMETERS = -1101,
        MANDATORY_PARAM_EMPTY_OR_MALFORMED = -1102,
        UNKNOWN_PARAM = -1103,
        UNREAD_PARAMETERS = -1104,
        PARAM_EMPTY = -1105,
        PARAM_NOT_REQUIRED = -1106,
        NO_DEPTH = -1112,
        TIF_NOT_REQUIRED = -1114,
        INVALID_TIF = -1115,
        INVALID_ORDER_TYPE = -1116,
        INVALID_SIDE = -1117,
        EMPTY_NEW_CL_ORD_ID = -1118,
        EMPTY_ORG_CL_ORD_ID = -1119,
        BAD_INTERVAL = -1120,
        BAD_SYMBOL = -1121,
        INVALID_LISTEN_KEY = -1125,
        MORE_THAN_XX_HOURS = -1127,
        OPTIONAL_PARAMS_BAD_COMBO = -1128,
        INVALID_PARAMETER = -1130,
        BAD_API_ID = -2008,
        DUPLICATE_API_KEY_DESC = -2009,
        INSUFFICIENT_BALANCE = -2010,
        CANCEL_ALL_FAIL = -2012,
        NO_SUCH_ORDER = -2013,
        BAD_API_KEY_FMT = -2014,
        REJECTED_MBX_KEY = -2015,
    }

    export interface Account {
        balances: AssetBalance[];
        buyerCommission: number;
        canDeposit: boolean;
        canTrade: boolean;
        canWithdraw: boolean;
        makerCommission: number;
        sellerCommission: number;
        takerCommission: number;
        updateTime: number;
    }
    export interface TradeFee {
        symbol: string;
        maker: number;
        taker: number;
    }
    export interface TradeFeeResult {
        tradeFee: TradeFee[]
        success: boolean
    }
    export interface AggregatedTrade {
        aggId: number;
        price: string;
        quantity: string;
        firstId: number;
        lastId: number;
        time: number;
        isBuyerMaker: boolean;
    }

    export type FAggregatedTrade = AggregatedTrade;

    interface Trade {
        id: number,
        price: string,
        quantity: string,
        quoteQty: string,
        time: number,
        isBuyerMaker: boolean,
        isBestMatch: boolean // TODO: verify
    }

    interface FTrade {
        id: number,
        price: string,
        quantity: string,
        quoteQty: string,
        time: number,
        isBuyerMaker: boolean
    } 

    export interface FMarkPrice {
        symbol: string,
        markPrice: string,
        lastFundingRate: string
        nextFundingTime: number,
        time: number
    }

    export interface FFundingRate {
        symbol: string,
        fundingRate: string,
        fundingTime: number,
        time: number
    }

    interface FDailyState {
        symbol: string,
        priceChange: string,
        priceChangePercent: string,
        weightedAvgPrice: string,
        prevClosePrice: string,
        lastPrice: string,
        lastQty: string,
        openPrice: string,
        highPrice: string,
        lowPrice: string,
        volume: string,
        quoteVolume: string,
        openTime: number,
        closeTime: number,
        firstId: number,   // First tradeId
        lastId: number,    // Last tradeId
        count: number 
    }

    interface FPrice {
        symbol: string,
        price: string
    }

    interface FReducedPrice {
        [symbol: string]: FPrice
    }

    interface FBookTicker {
        symbol: string,
        bidPrice: string,
        bidQty: string,
        askPrice: string,
        askQty: string
    }

    interface FReducedBookTicker {
        [symbol: string]: FBookTicker
    }

    interface FForceOrder {
        symbol: string, // SYMBOL
        price: string, // ORDER_PRICE
        origQty: string, // ORDER_AMOUNT
        executedQty: string, // FILLED_AMOUNT
        averagePrice: string, // AVG_PRICE
        status: FOrderStatus,                 
        timeInForce: FTimeInForce,               
        type: FOrderType,
        side: FOrderSide,
        time: number 
    }

    interface FOpenInterest {
        symbol: string,
        openInterest: string
    }

    interface FLeverageBrackets {
        symbol: string,
        brackets: FLeverageBracket[]
    }

    interface FLeverageBracket {
        bracket: number,
        initialLeverage: number,  // Max initial leverage for this bracket
        notionalCap: number,  // Cap notional of this bracket
        notionalFloor: number,  // Notionl threshold of this bracket 
        maintMarginRatio: number // Maintenance ratio for this bracket
    }

    interface FReducedLeverageBrackets {
        [symbol: string]: FLeverageBracket[]
    }

    interface FAccountTransfer {
        tranId: number
    }

    interface FAccountHistoryTransfer {
        asset: string,
        tranId: number,
        amount: string,
        type: string,
        timestamp: number,
        status: string
    }

    interface FAccountTransferHistory {
        rows: FAccountHistoryTransfer[],
        total: number
    }

    export interface AssetBalance {
        asset: string;
        free: string;
        locked: string;
    }

    export interface DepositAddress {
        address: string,
        addressTag: string,
        asset: string,
        success: boolean,
    }

    export interface WithrawResponse {
        id: string;
        msg: string;
        success: boolean;
    }

    export enum DepositStatus {
        PENDING = 0,
        SUCCESS = 1,
    }

    export interface DepositHistoryResponse {
        depositList:
        {
            insertTime: number,
            amount: number;
            asset: string;
            address: string;
            txId: string;
            status: DepositStatus;
        }[];
        success: boolean,
    }

    export enum WithdrawStatus {
        EMAIL_SENT = 0,
        CANCELLED = 1,
        AWAITING_APPROVAL = 2,
        REJECTED = 3,
        PROCESSING = 4,
        FAILURE = 5,
        COMPLETED = 6,
    }

    export interface WithdrawHistoryResponse {
        withdrawList:
        {
            id: string;
            amount: number;
            address: string;
            asset: string;
            txId: string;
            applyTime: number;
            status: WithdrawStatus;
        }[];
        success: boolean,
    }

    export interface AssetDetail {
        success: boolean,
        assetDetail: {
            [asset: string]: {
                minWithdrawAmount: string;
                depositStatus: boolean;
                withdrawFee: number;
                withdrawStatus: boolean;
                depositTip: string;
            }
        }
    }

    export interface Binance {
        // ________________________________________ Binance
        accountInfo(options?: { useServerTime: boolean }): Promise<Account>;
        tradeFee(): Promise<TradeFeeResult>;
        trades(options: { symbol: string, limit?: number }): Promise<Trade[]>;
        aggTrades(options?: { symbol: string, fromId?: string, startTime?: number, endTime?: number, limit?: number }): Promise<AggregatedTrade[]>;
        allBookTickers(): Promise<{ [key: string]: Ticker }>;
        book(options: { symbol: string, limit?: number }): Promise<OrderBook>;
        exchangeInfo(): Promise<ExchangeInfo>;
        order(options: NewOrder): Promise<Order>;
        orderTest(options: NewOrder): Promise<Order>;
        ping(): Promise<boolean>;
        prices(): Promise<{ [index: string]: string }>;
        avgPrice(options?: { symbol: string }): Promise<AvgPriceResult | AvgPriceResult[]>;
        time(): Promise<number>;
        ws: WebSocket;
        fws: FuturesWebSocket;
        myTrades(options: { symbol: string, limit?: number, fromId?: number, useServerTime?: boolean }): Promise<MyTrade[]>;
        getOrder(options: { symbol: string, orderId: number, origClientOrderId?: string, recvWindow?: number, useServerTime?: boolean }): Promise<QueryOrderResult>;
        cancelOrder(options: { symbol: string; orderId: number, origClientOrderId?: string, newClientOrderId?: string, recvWindow?: number, useServerTime?: boolean }): Promise<CancelOrderResult>;
        openOrders(options: { symbol?: string, recvWindow?: number, useServerTime?: boolean }): Promise<QueryOrderResult[]>;
        allOrders(options: { symbol?: string, orderId?: number, limit?: number, recvWindow?: number, useServerTime?: boolean }): Promise<QueryOrderResult[]>;
        dailyStats(options?: { symbol: string }): Promise<DailyStatsResult | DailyStatsResult[]>;
        candles(options: CandlesOptions): Promise<CandleChartResult[]>;
        tradesHistory(options: { symbol: string, limit?: number, fromId?: number }): Promise<Trade[]>;
        depositAddress(options: { asset: string }): Promise<DepositAddress>;
        withdraw(options: { asset: string, address: string, amount: number; name?: string }): Promise<WithrawResponse>;
        assetDetail(): Promise<AssetDetail>;
        withdrawHistory(options: { asset: string, status?: number, startTime?: number, endTime?: number }): Promise<WithdrawHistoryResponse>;
        depositHistory(options: { asset: string, status?: number, startTime?: number, endTime?: number }): Promise<DepositHistoryResponse>;

        // _____________________________________ Binance futures
        futuresPing: () => Promise<true>;
        futuresTime: () => Promise<number>;
        futuresExchangeInfo: () => Promise<FExchangeInfo>;
        futuresBook: (payload: { symbol: string, limit?: number }) => Promise<FOrderBook>;
        futuresTrades: (payload: { symbol: string, limit?: number }) => Promise<FTrade[]>;
        futuresTradesHistory: (payload: { symbol: string, limit?: number, fromId?: number }) => Promise<FTrade[]>;
        futuresAggTrades: (payload: { symbol: string, fromId?: string, startTime?: number, endTime?: number, limit?: number }) => Promise<FAggregatedTrade[]>;
        futuresCandles: (payload: FCandlesOptions) => Promise<FCandleChartResult>;
        // ______________ futures exclusive
        futuresMarkPrice: (payload: { symbol?: string }) => Promise<FMarkPrice>;
        futuresFundingRate: (payload: { symbol?: string, startTime?: number, endTime?: number, limit?: number }) => Promise<FFundingRate>;
        futuresDailyStats: (payload: { symbol?: string }) => Promise<FDailyState>;
        futuresPrice: (payload: { symbol?: string, reduce?: boolean }) => Promise<FPrice | FPrice[] | FReducedPrice>;
        // TODO: Verify that adding reduce to the payload doesn't pose a problem
        // futuresAvgPrice: (payload: { symbol?: string }) => Promise<FMarkPrice>;
        futuresBookTicker: (payload: { symbol?: string, reduce?: boolean }) => Promise<FBookTicker | FBookTicker[] | FReducedBookTicker>;
        futuresAllForceOrders: (payload: { symbol?: string, startTime?: number, endTime?: number, limit?: number }) => Promise<FForceOrder | FForceOrder[]>;
        futuresOpenInterest: (payload: { symbol: string }) => Promise<FOpenInterest>;
        futuresLeverageBracket: (payload: { symbol?: string }) => Promise<FLeverageBrackets | FLeverageBrackets[] | FReducedLeverageBrackets>;
        futuresAccountTransfer: (payload: { asset: string, amount: number, type: number, recvWindow?: number }) => Promise<FAccountTransfer>;
        futuresAccountTransactionHistory: (payload: { asset: string, startTime: number, endTime?: number, current?: number, size?: number, recvWindow?: number }) => Promise<FAccountTransferHistory>;
        futuresOrder: (payload: FNewOrder) => Promise<FOrder>;
        futuresOrderTest: (payload: { symbol?: string }) => Promise<FMarkPrice>;
        futuresGetOrder: (payload: { symbol: string, orderId?: number, origClientOrderId?: string, recvWindow?: number }) => Promise<FOrderState>;
        futuresCancelOrder: (payload: { symbol: string, orderId?: number, origClientOrderId?: string, recvWindow?: number }) => Promise<FOrder>;
        futuresCancelAllOpenOrders: (payload: { symbol: string, recvWindow?: number }) => Promise<FCancelAllOrderResp>;
        futuresCancelMultipleOrders: (payload: { symbol: string, orderIdList?: number[], origClientOrderIdList?: number[], recvWindow?: number }) => Promise<(FOrder | FCancelAllOrderResp)[]>;
        futuresGetOpenOrder: (payload: { symbol: string, orderId?: number, origClientOrderId?: string, recvWindow?: number}) => Promise<FOrderState>;
        futuresGetAllOpenOrders: (payload: { symbol: string, recvWindow?: number }) => Promise<FOrderState[]>;
        futuresGetAllOrders: (payload: { symbol: string, orderId?: number, startTime?: number, endTime?: number, limit?: number, recvWindow?: number }) => Promise<FOrderState[]>;
        futuresAccountBalance: (payload: { recvWindow?: number }) => Promise<FAccountBalance[]>;
        futuresAccountInfo: (payload: { recvWindow?: number }) => Promise<FAccountInfo>;
        futuresChangeLeverage: (payload: { symbol: string, leverage: number, recvWindow?: number }) => Promise<FLeverageChangeResp>;
        futuresChangeMarginType: (payload: { symbol: string, marginType: FMarginType, recvWindow?: number }) => Promise<CodeMsgResp>;
        futuresModifyPositionMargin: (payload: { symbol: string, amount: number, type: number, recvWindow?: number }) => Promise<FModifyPositionMarginResp>;
        futuresPositionMarginHistory: (payload: { symbol: string, type?: number, startTime?: number, endTime?: number, limit?: number, recvWindow?: number }) => Promise<FPositionMargin[]>;
        futuresPositionRisk: (payload: { recvWindow?: number }) => Promise<FPositionRisk[]>;
        futuresUserTrades: (payload: { symbol: string, startTime?: number, endTime?: number, fromId?: number, limit?: number, recvWindow?: number }) => Promise<FUserTrade[]>;
        futuresIncomeHistory: (payload: { symbol?: string, incomeType?: FIncomeType, startTime?: number, endTime?: number, limit?: number, revWindow?: number }) => Promise<FIncome[]>;
    }

    export interface HttpError extends Error {
        code: number | string;
        message: string;
    }

    export interface WebSocket {
        depth: (symbol: string | string[], callback: (depth: Depth) => void) => ReconnectingWebSocketHandler;
        partialDepth: (options: { symbol: string, level: number } | { symbol: string, level: number }[], callback: (depth: PartialDepth) => void) => ReconnectingWebSocketHandler;
        ticker: (symbol: string | string[], callback: (ticker: Ticker) => void) => ReconnectingWebSocketHandler;
        allTickers: (callback: (tickers: Ticker[]) => void) => ReconnectingWebSocketHandler;
        candles: (symbol: string | string[], interval: string, callback: (ticker: Candle) => void) => ReconnectingWebSocketHandler;
        trades: (symbols: string | string[], callback: (trade: WsTrade) => void) => ReconnectingWebSocketHandler;
        aggTrades: (symbols: string | string[], callback: (trade: WsAggregatedTrade) => void) => ReconnectingWebSocketHandler;
        user: (callback: (msg: OutboundAccountInfo | ExecutionReport) => void) => ReconnectingWebSocketHandler;
    }

    export interface FuturesWebSocket {
        depth: (payload: { symbol: string, speed?: string }, callback: (depth: FWsDepth) => void) => ReconnectingWebSocketHandler;
        partialDepth: (payload: { symbol: string, speed?: string, level?: number }, callback: (depth: FWsPartialDepth) => void) => ReconnectingWebSocketHandler;
        markPrice: (payload: { symbol: string, speed?: string }, callback: (markPrice: MarkPrice) => void) => ReconnectingWebSocketHandler;
        markPriceAll: (payload: { speed?: string, reduce?: boolean }, callback: (markPrices: MarkPrice[] | ReducedMarkPrice) => void) => ReconnectingWebSocketHandler;
        candles: (symbol: string, interval: string, callback: (candle: FWsCandle) => void) => ReconnectingWebSocketHandler;
        trades: (symbols: string, callback: (trade: FWsTrade) => void) => ReconnectingWebSocketHandler;
        aggTrades: (symbols: string, callback: (trade: FWsAggregatedTrade) => void) => ReconnectingWebSocketHandler;
        ticker: (symbol: string | string[], callback: (ticker: FWsTicker) => void) => ReconnectingWebSocketHandler;
        miniTicker: (symbol: string, callback: (miniTicker: FWsMiniTicker) => void) => ReconnectingWebSocketHandler;
        allMiniTickers: (callback: (miniTickers: FWsMiniTicker[]) => void) => ReconnectingWebSocketHandler;
        allTickers: (callback: (tickers: FWsTicker[]) => void) => ReconnectingWebSocketHandler;
        bookTicker: (symbol: string, callback: (bookTicker: FWsBookTicker) => void) => ReconnectingWebSocketHandler;
        allBookTicker: (callback: (bookTickers: FWsBookTicker[]) => void) => ReconnectingWebSocketHandler;
        liquidationOrder: (symbol: string, callback: (liquidationOrder: FWsLiquidationOrder) => void) => ReconnectingWebSocketHandler;
        allLiquidationOrder: (callback: (liquidationOrders: FWsLiquidationOrder[]) => void) => ReconnectingWebSocketHandler;
        user: (callback: (msg: OutboundAccountInfo | ExecutionReport) => void) => ReconnectingWebSocketHandler;
        multiStreams: FMultiStreamsFactory
    }

    export type ReconnectingWebSocketHandler = (options?: {keepClosed: boolean, fastClose: boolean, delay: number}) => void

    export enum CandleChartInterval {
        ONE_MINUTE = '1m',
        THREE_MINUTES = '3m',
        FIVE_MINUTES = '5m',
        FIFTEEN_MINUTES = '15m',
        THIRTY_MINUTES = '30m',
        ONE_HOUR = '1h',
        TWO_HOURS = '2h',
        FOUR_HOURS = '4h',
        SIX_HOURS = '6h',
        EIGHT_HOURS = '8h',
        TWELVE_HOURS = '12h',
        ONE_DAY = '1d',
        THREE_DAYS = '3d',
        ONE_WEEK = '1w',
        ONE_MONTH = '1M'
    }

    export type FCandleChartInterval = CandleChartInterval;

    export type RateLimitType =
        | 'REQUEST_WEIGHT'
        | 'ORDERS';

    export type FRateLimitType = RateLimitType;

    export type RateLimitInterval =
        | 'SECOND'
        | 'MINUTE'
        | 'DAY';
    
    export type FRateLimitInterval = RateLimitInterval;

    export interface ExchangeInfoRateLimit {
        rateLimitType: RateLimitType;
        interval: RateLimitInterval;
        intervalNum: number;
        limit: number;
    }

    export interface FExchangeInfoRateLimit {
        rateLimitType: FRateLimitType;
        interval: FRateLimitInterval;
        intervalNum: number;
        limit: number;
    }

    export type ExchangeFilterType =
        | 'EXCHANGE_MAX_NUM_ORDERS'
        | 'EXCHANGE_MAX_ALGO_ORDERS';

    export interface ExchangeFilter {
        filterType: ExchangeFilterType;
        limit: number;
    }

    export type SymbolFilterType =
        | 'PRICE_FILTER'
        | 'PERCENT_PRICE'
        | 'LOT_SIZE'
        | 'MIN_NOTIONAL'
        | 'MAX_NUM_ORDERS'
        | 'MAX_ALGO_ORDERS';

    export interface SymbolPriceFilter {
        filterType: SymbolFilterType,
        minPrice: string;
        maxPrice: string;
        tickSize: string;
    }

    export interface SymbolPercentPriceFilter {
        filterType: SymbolFilterType,
        multiplierDown: string;
        multiplierUp: string;
        avgPriceMins: number;
    }

    export interface SymbolLotSizeFilter {
        filterType: SymbolFilterType,
        minQty: string;
        maxQty: string;
        stepSize: string;
    }

    export interface SymbolMinNotionalFilter {
        applyToMarket: boolean;
        avgPriceMins: number;
        filterType: SymbolFilterType;
        minNotional: string;
    }

    export interface SymbolMaxNumOrdersFilter {
        filterType: SymbolFilterType;
        limit: number;
    }

    export interface SymbolMaxAlgoOrdersFilter {
        filterType: SymbolFilterType;
        limit: number;
    }

    export type SymbolFilter =
        | SymbolPriceFilter
        | SymbolPercentPriceFilter
        | SymbolLotSizeFilter
        | SymbolMinNotionalFilter
        | SymbolMaxNumOrdersFilter
        | SymbolMaxAlgoOrdersFilter;

    export type FSymbolFilter = SymbolFilter;

    export interface Symbol {
        symbol: string;
        status: string;
        baseAsset: string;
        baseAssetPrecision: number;
        quoteAsset: string;
        quotePrecision: number;
        orderTypes: OrderType[];
        icebergAllowed: boolean;
        filters: SymbolFilter[];
    }

    export interface FSymbol {
        filters: FSymbolFilter,
        maintMarginPercent: string,
        pricePrecision: number,
        quantityPrecision: number,
        requiredMarginPercent: string,
        status: string,
        OrderType: FOrderType,
        symbol: string,
        timeInForce: FTimeInForce
    }

    export interface ExchangeInfo {
        timezone: string;
        serverTime: number;
        rateLimits: ExchangeInfoRateLimit[];
        exchangeFilters: ExchangeFilter[];
        symbols: Symbol[];
    }

    export interface FExchangeInfo {
        timezone: string;
        serverTime: number;
        rateLimits: FExchangeInfoRateLimit[];
        exchangeFilters: FExchangeFilter[];
        symbols: FSymbol[];
    }

    export interface OrderBook {
        lastUpdateId: number;
        asks: Bid[];
        bids: Bid[];
    }

    export type FOrderBook = OrderBook;

    export interface NewOrder {
        icebergQty?: string;
        newClientOrderId?: string;
        price?: string;
        quantity: string;
        recvWindow?: number;
        side: OrderSide;
        stopPrice?: string;
        symbol: string;
        timeInForce?: TimeInForce;
        useServerTime?: boolean;
        type: OrderType;
        newOrderRespType?: NewOrderRespType;
    }

    interface OrderFill {
        price: string;
        quantity: string;
        commission: string;
        commissionAsset: string;
    }

    interface Order {
        clientOrderId: string;
        executedQty: string;
        icebergQty?: string;
        orderId: number;
        origQty: string;
        price: string;
        side: OrderSide;
        status: OrderStatus;
        stopPrice?: string;
        symbol: string;
        timeInForce: TimeInForce;
        transactTime: number;
        type: OrderType;
        fills?: OrderFill[];
    }

    interface FOrder {
        clientOrderId: string;
        executedQty: string;
        orderId: number;
        origQty: string;
        price: string;
        reduceOnly: boolean;
        side: FOrderSide;
        status: FOrderStatus;
        stopPrice?: string;
        symbol: string;
        timeInForce: FTimeInForce;
        type: FOrderType;
        activatePrice: string,
        priceRate: string,
        updateTime: number,
        workingType: FOrderWorkingType;
    }

    export interface FNewOrder {
        symbol: string,
        side: FOrderSide,
        type: FOrderType,
        timeInForce?: FTimeInForce,
        quantity: number,
        reduceOnly?: "true" | "false",
        price?: number,
        newClientOrderId?: string,
        stopPrice?: number,
        activationPrice?: number,
        callbackRate?: number,
        workingType?: FOrderWorkingType,
        recvWindow?: number
    }

    export interface FOrderState {
        avgPrice: string,
        clientOrderId: string;
        executedQty: string;
        orderId: number;
        origQty: string;
        origType: FOrderType,
        price: string;
        reduceOnly: boolean;
        side: FOrderSide;
        status: FOrderStatus;
        stopPrice?: string;
        symbol: string;
        time: number,
        timeInForce: FTimeInForce;
        type: FOrderType;
        activatePrice: string,
        priceRate: string,
        updateTime: number,
        workingType: FOrderWorkingType;
    }

    interface FCancelAllOrderResp {
        code: string,
        msg: string
    }

    interface FAccountBalance {
        accountAlias: string, // unique account code
        asset: string,
        balance: string,
        withdrawAvailable: string
    }

    interface FAccountInfo {
        "assets": FAssetAccountInfo[],
        canDeposit: boolean,
        canTrade: boolean,
        canWithdraw: boolean,
        feeTier: number,
        maxWithdrawAmount: string,
        positions: FPositionAccountInfo[],
        totalInitialMargin: string,
        totalMaintMargin: string,
        totalMarginBalance: string,
        totalOpenOrderInitialMargin: string,
        totalPositionInitialMargin: string,
        totalUnrealizedProfit: string,
        totalWalletBalance: string,
        updateTime: number
    }

    interface FAssetAccountInfo {
        asset: string,
        initialMargin: string,
        maintMargin: string,
        marginBalance: string,
        maxWithdrawAmount: string,
        openOrderInitialMargin: string,
        positionInitialMargin: string,
        unrealizedProfit: string,
        walletBalance: string
    }

    interface FPositionAccountInfo {
        isolated: boolean, 
        leverage: string,
        initialMargin: string,
        maintMargin: string,
        openOrderInitialMargin: string,
        positionInitialMargin: string,
        symbol: string,
        unrealizedProfit: string
    }

    export interface FLeverageChangeResp {
        leverage: number,
        maxNotionalValue: string,
        symbol: string
    }

    export interface CodeMsgResp {
        code: string,
        msg: string
    }

    export type FMarginType =
        | 'ISOLATED'
        | 'CROSSED';

    export interface FModifyPositionMarginResp {
        amount: number,
        code: number,
        msg: string,
        type: number
    }

    export interface FPositionMargin {
        amount: string,
        asset: string,
        symbol: string,
        time: number,
        type: number
    }

    export interface FPositionRisk {
        entryPrice: string,
        marginType: string,       
        isAutoAddMargin: string,     
        isolatedMargin: string, 
        leverage: string,         // current initial leverage
        liquidationPrice: string,
        markPrice: string,
        maxNotionalValue: string, // notional value limit of current initial leverage
        positionAmt: string,      // Positive for long, negative for short
        symbol: string,
        unRealizedProfit: string
    }

    export interface FUserTrade {
        buyer: boolean,
        commission: string,
        commissionAsset: string,
        id: number,
        maker: boolean,
        orderId: number,
        price: string,
        qty: string,
        quoteQty: string,
        realizedPnl: string,
        side: string,
        symbol: string,
        time: number
    }

    interface FIncome {
        symbol: string,
        incomeType: string,
        income: string,
        asset: string,
        info: string,
        time: number
    }

    type FIncomeType =
        | 'TRANSFER'
        | 'WELCOME_BONUS'
        | 'REALIZED_PNL'
        | 'FUNDING_FEE'
        | 'COMMISSION'
        | 'INSURANCE_CLEAR';


    export type OrderSide = 'BUY' | 'SELL';
    export type FOrderSide = OrderSide;

    export type OrderStatus =
        | 'CANCELED'
        | 'EXPIRED'
        | 'FILLED'
        | 'NEW'
        | 'PARTIALLY_FILLED'
        | 'PENDING_CANCEL'
        | 'REJECTED';

    export type FOrderStatus =
        | 'NEW'
        | 'PARTIALLY_FILLED'
        | 'FILLED'
        | 'CANCELED'
        | 'REJECTED'
        | 'EXPIRED';

    export type OrderType =
        | 'LIMIT'
        | 'LIMIT_MAKER'
        | 'MARKET'
        | 'STOP_LOSS'
        | 'STOP_LOSS_LIMIT'
        | 'TAKE_PROFIT'
        | 'TAKE_PROFIT_LIMIT';

    export type FOrderType =
        | 'LIMIT'
        | 'MARKET'
        | 'STOP'
        | 'STOP_MARKET'
        | 'TAKE_PROFIT'
        | 'TAKE_PROFIT_MARKET'
        | 'TRAILING_STOP_MARKET';

    export type FOrderWorkingType =
        | 'MARK_PRICE'
        | 'CONTRACT_PRICE';

    export type NewOrderRespType = 'ACK' | 'RESULT' | 'FULL';

    export type TimeInForce = 'GTC' | 'IOC' | 'FOK';
    export type FTimeInForce = 'GTC' | 'IOC' | 'FOK' | 'GTX';

    export type ExecutionType =
        | 'NEW'
        | 'CANCELED'
        | 'REPLACED'
        | 'REJECTED'
        | 'TRADE'
        | 'EXPIRED';

    export type EventType =
        | 'executionReport'
        | 'account';

    interface Depth {
        eventType: string;
        eventTime: number;
        symbol: string;
        firstUpdateId: number;
        finalUpdateId: number;
        bidDepth: BidDepth[];
        askDepth: BidDepth[];
    }

    interface FWsDepth {
        eventType: string;
        eventTime: number;
        symbol: string;
        firstUpdateId: number;
        finalUpdateId: number;
        transactionTime: number,
        lastUpdateIdInLastStream: number,
        bidDepth: BidDepth[];
        askDepth: BidDepth[];
    }

    interface BidDepth {
        price: string;
        quantity: string;
    }

    interface PartialDepth {
        symbol: string;
        level: number;
        bids: Bid[];
        asks: Bid[];
    }

    interface FWsPartialDepth {
        eventType: string,
        eventTime: number,
        symbol: string,
        firstUpdateId: number,
        finalUpdateId: number,
        transactionTime: number,
        lastUpdateIdInLastStream: number,
        bidDepth: BidDepth[]
        askDepth: BidDepth[]
    }

    interface MarkPrice {
        eventType: string,
        eventTime: number,
        symbol: string,
        markPrice: string,
        fundingRate: string,
        nextFundingTime: number
    }

    interface ReducedMarkPrice {
        [symbol: string]: MarkPrice
    }

    interface Bid {
        price: string;
        quantity: string;
    }

    interface Ticker {
        eventType: string;
        eventTime: number;
        symbol: string;
        priceChange: string;
        priceChangePercent: string;
        weightedAvg: string;
        prevDayClose: string;
        curDayClose: string;
        closeTradeQuantity: string;
        bestBid: string;
        bestBidQnt: string;
        bestAsk: string;
        bestAskQnt: string;
        open: string;
        high: string;
        low: string;
        volume: string;
        volumeQuote: string;
        openTime: number;
        closeTime: number;
        firstTradeId: number;
        lastTradeId: number;
        totalTrades: number;
    }

    interface FWsTicker {
        eventType: string;
        eventTime: number;
        symbol: string;
        priceChange: string;
        priceChangePercent: string;
        weightedAvgPrice: string;
        lastPrice: string,
        lastQuantity: string,    
        open: string;
        high: string;
        low: string;
        volume: string;
        volumeQuote: string;
        openTime: number;
        closeTime: number;
        firstTradeId: number;
        lastTradeId: number;
        totalTrades: number;
    }  

    interface FWsMiniTicker {
        eventType: number,
        eventTime: number,
        symbol: string,
        close: string,
        open: string,
        high: string,
        low: string,
        volume: string,
        quoteVolume: string
    }

    interface FWsBookTicker {
        updateId: number
        bestBidPrice: string,
        bestBidQty: string,
        bestAskPrice: string,
        bestAskQty: string
    }

    interface Candle {
        eventType: string;
        eventTime: number;
        symbol: string;
        startTime: number;
        closeTime: number;
        firstTradeId: number;
        lastTradeId: number;
        open: string;
        high: string;
        low: string;
        close: string;
        volume: string;
        trades: number;
        interval: string;
        isFinal: boolean;
        quoteAssetVolume: string,
        buyAssetVolume: string,
        quoteBuyAssetVolume: string
    }

    type FWsCandle = Candle;

    interface FWsLiquidationOrder {
        eventType: string,
        eventTime: number,
        order: FLiquidationOrderObj
    }

    interface FLiquidationOrderObj {
        symbol: string,
        side: string,
        orderType: string,
        timeInForce: string,
        quantity: string,
        averagePrice: string,
        status: string,
        lastFilledQuantity: string,
        filledAccumulatedQuantity: string,
        tradeTime: number
    }


    interface Message {
        eventType: EventType;
        eventTime: number;
    }

    interface Balances {
        [key: string]: {
            available: string;
            locked: string;
        };
    }

    interface OutboundAccountInfo extends Message {
        balances: Balances;
        makerCommissionRate: number;
        takerCommissionRate: number;
        buyerCommissionRate: number;
        sellerCommissionRate: number;
        canTrade: boolean;
        canWithdraw: boolean;
        canDeposit: boolean;
        lastAccountUpdate: number;ExecutionReport
    }

    interface ExecutionReport extends Message {
        symbol: string;
        newClientOrderId: string;
        originalClientOrderId: string;
        side: OrderSide;
        orderType: OrderType;
        timeInForce: TimeInForce;
        quantity: string;
        price: string;
        executionType: ExecutionType;
        stopPrice: string;
        icebergQuantity: string;
        orderStatus: OrderStatus;
        orderRejectReason: string;
        orderId: number;
        orderTime: number;
        lastTradeQuantity: string;
        totalTradeQuantity: string;
        priceLastTrade: string;
        commission: string;
        commissionAsset: string;
        tradeId: number;
        isOrderWorking: boolean;
        isBuyerMaker: boolean;
    }

    export interface TradeResult {
        id: number;
        price: string;
        quantity: string;
        time: number;
        isBuyerMaker: boolean;
        isBestMatch: boolean;
    }

    

    interface MyTrade {
        id: number;
        orderId: number;
        orderListId: number;
        price: string;
        quantity: string;
        quoteQty: string;
        commission: string;
        commissionAsset: string;
        time: number;
        isBuyer: boolean;
        isMaker: boolean;
        isBestMatch: boolean;
    }

    interface QueryOrderResult {
        clientOrderId: string;
        cummulativeQuoteQty: string,
        executedQty: string;
        icebergQty: string;
        isWorking: boolean;
        orderId: number;
        origQty: string;
        price: string;
        side: OrderSide;
        status: OrderStatus;
        stopPrice: string;
        symbol: string;
        time: number;
        timeInForce: TimeInForce;
        type: string;
        updateTime: number;
    }

    interface CancelOrderResult {
        symbol: string;
        origClientOrderId: string;
        orderId: number;
        clientOrderId: string;
    }

    export interface AvgPriceResult {
        mins: number;
        price: string;
    }

    export interface DailyStatsResult {
        symbol: string;
        priceChange: string;
        priceChangePercent: string;
        weightedAvgPrice: string;
        prevClosePrice: string;
        lastPrice: string;
        lastQty: string;
        bidPrice: string;
        bidQty: string;
        askPrice: string;
        askQty: string;
        openPrice: string;
        highPrice: string;
        lowPrice: string;
        volume: string;
        quoteVolume: string;
        openTime: number;
        closeTime: number;
        firstId: number; // First tradeId
        lastId: number; // Last tradeId
        count: number; // Trade count
    }

    export interface CandlesOptions {
        symbol: string;
        interval: CandleChartInterval;
        limit?: number;
        startTime?: number;
        endTime?: number;
    }

    export interface FCandlesOptions {
        symbol: string;
        interval: FCandleChartInterval;
        limit?: number;
        startTime?: number;
        endTime?: number;
    };

    export interface CandleChartResult {
        openTime: number;
        open: string;
        high: string;
        low: string;
        close: string;
        volume: string;
        closeTime: number;
        quoteVolume: string;
        trades: number;
        buyBaseAssetVolume: string;
        buyQuoteAssetVolume: string;
    }

    export type FCandleChartResult = CandleChartResult;

    interface WsTrade {
        eventType: string;
        eventTime: number;
        symbol: string;
        tradeId: number;
        price: string;
        quantity: string;
        // buyerOrderId: number;
        // sellerOrderId: number; // TODO: check if exists
        tradeTime: number;
        isBuyerMaker: boolean;
        isBestMatch: boolean;
    }

    interface FWsTrade {
        eventType: string;
        eventTime: number;
        symbol: string;
        tradeId: number;
        price: string;
        quantity: string;
        tradeTime: number;
        isBuyerMaker: boolean;
    }; 

    interface WsAggregatedTrade {
        eventType: string;
        eventTime: number;
        symbol: string;
        aggId: number;
        price: string;
        quantity: string;
        firstTradeId: number;
        lastTradeId: number;
        tradeTime: number;
        isBuyerMaker: boolean;
        isBestMatch: boolean; // TODO: check (remove)
    }

    interface FWsAggregatedTrade {
        eventType: string;
        eventTime: number;
        symbol: string;
        aggId: number;
        price: string;
        quantity: string;
        firstTradeId: number;
        lastTradeId: number;
        tradeTime: number;
        isBuyerMaker: boolean;
    }

    type FMultiStreamsFactory = (
        symbolMethodObj: FMS_SymbolMethodObj | FMS_SymbolMethodObj[],
        callback: (data: any) => void // TODO: data type
    ) => FMultiStreamManager

    interface FMS_SymbolMethodObj {
        symbol: string,
        endPoint: string
    }

    interface FMultiStreamManager {
        ws: any // TODO: type
        subscribe: (symbolMethodObj: FMS_SymbolMethodObj | FMS_SymbolMethodObj[]) => void,
        unsubscribe: (symbolMethodObj: FMS_SymbolMethodObj | FMS_SymbolMethodObj[]) => void,
        close: ReconnectingWebSocketHandler
    }
}