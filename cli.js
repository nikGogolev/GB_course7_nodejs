#!/usr/local/bin/node
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const yargs = require('yargs');

const options = yargs
    .usage('Usage: -p <path> to file')
    .option('p', {
        alias: 'path',
        describe: 'Path to the file',
        type: 'string',
    }).option('s', {
        alias: 'search',
        describe: 'Search string',
        type: 'string',
    }).argv;

const executionDir = options.path || process.cwd();

const isFile = (dir, fileName) => fs.lstatSync(path.resolve(dir, fileName)).isFile();

if (options.path && isFile(options.path, '')) {
    const data = fs.readFileSync(path.resolve(options.path, ''), 'utf-8');
    if (options.search) {
        let pos = 0;
        let findCount = 0;
        while (true) {
            let foundPos = data.indexOf(options.search, pos);
            if (foundPos == -1) break;
            pos = foundPos + 1;
            findCount++;
        }
        console.log(data.replaceAll(options.search, '\033[46m' + options.search + '\033[0m'));
        console.log('\033[46m Найдено ' + findCount + ' совпадений \033[0m');
    } else {
        console.log(data);
    }
    return;
}


const showDirContent = (dir) => {
    const list = fs.readdirSync(path.resolve(dir));
    inquirer.prompt([
        {
            name: 'fileName',
            type: 'list',
            message: 'Choose a file to read:',
            choices: list,
        },
    ]).then(({ fileName }) => {
        if (isFile(dir, fileName)) {
            const fullFilePath = path.resolve(dir, fileName);
            const data = fs.readFileSync(fullFilePath, 'utf-8');
            if (options.search) {
                let pos = 0;
                let findCount = 0;
                while (true) {
                    let foundPos = data.indexOf(options.search, pos);
                    if (foundPos == -1) break;
                    pos = foundPos + 1;
                    findCount++;
                }
                console.log(data.replaceAll(options.search, '\033[46m' + options.search + '\033[0m'));
                console.log('\033[46m Найдено ' + findCount + ' совпадений \033[0m');
            } else {
                console.log(data);
            }
        } else {
            showDirContent(path.resolve(dir, fileName));
        }
    });
};

showDirContent(executionDir);
