const account = require('./account.js');

const Util = require('./Util');
const Log = require('./Log');

const TAG = "employee_account:";

exports.join_employee = (data) => {
    return join_employee(data);
}

exports.login_employee = (id, pwd) => {
    return login_employee(id, pwd);
}

/**
 * Join account for employee.
 * 
 * @param {JSON} data Json object which contains account data.
 * @returns Promise
 */
const join_employee = (data) => {
    var id = data.id;
    var pwd = data.pwd;

    var error_message = "";
    return account.employeeIdCheck(id)
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
        return account.insertEmployee(data);
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
const login_employee = (id, pwd) => {
    return account.loginEmployee(id, pwd);
}
