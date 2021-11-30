const socket = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { checkServerIdentity } = require('tls');

const clients = {};

const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, './index.html');
    const readStream = fs.createReadStream(indexPath);

    readStream.pipe(res);
});

const io = socket(server);

io.on('connection', client => {
    client.on('client-name', (data) => {
        clients[client.id] = data;

        const payload = {
            message: `client ${clients[client.id] ? clients[client.id] : client.id} connected`,
        };

        client.broadcast.emit('server-msg', payload);

    });

    client.on('client-msg', data => {
        // console.log(data);

        const payload = {
            message: `${clients[client.id]}: ${data.message}`,
        };

        client.broadcast.emit('server-msg', payload);
        client.emit('server-msg', payload);
    })

    client.on('disconnect', () => {
        const payload = {
            message: `client ${clients[client.id] ? clients[client.id] : client.id} disconnected`,
        };
        client.broadcast.emit('server-msg', payload);
    });
});



server.listen(5555);
