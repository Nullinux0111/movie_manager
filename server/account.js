const DBUtil = require('./DButil.js');
const Util = require('./Util');
const Log = require('./Log');
const TAG = "account.js:"

const DEBUG = true;

exports.customerIdCheck = (id) => {
    return idCheck(id, "Customer");
};

exports.employeeIdCheck = (id) => {
    return idCheck(id, "Employee");
};

exports.insertCustomer = (data) => {
    return insertUser(data);
};

exports.insertEmployee = (data) => {
    return insertEmployee(data);
};

exports.loginCustomer = (id, pwd) => {
    return login(id, pwd, "Customer");
};

exports.loginEmployee = (id, pwd) => {
    return login(id, pwd, "Employee");
}

exports.load_customer_info = (id) => {
    return loadUserInfo(id, "Customer");
}

exports.load_employee_info = (id) => {
    return loadUserInfo(id, "Employee");
}

exports.set_customer_info = (id, data) => {
    return setUserInfo(id, data, "Customer");
}

exports.set_employee_info = (id, data) => {
    return setUserInfo(id, data, "Employee");
}


/**
 * Check if id exists.
 * 
 * @param {String} id account ID
 * @param {String} type User type. Customer or Employee.
 * @returns {Promise<boolean>} promise
 */
function idCheck(id, type) {
    var table = "";
    if(type == "Customer")
        table = "CustomerAcc";
    else if(type == "Employee")
        table = "EmployeeAcc";
    else
        return Promise.resolve(false);

    return DBUtil.getDBConnection()
    .then((connection) => {
        Log.info(TAG + "idCheck", "connection executed");

        if(!connection){
            Log.info(TAG+"idCheck", "connection is undefined");
            return false;
        }

        var query = `select user_id from ${table} where user_id = '${id}'`;
        Log.info(TAG+"idCheck", `Query: ${query}`);
        return connection.execute(query).then((result) => {
            Log.info(TAG, "idCheck_result: " + result.rows);

            if(result.rows == id){
                Log.info(TAG+"idCheck", "There is a same id.");
                return true;
            }
            else{
                return false;
            }
        });
    })
    .catch((error) => {
        Log.error("join_id_check", error, `id: ${id}, type: ${type}`);
        return false;
    })
}

/**
 * Check whether password is valid for id.
 * 
 * @param {String} id account ID
 * @param {String} pwd Hashed string of password
 * @param {String} type User type. Customer or Employee.
 * @returns Promise
 */
function pwdCheck(id, pwd, type) {
    var table = "";
    if(type == "Customer")
        table = "CustomerAcc";
    else if(type == "Employee")
        table = "EmployeeAcc";
    else
        return Promise.resolve(false);
    
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection)
            return false;

        var query = `select user_pwd from ${table} where user_id='${id}'`;
        Log.info(TAG+"pwd_check", `query: ${query}`);
        return connection.execute(query).then((result) => {
            
            if(DEBUG)
                Log.info(TAG + "pwdCheck_found", result.rows);
            if(result.rows == Util.generateHashPassword(pwd, id)){
                Log.info(TAG+"pwdCheck", "PWD is correct.");
                return true;
            }
            else{
                return false;
            }
        })
        .catch((error) => {
            Log.error("join_pwd_check", error, `id: ${id}, pwd: ${pwd}, type: ${type}`);
            return false;
        })
    })
}

/**
 * 
 * @param {String} id account ID
 * @param {String} pwd Hashed String of password
 * @param {String} type User type. Customer or Employee.
 * @returns Promise
 */
function login(id, pwd, type) {
    var table = "";
    if(type == "Customer")
        table = "CustomerAcc";
    else if(type == "Employee")
        table = "EmployeeAcc";
    else
        return Promise.resolve({status:false, message:"Wrong Parameter"});
    
    return idCheck(id, type).then((result) => {
        if(result){
            return pwdCheck(id, pwd, type);
        }
        return false;
    })
    .then((result) => {
        if(result)
            return {status: true};
        else
            return {status: false, message: "아이디 혹은 비밀번호를 확인하세요."};
    })
    .catch((error) => {
        Log.error(TAG+"login", error, `id: ${id}, pwd: ${pwd}`);
        return {status: false, message: "에러가 발생했습니다. Try again later."};
    })
}

/**
 * 
 * @param {JSON} data User data to insert to DB.
 * @returns Promise
 */
function insertUser(data) {
    var pwd = data.pwd;
    var bindParams = {
        id : data.id,
        name: data.name,
        phone: data.phone,
        birthday: data.birthday
    };

    if(!data.id || !pwd || !data.name || !data.phone)
        return Promise.resolve(false);

    return DBUtil.getDBConnection()
    .then((connection) => {
        Log.info(TAG+"insertUser", "connection executed");

        if(!connection){
            Log.info(TAG+"insertUser", "connection is undefined");
            return false;
        }

        //main.js에서 설정한 data 구조 이름 그대로 참조
        var query = `insert into CustomerAcc values ('${data.id}', '${pwd}')`;
        var query1 = `insert into Customer values (:id, :name, :phone, :birthday)`;
        
        if(DEBUG)
            Log.info(TAG+"insertUser", `Query: ${query}`);
            
        // account 테이블 insert query 실행
        return connection.execute(query).then((result) => {
            if(DEBUG){
                Log.info(TAG+"insertUser", "rows inserted: " + result.rowsAffected + " rows");
            }
            // user 테이블 insert query 실행
            return connection.execute(query1, bindParams).then((result) => {
                if(DEBUG)
                    Log.info(TAG+"insertUser", "Account inserted.");
                connection.commit();
                return true;
            })
            .catch((error) => {
                // User insert Error
                Log.error(TAG+"insertUser", error, query1);
                return false;
            })
            
        })
        .catch((error) => {
            // Account insert Error
            Log.error(TAG + "insertUser", error, query);
            connection.rollback();
            return false;
        })

    })
    .catch((error) => {
        // DB connection Error
        Log.error(TAG+"insertUser", error);
        return false;
    })
}

