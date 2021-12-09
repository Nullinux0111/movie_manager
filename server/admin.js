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

exports.setDepartment = (id, cinema, dept) => setDepartment(id, cinema, dept);
exports.setSalary = (id, salary) => setSalary(id, salary);


exports.listItem = (cinema) => listItem(cinema);
exports.listItemStocks = (cinema) => listItemStocks(cinema);

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

function setDepartment(id, cinema, dept) {
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status : false};

        var query = `update Employee set cinema='${cinema}' and dept_name='${dept}' where employee_id='${id}'`;
        return connection.execute(query).then((result) => {
            connection.commit();
            return {status: true};
        })
        .catch((error) => {
            Log.error(TAG+"setDept", error, query);
            return {status: false};
        })
    })
}

function setSalary(id, salary) {
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status: false};
        var query =`update Employee set salary=${salary} where employee_id='${id}'`;
        return connection.execute(query).then((result) => {
            connection.commit();
            return {status: true};
        }).catch((error) => {
            Log.error(TAG+"setSalary", error, query);
            return {status: false};
        })
    })
}


function listItem(cinema) {
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status:false};

        var query = `select * from Item where cinema_name='${cinema}'`;
        return connection.execute(query).then((result)=>{
            Log.info(TAG+"listItem", result.rows);
            return {status: true, data: result};
        }).catch((error) => {
            Log.error(TAG+"listItem", error, query);
            return {status: false};
        })
    })
}

function listItemStocks(cinema){
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status:false};

        var query = `select * from Item_stocks where cinema_name='${cinema}'`;
        return connection.execute(query).then((result)=>{
            Log.info(TAG+"listItemStocks", result.rows);
            return {status: true, data: result};
        }).catch((error) => {
            Log.error(TAG+"listItemStocks", error, query);
            return {status: false};
        })
    })
}