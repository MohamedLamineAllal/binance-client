const net = require('net');

// ____________________ Class constructor
function ProxyServer({
    port
}) {
    this.port = port;

    this.serverListeningPromiseFiber = {};
    this.serverListeningPromiseFiber.promise = new Promise((resolve, reject) => {
        this.serverListeningPromiseFiber.resolve = resolve;
        this.serverListeningPromiseFiber.reject = reject;
    });

    this.server = createProxyServer.call(this, { port });
}

// _____________________ prototypes methods (public)
((p) => {
    p.awaitStartedListening = function () {
        return this.serverListeningPromiseFiber.promise;
    } 
})(ProxyServer.prototype);

// _____________________ private methods
function createProxyServer({
    port = 8000
}) {
    try {
        const server = net.createServer();
        
        server.on ('connection', onConnection.bind(this));
    
        server.on('error', (err) => {
            console.log('SERVER ERROR');
            console.log(err);
        });
        
        server.on('close', () => {
            console.log('Client Disconnected');
        });
        
        server.listen(port, () => {
            if (this.serverListeningPromiseFiber) {
                this.serverListeningPromiseFiber.resolve();
            }
            console.log(`Server runnig at http://localhost:${port}`);
        });
    } catch(err) {
        console.log('ERROR ON CREATE: ::::: CATCH');
        console.log(err)
    }
}

function onConnection(clientToProxySocket) {
    console.log('Client Connected To Proxy');
    // We need only the data once, the starting packet
    clientToProxySocket.once ('data', (data) => {
        const isTLSConnection = data.toString().indexOf('CONNECT') !== -1;
    
        // Considering Port as 80 by default 
        let serverPort = 80;
        let serverAddress;

        if (isTLSConnection) {
            console.log('https :::>');
            // Port changed to 443, parsing the host from CONNECT 
            serverPort = 443;
            const d = data.toString()
                .split('CONNECT ')[1]
                .split(' ')[0]
                .split(':');

            serverAddress = d[0];
            serverPort = d[1];

            console.log({
                serverPort,
                serverAddress
            });
        } else {
            console.log("http !!!!>");
            // Parsing HOST from HTTP
            serverAddress = data.toString()
            .split('Host: ')[1].split('\r\n')[0];
            console.log({
                serverAddress
            });
        }

        console.log('Create proxy to server connection ...');
        const proxyToServerSocket = net.createConnection (
            {
                host: serverAddress,
                port: serverPort
            },
            () => {
                console.log('PROXY TO SERVER SET UP');
            
                if (isTLSConnection) {
                    // Send Back OK to HTTPS CONNECT Request
                    clientToProxySocket.write('HTTP/1.1 200 OK\r\n\n');
                } else {
                    proxyToServerSocket.write(data);
                }

                // Piping the sockets
                clientToProxySocket.pipe(proxyToServerSocket);  
                proxyToServerSocket.pipe(clientToProxySocket);
            }
        )
        .on('error', (err) => {
            console.log('PROXY TO SERVER ERROR');
            console.log(err);
        });
            
        clientToProxySocket.on('error', (err) => {
            console.log("clientToProxy socket error: :::::::");
            console.log(err);
        });
        
        // _____________ logging
        clientToProxySocket.on('data', (data) => {
            console.log('Data ;;CTPS;;>');
            console.log(data.toString());
        });

        proxyToServerSocket.on('data', (data) => {
            console.log('Data ::PTSS::>');
            console.log(data.toString());
        });
    });
}

// ____________________ exports
exports.ProxyServer = ProxyServer;
