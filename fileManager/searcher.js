const worker_threads = require('worker_threads');
const fs = require('fs');
const path = require('path');

const { file, searchPhrase } = worker_threads.workerData;

let result = file;

if (searchPhrase) {
    result = file.replaceAll(searchPhrase, `<b style = "background-color: #00ff00">${searchPhrase}</b>`);
};

worker_threads.parentPort.postMessage(result);