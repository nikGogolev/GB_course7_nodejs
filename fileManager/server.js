const http = require('http');
const url = require('url');
const cluster = require('cluster');
const os = require('os');
const socket = require('socket.io');
const worker_threads = require('worker_threads');

if (cluster.isMaster) {

    for (let i = 0; i < os.cpus().length; i++) {
        //console.log(`Forking process number ${i}`);
        cluster.fork();
    }

} else {
    let clients = 0;

    let searchPhrase = '';

    const server = http.createServer((req, res) => {
        try {

            const fileManager = (queryData, searchPhrase) => {
                return new Promise((resolve, reject) => {
                    const worker = new worker_threads.Worker('./worker.js', {
                        workerData: { queryData, searchPhrase },
                    });

                    worker.on('message', resolve);
                    worker.on('error', reject);
                });
            };

            const queryData = url.parse(req.url, true);



            if (queryData.query.search) {
                searchPhrase = queryData.query.search;
            };

            (async () => {
                const html = await fileManager(queryData, searchPhrase);
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                });
                res.end(html);
            })();

        } catch (err) {
            res.writeHead(404, {
                'Content-Type': 'text/html',
            });
            res.end(err.message);
        }

    });

    const io = socket(server);

    io.on('connection', client => {
        client.on('client-connected', () => {
            clients++;
            client.broadcast.emit('server-msg', clients);
            client.emit('server-msg', clients);
        });
        client.on('disconnect', () => {
            clients--;
            client.broadcast.emit('server-msg', clients);
        });
    });

    server.listen(5555);
}