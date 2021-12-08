const Log = require('./Log');
const DBUtil = require('./DBUtil');
const account = require('./employee_account');
const Util = require('./Util')
;
const TAG = "Admin.js:";

exports.addCinema = (cinema) => addCinema(cinema);

exports.addDepartment = (cinema, dept) => addDepartment(cinema, dept);

exports.addEmployee = (data) => {
    data.pwd = '1111';
    return account.join_employee(data);
}

exports.getDepartment = (id) => getDepartment(id);




function addCinema(cinema_name) {
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status: false};
        var query = `insert into Cinema values('${cinema_name}', 0)`;
        return connection.execute(query).then((result) => {
            Log.info(TAG+"addCinema", "rowsAffected: " + result.rowsAffected);
            connection.commit();
            return {status: true};
        })
        .catch((error) => {
            Log.error(TAG+"addCinema", error);
            return {status:false};
        })
    })
}

function addDepartment(cinema, dept) {
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status: false};
        var query = `insert into Department values('${cinema}','${dept}')`;
        connection.execute(query).then((result) => {
            Log.info(TAG+"addDepartment", "rowsAffected: " + result.rowsAffected);
            connection.commit();
            return {status:true};
        })
        .catch((error) => {
            Log.error(TAG+"addDepartment", error);
            return {status:false};
        })
    })
}


function getDepartment(employee_id) {
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status: false};

        var query = `select cinema_name, dept_name from Employee where employee_id='${employee_id}' `;
        return connection.execute(query).then((result) => {
            Log.info(TAG+"getDepartment", "result.rows[0]: " + result.rows[0]);
            return {status:true, data: result.rows[0]};
        })
        .catch((error) => {
            Log.error(TAG+"getDepartment", error);
            return {status:false};
        })
    })
}