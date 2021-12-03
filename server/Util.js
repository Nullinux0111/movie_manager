
exports.generateHashPassword = (password, key) => {
    return generateHashPassword(password, key);
};


exports.dateToString = (date) => {
	return dateToString(date);
};

exports.dateTimeToString = (date) => {
	return dateTimeToString(date);
};

exports.dateFormat = "YYYY-MM-DD";
exports.dateTimeFormat = "YYYY-MM-DD HH24:mi:ss";


function generateHashPassword(password, key){
	const crypto = require('crypto');
	console.log("key constructor: "+key.constructor);
    //pbkdf2Sync( password, salt, iteration(repeat), keylen)
	return crypto.pbkdf2Sync(password, key+'', 5, 64, 'sha512').toString('hex');
}


function dateTimeToString(date) {
	const moment = require('moment');
	
	return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function dateToString(date) {
	const moment = require('moment');
	
	return moment(date).format('YYYY-MM-DD');
}

/**
 * check wheter given dates are same day.
 * @param {Date} date1 
 * @param {Date} date2 
 */
function isSameDay(date1, date2) {
	if(!date1 || !date2) return false;
	
	return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth
			&& date1.getDate == date2.getDate;
}

/**
 * 
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns 
 */
function isSameTime(date1, date2) {
	if(!date1 || !date2) return false;

	return date1.getTime() == date2.getTime();
}