const { ProxyServer } = require('net-proxy');

const proxyServer = new ProxyServer({
    port: 8123
});

proxyServer.awaitStartedListening()
    .then(() => {
        console.log(`Server listening on port ${proxyServer.port}`);
    })
    .catch(() => {
        console.log('FAILED TO LISTEN ::: !!!!!');
    })
