const http = require('http');
const url = require('url');
const cluster = require('cluster');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

if (cluster.isMaster) {

    console.log(`Master process ${process.pid} is running...`);

    for (let i = 0; i < os.cpus().length; i++) {
        console.log(`Forking process number ${i}`);
        cluster.fork();
    }

} else {

    console.log(`Worker ${process.pid} is running`);

    let searchPhrase = '';

    const isFile = (dir, fileName) => fs.lstatSync(path.resolve(dir, fileName)).isFile();

    const server = http.createServer((req, res) => {
        try {

            const queryData = url.parse(req.url, true);

            if (queryData.query.search) {
                searchPhrase = queryData.query.search;
            };

            const tStream = new Transform({
                transform(chunk, encoding, callback) {
                    if (searchPhrase) {
                        const tranformed = chunk.toString().replaceAll(searchPhrase, `<b style = "background-color: #00ff00">${searchPhrase}</b>`);
                        this.push(tranformed);
                    } else this.push(chunk);

                    callback();
                }
            });

            let filePath = queryData.query.path && path.resolve(queryData.query.path) || path.resolve(`/${queryData.pathname}`);

            if (isFile(filePath, '')) {
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                });

                const readStream = fs.createReadStream(filePath);

                readStream.pipe(tStream).pipe(res);
            } else {
                const list = fs.readdirSync(filePath);
                let ulItems = '';
                list.forEach((item) => {
                    ulItems += `<li><a href="${queryData.query.path ? filePath + '/' + item : item}/">${item}</a></li>`;
                });
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                });
                res.end(
                    `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Hello Node JS</title>
                    </head>
                    <body>
                    <ul>
                        ${ulItems}
                    </ul>
                    </body>
                    </html>
                    `
                )
            }
        } catch (err) {
            res.writeHead(404, {
                'Content-Type': 'text/html',
            });
            res.end(err.message);
        }

    });

    server.listen(5555);
}