function insertEmployee(data) {
    var pwd = data.pwd;
    var bindParams = {
        id : data.id,
        name: data.name||"undefined",
        birthday: data.birthday,
        phone: data.phone || "undefined",
        salary: data.salary,
        cinema: data.cinema,
        department: data.dept
    };

    if(!data.id || !pwd)
        return Promise.resolve(false);

    return DBUtil.getDBConnection()
    .then((connection) => {
        Log.info(TAG+"insertEmployee", "connection executed");

        if(!connection){
            Log.info(TAG+"insertEmployee", "connection is undefined");
            return false;
        }

        //main.js에서 설정한 data 구조 이름 그대로 참조
        var query = `insert into EmployeeAcc values ('${data.id}', '${pwd}')`;
        var query1 = `insert into Employee values (:id, :name, :phone, :birthday, :salary, :cinema, :department)`;
        
        if(DEBUG)
            Log.info(TAG+"insertEmployee", `Query: ${query}`);
            
        // account 테이블 insert query 실행
        return connection.execute(query).then((result) => {
            if(DEBUG){
                Log.info(TAG+"insertEmployee", "rows inserted: " + result.rowsAffected + " rows");
            }
            // user 테이블 insert query 실행
            return connection.execute(query1, bindParams).then((result) => {
                if(DEBUG)
                    Log.info(TAG+"insertEmployee", "Account inserted.");
                connection.commit();
                return true;
            })
            .catch((error) => {
                // User insert Error
                Log.error(TAG+"insertEmployee", error, query1);
                return false;
            })
            
        })
        .catch((error) => {
            // Account insert Error
            Log.error(TAG + "insertEmployee", error, query);
            connection.rollback();
            return false;
        })

    })
    .catch((error) => {
        // DB connection Error
        Log.error(TAG+"insertEmployee", error);
        return false;
    })
}


function loadUserInfo(user_id, type) {
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status: false};

        var query = `select * from ${type} where customer_id='${user_id}'`;
        
        return connection.execute(query).then((result) => {
            if(!result.rows[0]) return {status:false, data: []};
            Log.info(TAG+"loadUser", result.rows[0]);
            return {status:true, data: result.rows[0]};
        })
        .catch((error) => {
            Log.error(TAG+"loadUserInfo", error, query);
            return {status: false};
        })
    })
}

function setUserInfo(user_id, data, type) {
    var table = "";
    if(type=="Customer")
        table = "CustomerAcc";
    else if(type == "Employee")
        table = "EmployeeAcc";
    else
        return Promise.resolve({status: false});

    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status: false};
        var query = `update ${type} set `;
        var filterCount = 0;

        if(data.phone){
            filterCount += 1;
            query += `phone_number='${data.phone}' `;
        }
        if(data.birthday){
            var bd = new Date(data.birthday);
            data.birthday = Util.dateToString(bd);
            if(filterCount>0)
                query += `, `;
            filterCount += 1;
            query += `birthday=TO_DATE('${data.birthday}', '${Util.dateFormat}') `
        }
        if(data.name){
            if(filterCount>0)
                query += `, `;
            filterCount += 1;
            query += `${type}_name='${data.name}' `;
        }
        
        if(filterCount>0){
            query += `where ${type}_id='${user_id}'`;
            Log.info(TAG+"setUserInfo", query);
            return connection.execute(query).then((result) => {
                if(result.rowsAffected>0)
                    Log.info(TAG+"setUserInfo", "Affected: " + result.rowsAffected);
                else
                    Log.info(TAG+"setUserInfo", "nothing changed");
                connection.commit();
                return {status: true};
            })
            .then((result) => {
                if(data.pwd && result.status){
                    query = `update ${table} set user_pwd='${Util.generateHashPassword(data.pwd, user_id)}' where user_id='${user_id}'`;
                    return connection.execute(query).then((result) => {
                        Log.info(TAG+"setUserPwd", "Affected: " + result.rowsAffected);
                        connection.commit();
                        return {status: true};
                    })
                }
                return result;
            })
            .catch((error) => {
                Log.error(TAG+"setUserInfo", error, query);
                return {status: false};
            })
        }
        else if(data.pwd){
            query = `update ${table} set user_pwd='${Util.generateHashPassword(data.pwd, user_id)}' where user_id='${user_id}'`;
            return connection.execute(query).then((result) => {
                Log.info(TAG+"setUserPwd", "Affected: " + result.rowsAffected);
                connection.commit();
                return {status: true};
            })
            .catch((error)=>{
                Log.error(TAG+"setUserPwd", error, query);
                return {status:false};
            })
        }
        Log.info(TAG+"setUserInfo", "nothing");
        return {status: true};
    })
    .catch((error) => {
        Log.error(TAG+"setUserInfo", error);
        return {status:false};
    })
}