const worker_threads = require('worker_threads');
const fs = require('fs');
const path = require('path');

const { queryData, searchPhrase } = worker_threads.workerData;

const isFile = (dir, fileName) => fs.lstatSync(path.resolve(dir, fileName)).isFile();

let filePath = queryData.query.path && path.resolve(queryData.query.path) || path.join(process.cwd(), queryData.pathname);

const searcher = (file, searchPhrase) => {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads.Worker('./searcher.js', {
            workerData: { file, searchPhrase },
        });

        worker.on('message', resolve);
        worker.on('error', reject);
    });
};
if (isFile(filePath, '')) {
    const file = fs.readFileSync(filePath, 'utf-8');
    (async () => {
        const result = await searcher(file, searchPhrase);
        worker_threads.parentPort.postMessage(result);
    })();

} else {
    const list = fs.readdirSync(filePath);
    let ulItems = '';
    list.forEach((item) => {
        ulItems += `<li><a href="${queryData.query.path ? filePath + '/' + item : item}/">${item}</a></li>`;
    });

    worker_threads.parentPort.postMessage(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Hello Node JS</title>
            <script src="https://cdn.socket.io/4.2.0/socket.io.min.js"
                integrity="sha384-PiBR5S00EtOj2Lto9Uu81cmoyZqR57XcOna1oAuVuIEjzj0wpqDVfD0JA9eXlRsj"
                crossorigin="anonymous">
            </script>
        </head>
        <body>

        <p>Clients: <span id="clients">0</span></p>
        <ul>
            ${ulItems}
        </ul>
        </body>
        <script>
            const clients = document.querySelector('#clients');
            const socket = io('localhost:5555');
            socket.on('connect', () => {
                socket.emit('client-connected');
            });
            socket.on('server-msg', data => {
                // console.log(data);
                clients.innerHTML = data
                console.log(data);
            });
        </script>
        </html>
    `);
}

