const account = require('./account.js');

const Util = require('./Util');
const Log = require('./Log');

const TAG = "customer_account:";

exports.join_customer = (data) => {
    return join_customer(data);
}

exports.login_customer = (id, pwd) => {
    return login_customer(id, pwd);
}

exports.loadInfo = (id) => account.load_customer_info(id);

exports.setInfo = (id, data) => {
    return account.set_customer_info(id, data);
}

/**
 * Join account for customer.
 * 
 * @param {JSON} data Json object which contains account data.
 * @returns Promise
 */
const join_customer = (data) => {
    var id = data.id;
    var pwd = data.pwd;

    var error_message = "";
    return account.customerIdCheck(id)
    .then((isValid) => {
        if(!isValid){
            var hashString = Util.generateHashPassword(pwd, id);
            return hashString;
        }
        error_message = "이미 존재하는 ID입니다.";
        return;
    })
    .then((hashString) => {
        if(!hashString)
            return false;
        data.pwd = hashString;
        return account.insertCustomer(data);
    })
    .then((result)=>{
        if(error_message!="")
            return false;
            //return error_message;
        if(!result)
            return false;
            //return error_message;
        return result;
    })
    .catch((error) => {
        Log.error(TAG, error)
        //return error_message;
        return false;
    })
    
};

/**
 * 
 * @param {String} id account ID
 * @param {String} pwd Hashed String of password
 * @returns Promise
 */
const login_customer = (id, pwd) => {
    return account.loginCustomer(id, pwd);
}
