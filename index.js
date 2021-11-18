const fs = require('fs');
const readline = require('readline');

const ACCESS_LOG = './access.log';
const REQUESTS_89_123_1_41 = './89_123_1_41_requests.log.log';
const REQUESTS_34_48_240_111 = './34_48_240_111_requests.log.log';

//Clear data
fs.writeFile(REQUESTS_89_123_1_41, '', (err) => {
	console.log(err);
});

fs.writeFile(REQUESTS_34_48_240_111, '', (err) => {
	console.log(err);
});

const readStream = fs.createReadStream(
	ACCESS_LOG,
	{
		flags:'r',
		encoding: 'utf-8'
	}
);

const writeStream1 = fs.createWriteStream(
	REQUESTS_89_123_1_41,
	{
		encoding: 'utf-8',
		flags: 'a'
	}
);

const writeStream2 = fs.createWriteStream(
	REQUESTS_34_48_240_111,
	{
		encoding: 'utf-8',
		flags: 'a'
	}
);

const rl = readline.createInterface(readStream);

rl.on('line', (line)=>{
	if (line.indexOf('89.123.1.41') !== -1){
		writeStream1.write(line + '\n');
	} else if (line.indexOf('34.48.240.111') !== -1){
		writeStream2.write(line + '\n');
	}
});

rl.on('error', (err) => {
	console.log(err);
});

readStream.on('error', (err) => {
	console.log(err);
});

writeStream1.on('error', (err) => {
	console.log(err);
});

writeStream2.on('error', (err) => {
	console.log(err);
});





