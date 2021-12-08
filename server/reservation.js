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

exports.isSeatAvailable = (schedule, seat) => {
    return isSeatAvailable(schedule, seat);
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

const isSeatAvailable = (schedule, seat) => {
    return list_empty_seats(schedule).then((list) => {
        for( seat_data of list ){
            if(seat == seat_data)
                return true;
        }
        return false;
    })
}

const ticketCost = (schedule, seats) => {
    var play_type = schedule.play_type;
    
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status: false};
        var theaterCostQuery = `select cost from TheaterType where type = `+
                    `(select type from Theater where cinema_name='${schedule.cinema}' `+
                    `and theater_number=${schedule.theater})`;
        var playCostQuery = `select cost from Cost_time where play_type = '${play_type}'`;
        var seatCostQuery = `select cost from Cost_seat natural join Seat `+
                            `where cinema_name='${schedule.cinema}' `+
                            `and theater_number=${schedule.theater} and seat_number in (`;
        for (var i = 0; i < seats.length; i++)
            seatCostQuery += (i > 0) ? ", :" + i : ":" + i;
        seatCostQuery += ")";

        var cost = 0;
        var totalCost = 0;
        return connection.execute(theaterCostQuery).then((result) => {  // 상영관 타입 요금 (base)
            if(!result.rows)
                return false;
            Log.info(TAG+"ticketCost1", result.rows);
            cost += result.rows[0][0];
            return connection.execute(playCostQuery);
        })
        .then((result) => {                                                 // 시간 타입 요금
            if(!result || !result.rows || !result.rows[0] || !result.rows[0].length==1){
                if(!result.rows[0])
                    Log.info(TAG+"ticketCost", "result.rows[0]: " + result.rows[0]);
                else if(!result.rows[0].length==1)
                    Log.info(TAG+"ticketCost", "result.rows[0] length: "+result.rows[0].length);
                return false;
            }
                
            Log.info(TAG+"ticketCost2[0][0]", result.rows[0][0]);
            Log.info(TAG+"ticketCost2", result.rows);
            cost += result.rows[0][0];
            return connection.execute(seatCostQuery, seats);
        })
        .then((result) => {                                                 // 좌석 타입 요금
            if(!result || !result.rows || !result.rows[0] || !result.rows[0].length==1){
                if(!result.rows[0])
                    Log.info(TAG+"ticketCost", "result.rows[0]: " + result.rows[0]);
                else if(!result.rows[0].length==1)
                    Log.info(TAG+"ticketCost", "result.rows[0] length: "+result.rows[0].length);
                return {status: false};
            }
            Log.info(TAG+"ticket3", result.rows);
            for(var i=0 ; i<result.rows.length; i++){
                totalCost += cost + result.rows[i][0];
            }
            Log.info(TAG+"ticketCost3", totalCost);
            return {status: true, cost: totalCost};
        })
        .catch((error) => {
            Log.error(TAG+"ticketCost", error);
            return {status: false};
        })
    })
}

/**
 * 
 * @param {String} user userID
 * @param {*} schedule 
 * @param {Array} seats  seat array
 * @returns 
 */
const reserve = (user, schedule, seats) => {
    var play_date = schedule.play_date;
    var play_time = schedule.play_time;
    var cinema = schedule.cinema;
    var theater = schedule.theater;
    var seat_num = seats;

    var movie_id = schedule.movie_id;
    var movie_name = schedule.movie_name;

    var cost = 0;
    var customers = seats.length;
    
    if(!seats) return Promise.resolve({status:false});

    return ticketCost(schedule, seats).then((calc_cost)=> {
        if(!calc_cost) return null;
        cost = calc_cost.cost;
        return DBUtil.getDBConnection();
    })
    .then((connection) => {
        if(!connection) return {status: false};
        var play_date_str = Util.dateToString(play_date);
        var play_time_str = Util.dateTimeToString(play_time);
        var query = `insert into Schedule_seat values (` +
                    `TO_DATE('${play_date_str}', '${Util.dateFormat}'), `+
                    `TO_DATE('${play_time_str}', '${Util.dateTimeFormat}'),`+
                    `'${cinema}', ${theater}, :bv)`;
        Log.info(TAG+"reserve", "Query:"+query);
        var bindParams = [];
        for(var seat of seats){
            bindParams.push([seat]);
        }
        return connection.executeMany(query, bindParams).then((result) => {
            Log.info(TAG+"reserve", "into schedule_seat, rowsAffected:"+ result.rowsAffected);
        })
        .then(()=>{
            var query = `insert into Reservation values(` +
                        `reservation_seq.NEXTVAL, ${cost}, CURRENT_DATE, CURRENT_DATE, `+
                        `'${movie_id}', '${movie_name}', TO_DATE('${play_date_str}', '${Util.dateFormat}'), `+
                        `TO_DATE('${play_time_str}','${Util.dateTimeFormat}'), `+
                        `'${cinema}', ${theater}, :bv, '${user}', 0)`;
            return connection.executeMany(query, bindParams);
        })
        .then((result)=>{
            Log.info(TAG+"reserve", "into reservation, rowsAffected:"+ result.rowsAffected);
            connection.commit();
            return {status:true}
        })
        .then((result) => {
            addSalesLog(movie_id, cost, customers);
            return result;
        })
        .catch((error) => {
            Log.error(TAG+"reserve", error);
            connection.rollback();
            Log.info(TAG+"reserve", "rollback!");
            return {status:false};
        })
    })
}

const addSalesLog = (movie_id, cost, customers) => {

    return DBUtil.getDBConnection().then((connection) => {
        var saleQuery = `update movie_sales set sales_amount=sales_amount+${cost} where movie_id=${movie_id}`;
        var customerQuery = `update movie_sales set customers=customers+${customers} where movie_id=${movie_id}`;
        return connection.execute(saleQuery)
        .then((result) => {
            if(result.rowsAffected>0)
                return connection.execute(customerQuery);
            else{
                Log.info(TAG+"reserve_log", "Not counted reservation.");
                return false;
            }
        })
        .then((result) => {
            if(!result || result.rowsAffected==0)
                Log.info(TAG+"reserve_log", "Not counted reservation.");
            Log.info(TAG+"reserve_log", "log successfully");
        })
    })
    .catch((error) => {
        Log.error(TAG+"reserve_log", error);
    })

}