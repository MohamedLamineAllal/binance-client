const Binance = require('../../../dist/index').default;

const client = Binance();

(async () => {
    const trades = await client.aggTrades({symbol: 'BTCUSDT'});
    console.log(trades);
})();