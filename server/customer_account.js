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

const login_customer = (id, pwd) => {
    return account.loginCustomer(id, pwd);
}
