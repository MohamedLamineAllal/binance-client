const Binance = require('../../../dist/index').default;

const client = Binance();

client.ws.trades('BTCUSDT', (trade) => {
    console.log(trade);
});