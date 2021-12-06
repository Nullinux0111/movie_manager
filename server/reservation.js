const Schedule = require('./Schedule.js');

const DBUtil = require('./DBUtil');
const Log = require('./Log');
const Util = require('./Util');

const TAG = "reservation:";

exports.list_cinema = () => {
    return list_cinema();
}

exports.list_empty_seats = (schedule) => {
    return list_empty_seats(schedule);
}

exports.checkCost = (schedule, seat) => {
    return ticketCost(schedule, seat);
}

exports.reserve = (user, schedule, seat) => {
    return reserve(user, schedule, seat);
}

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

        var query = "select cinema_name from Cinema where cinema_name != '본사'";
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



/**
 * 
 * @param {Schedule} schedule 
 */
const list_empty_seats = (schedule) => {
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection)
            return false;
        var query = `select seat_number from Seat where cinema_name = '${schedule['cinema']}' ` +
            `and theater_number = ${schedule['theater']} ` +
            `and seat_number not in (` +
            `select seat_number from Schedule_seat ` +
            `where `+ schedule.predicate() +")";

        Log.info(TAG+"list_empty_seats", "QUERY: " +query);
        return connection.execute(query).then((result) => {
            if(result.rows.length>=0)
                Log.info(TAG+"list_empty_seats", "length: " + result.rows.length);
            Log.info(TAG+"list_empty_rows", result.rows);
            
            return result.rows;
        })
    })
}

const ticketCost = (schedule, seat) => {
    var play_type = schedule.play_type;
    
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status: false};
        var theaterCostQuery = `select cost from TheaterType where type = `+
                    `(select type from Theater where cinema_name='${schedule.cinema}' `+
                    `and theater_number=${schedule.theater})`;
        var playCostQuery = `select cost from Cost_time where play_type = '${play_type}'`;
        var seatCostQuery = `select cost from Cost_seat where seat_type = `+
                    `(select seat_type from Seat where cinema_name='${schedule.cinema}' `+
                    `and theater_number=${schedule.theater} and seat_number='${seat}') `;
        var totalCost = 0;
        return connection.execute(theaterCostQuery).then((result) => {
            if(!result.rows)
                return false;
            Log.info(TAG+"ticketCost1", result.rows);
            totalCost += result.rows[0][0];
            return connection.execute(playCostQuery);
        })
        .then((result) => {
            if(!result.rows || !result.rows[0] || !result.rows[0].length==1){
                if(!result.rows[0])
                    Log.info(TAG+"ticketCost", "result.rows[0]: " + result.rows[0]);
                else if(!result.rows[0].length==1)
                    Log.info(TAG+"ticketCost", "result.rows[0] length: "+result.rows[0].length);
                return false;
            }
                
            Log.info(TAG+"ticketCost2[0][0]", result.rows[0][0]);
            Log.info(TAG+"ticketCost2", result.rows);
            totalCost += result.rows[0][0];
            return connection.execute(seatCostQuery);
        })
        .then((result) => {
            if(!result.rows || !result.rows[0] || !result.rows[0].length==1){
                if(!result.rows[0])
                    Log.info(TAG+"ticketCost", "result.rows[0]: " + result.rows[0]);
                else if(!result.rows[0].length==1)
                    Log.info(TAG+"ticketCost", "result.rows[0] length: "+result.rows[0].length);
                return false;
            }
            Log.info(TAG+"ticketCost3", result.rows);
            totalCost += result.rows[0][0];
            return {status: true, cost: totalCost};
        })
        .catch((error) => {
            Log.error(TAG+"ticketCost", error);
            return {status: false};
        })
    })
}


const reserve = (user, schedule, seat) => {
    var play_date = schedule.play_date;
    var play_time = schedule.play_time;
    var cinema = schedule.cinema;
    var theater = schedule.theater;
    var seat_num = seat;

    var movie_id = schedule.movie_id;
    var movie_name = schedule.movie_name;
    
    if(!seat_num) return Promise.resolve({status:false});

    return list_empty_seats(schedule).then((list)=>{
        if(!list) 
            return {status:false};
        
        for(seat_data of list){
            if(seat_data[0] == seat_num){
                return DBUtil.getDBConnection().then((connection) => {
                    if(!connection) return {status: false};
                    var play_date_str = Util.dateToString(play_date);
                    var play_time_str = Util.dateTimeToString(play_time);
                    var query = `insert into Schedule_seat values (` +
                                `TO_DATE('${play_date_str}', '${Util.dateFormat}'), `+
                                `TO_DATE('${play_time_str}', '${Util.dateTimeFormat}'),`+
                                `'${cinema}', ${theater}, '${seat_num}')`;
                    Log.info(TAG+"reserve", "Query:"+query);
                    return connection.execute(query).then((result) => {
                        Log.info(TAG+"reserve", "into schedule_seat, rowsAffected:"+ result.rowsAffected);
                    })
                    .then(()=>{
                        var query = `insert into Reservation values(` +
                                    `reservation_seq.NEXTVAL, NULL, CURRENT_DATE, CURRENT_DATE, `+
                                    `'${movie_id}', '${movie_name}', TO_DATE('${play_date_str}', '${Util.dateFormat}'), `+
                                    `TO_DATE('${play_time_str}','${Util.dateTimeFormat}'), `+
                                    `'${cinema}', ${theater}, '${seat_num}', '${user}', 0)`;
                        return connection.execute(query)
                    })
                    .then((result)=>{
                        Log.info(TAG+"reserve", "into reservation, rowsAffected:"+ result.rowsAffected);
                        connection.commit();
                        return {status:true}
                    })
                    .catch((error) => {
                        Log.error(TAG+"reserve", error);
                        connection.rollback();
                        Log.info(TAG+"reserve", "rollback!");
                        return {status:false};
                    })
                })
            }
        }

        return {status: false};

    })
}