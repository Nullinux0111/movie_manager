const e = require('express');
const OracleDB = require('oracledb');
const DBUtil = require('./DButil.js');
const Log = require('./Log');
const TAG = "join_check:"

const DEBUG = true;

exports.customerIdCheck = (id) => {
    return idCheck(id, "Customer");
};

exports.employeeIdCheck = (id) => {
    return idCheck(id, "Employee");
};

exports.insertCustomer = (data) => {
    return insertUser(data, "Customer");
};

exports.insertEmployee = (data) => {
    return insertUser(data, "Employee");
};


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

        //var user_id = "";
        var query = `select user_id from ${table} where user_id = '${id}'`;
        Log.info(TAG+"idCheck", `Query: ${query}`);
        return connection.execute(query).then((result) => {
            //doRelease(connection);
            Log.info(TAG, "idCheck_result: " + result.rows);
            if(result.rows == id){
                Log.info(TAG+"idCheck", "There is a same id.");
                return false;
            }
            else{
                return true;
            }
        });
    })
    .catch((error) => {
        Log.error("join_id_check", error, `id: ${id}, type: ${type}`);
        return false;
    })
}



function insertUser(data, type) {
    var pwd = data.pwd;
    var bindParams = {
        id : data.id,
        name: data.name||"undefined",
        phone: data.phone || "undefined",
        birthday: data.birthday
    };
    var table = "";
    if(type == "Customer")
        table = "CustomerAcc";
    else if(type == "Employee")
        table = "EmployeeAcc";
    else
        return Promise.resolve(false);

    if(!data.id || !pwd)
        return Promise.resolve(false);

    return DBUtil.getDBConnection()
    .then((connection) => {
        Log.info(TAG+"insertUser", "connection executed");

        if(!connection){
            Log.info(TAG+"insertUser", "connection is undefined");
            return false;
        }

        //main.js에서 설정한 data 구조 이름 그대로 참조
        var query = `insert into ${table} values ('${data.id}', '${pwd}')`;
        var query1 = `insert into ${type} values (:id, :name, :phone, :birthday)`;
        
        if(DEBUG)
            Log.info(TAG+"insertUser", `Query: ${query}`);
            
        
        return connection.execute(query).then((result) => {
            if(DEBUG){
                Log.info(TAG+"insertUser", "rows inserted: " + result.rowsAffected + " rows");
            }
            return connection.execute(query1, bindParams).then((result) => {
                if(DEBUG)
                Log.info(TAG+"insertUser", "Account inserted.");
                connection.commit();
                return true;
            })
            .catch((error) => {
                Log.error(TAG+"insertUser", error, query1);
                return false;
            })
            
        })
        .catch((error) => {
            Log.error(TAG + "insertUser", error, query);
            connection.rollback();
            return false;
        })

    })
    .catch((error) => {
        Log.error(TAG+"insertUser", error);
        return false;
    })
}


function doRelease(connection) {
    connection.close();
    Log.info(TAG+"doRelease", "Connection is closed.");
}

