/**
 * Таймеры с обрытным отстчетом
 * @param {string} timers - mm-hh-DD-MM-YYYY mm-hh-DD-MM-YYYY .....
 */
const colors = require('colors');
const moment = require('moment');
const EventEmitter = require('events');
const emitter = new EventEmitter();

const params = process.argv.slice(2);

class Timer{
	constructor(date, id){
		this.dateOfExpiration = moment(date, "mm-hh-DD-MM-YYYY");
		this.yearsLeft = 0;
		this.monthLeft = 0;
		this.daysLeft = 0;
		this.hoursLeft = 0;
		this.minutesLeft = 0;
		this.secondsLeft = 0;
		this.totalLeft = 0;
		this.timerId = id;
		this.setTimeLeft();
	}
	
	setTimeLeft(){
		this.totalLeft = this.dateOfExpiration.diff(moment());
		this.yearsLeft = this.dateOfExpiration.diff(moment(), 'years');
		this.monthLeft = this.dateOfExpiration.diff(moment(moment().add(this.yearsLeft, 'years')), 'months');	
		this.daysLeft = this.dateOfExpiration.diff(moment(moment().add(this.yearsLeft, 'years').add(this.monthLeft, 'months')), 'days');
		this.hoursLeft = this.dateOfExpiration.diff(moment(moment().add(this.yearsLeft, 'years').add(this.monthLeft, 'months').add(this.daysLeft, 'days'), 'days'), 'hours');
		this.minutesLeft = this.dateOfExpiration.diff(moment(moment().add(this.yearsLeft, 'years').add(this.monthLeft, 'months').add(this.daysLeft, 'days').add(this.hoursLeft, 'hours'), 'hours'), 'minutes');
		this.secondsLeft = this.dateOfExpiration.diff(moment(moment().add(this.yearsLeft, 'years').add(this.monthLeft, 'months').add(this.daysLeft, 'days').add(this.hoursLeft, 'hours').add(this.minutesLeft, 'minutes'), 'minutes'), 'seconds');
	}
	
	getTimeLeft(){
		return {
			yearsLeft: this.yearsLeft,
			monthLeft: this.monthLeft,
			daysLeft: this.daysLeft,
			hoursLeft: this.hoursLeft,
			minutesLeft: this.minutesLeft,
			secondsLeft: this.secondsLeft,
			totalLeft: this.totalLeft,
			timerId: this.timerId,
		}
	}
}

const showTimer = (timer) => {
	timer.setTimeLeft();
	const timeLeft = timer.getTimeLeft();
	if (timer.totalLeft > 0){
		console.log(colors.green(
`Таймер № ${timer.timerId}
	Осталось 
	${timeLeft.yearsLeft} лет,
	${timeLeft.monthLeft} месяцев,
	${timeLeft.daysLeft} дней,
	${timeLeft.hoursLeft} часов,
	${timeLeft.minutesLeft} минут,
	${timeLeft.secondsLeft} секунд`));
	} else {
		console.log(colors.red(
`Таймер № ${timer.timerId}
	Время истекло`)
		);
	}
	
};

const timers = [];

params.forEach((time, i) => {
	timers.push(new Timer(time, i+1))
});

emitter.on('showTimer', showTimer);

setInterval(() => {
	console.clear();
	timers.forEach((timer) => {
		emitter.emit('showTimer', timer);
	});
}, 1000);
