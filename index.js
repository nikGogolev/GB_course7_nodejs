const colors = require('colors');
const params = process.argv.slice(2);
let [hi, low] = params;
let noSimpleNumbers = true;
const simpleNumbers = [];

const isSimple = (number) => {
	for (let i = 2; i < Math.abs(number); i++){
		if (number % i === 0){
			return false;
		};
	};
	return true;
};

const trafficLights = (numbers) => {
	let color = 'green';
	numbers.forEach((number, i) => {
		switch (color) {
			case 'green':
				console.log(colors.green(number));
				color = 'yellow';
				break;
			case 'yellow':
				console.log(colors.yellow(number));
				color = 'red';
				break;
			case 'red':
				console.log(colors.red(number));
				color = 'green';
				break;
		};
	}); 
};

if (+hi < +low){
	const temp = +low;
	low = +hi;
	hi = temp;
};

if (isNaN(+hi) || isNaN(+low)){
	throw new Error('Не число');
};

for (let i = +low; i <= +hi; i++){
	if (isSimple(i)){
		simpleNumbers.push(i);
		noSimpleNumbers = false;
	};
};

if (noSimpleNumbers){
	console.log(colors.red('Нет простых чисел'));
} else {
	trafficLights(simpleNumbers);
};