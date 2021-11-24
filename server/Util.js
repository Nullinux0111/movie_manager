
exports.generateHashPassword = (password, key) => {
    return generateHashPassword(password, key);
}

//exports.checkPassword = 


function checkPassword(password, key, ref){
	let hashString = generateHashPassword(password, key);

	return ref.once('value').then(function(dataSnapshot){
		console.log('check snapshot: ' + dataSnapshot);
  		console.log('check snapshot val: ' + dataSnapshot.val());
		if(!dataSnapshot.exists()) 
			return { 
				result: false,
				error: "Schedule is not exists"
		};
		if(!dataSnapshot.child("password").exists()) 
			return { 
				result : false,
				error: "Password is not exists - Invalid Schedule."
			};
		if(dataSnapshot.child("password").val() == hashString)
			return {
				result : true
			}
		else return { 
			result : false,
			error : "Incorrect Password"
		};
	})
}

function generateHashPassword(password, key){
	const crypto = require('crypto');
	console.log("key constructor: "+key.constructor);
    //pbkdf2Sync( password, salt, iteration(repeat), keylen)
	return crypto.pbkdf2Sync(password, key+'', 5, 64, 'sha512').toString('hex');
}