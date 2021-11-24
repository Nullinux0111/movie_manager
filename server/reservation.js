
//const schedule = require('./schedule.js');

const DBUtil = require('./DBUtil');
const Log = require('./Log');
const Util = require('./Util');

const TAG = "reservation:";



/**
 * search list of cinema names.
 * 
 * @returns JsonObject
 *              - status : if execute successfully.
 *              - data : array of cinema names.
 */
const list_cinema = () => {
    return DBUtil.getDBConnection()
    .then((connection) => {
        if(!connection){
            Log.info(TAG+"list_cinema", "connection is undefined");
            return {status: false};
        }

        var query = "select cinema_name from Cinema";
        return connection.execute(query);
    })
    .then((result) => {
        Log.info(TAG, "list_cinema_result: " + result.rows);
        var list = [];
        for(cinema of result.rows){
            list.push(cinema[0]);
        }
        Log.info(TAG, "list: " + list);
        
        return {status: true, data: list};
        
    })
    .catch((error) => {
        Log.error(TAG+"list_cinema", error);
    })
}


/***
 * Search schedules of a cinema after now.
 * 
 * @param {String} cinema name
 * @returns JsonObject
 *              - status : if execute successfully
 *              - data : array of schedules after now. 
 *                      - each schedule represents a list.
 */
const load_schedule_cinema = (cinema) => {
    return DBUtil.getDBConnection()
    .then((connection) => {
        if(!connection){
            Log.info(TAG+"list_cinema", "connection is undefined");
            return {status: false};
        }

        var query = `select * from Schedule where cinema_name='${cinema}' and play_date > CURRENT_DATE`;

        return connection.execute(query);
    })
    .then((result) => {
        Log.info(TAG, "list_cinema_result: " + result.rows);
        var list = [];
        for(schedule of result.rows){
            var record = [];
            record.push(Util.dateToString(schedule[0]));
            record.push(Util.dateToString(schedule[1]));
            list.push( record.concat( schedule.slice(2) ) );
        }
        
        return {status: true, data: list};
    })
    .catch((error) => {
        Log.error(TAG+"load_schedule_cinema", error);
        return {status: false};
    })
}



exports.list_cinema = () => {
    return list_cinema();
}

exports.load_schedule_cinema = (cinema) => {
    return load_schedule_cinema(cinema);
}