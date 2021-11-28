
exports.generateHashPassword = (password, key) => {
    return generateHashPassword(password, key);
};


exports.dateToString = (date) => {
	return dateToString(date);
};


function generateHashPassword(password, key){
	const crypto = require('crypto');
	console.log("key constructor: "+key.constructor);
    //pbkdf2Sync( password, salt, iteration(repeat), keylen)
	return crypto.pbkdf2Sync(password, key+'', 5, 64, 'sha512').toString('hex');
}


function dateToString(date) {
	const moment = require('moment');
	
	return moment(date).format('YYYY-MM-DD HH:mm:ss');
}