const Binance = require('../../../dist/index').default;

const client = Binance();

client.ws.aggTrades(['BTCUSDT', 'ETHBTC'], (trade) => {
    console.log(trade);
});