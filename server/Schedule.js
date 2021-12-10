const DBUtil = require('./DBUtil');
const Util = require('./Util');
const Log = require('./Log');
const { DATE } = require('oracledb');

const TAG = "Schedule.js:";


exports.selectSchedule = (date, time, cinema, theater) => selectSchedule(date, time, cinema, theater);
exports.list_schedule = (cinema, filter) => list_schedule(cinema, filter);
exports.insertSchedule = (data) => insertSchedule(data);


/**
 * 
 * @param {String} play_date 
 * @param {String} play_time 
 * @param {String} cinema 
 * @param {number} theater 
 * @param {String} movie_id
 */
const Schedule = function(play_date, play_time, cinema, theater, movie_id, movie_name, play_type){
    this.play_date = play_date;
    this.play_time = play_time;
    this.cinema = cinema;
    this.theater = theater;
    this.movie_id = movie_id;
    this.movie_name = movie_name;
    this.play_type = play_type;

    this.toJson = () => {
        return {
            play_date: this.play_date,
            play_time: this.play_time,
            cinema: this.cinema,
            theater: this.theater,
            movie_id: this.movie_id,
            movie_name: this.movie_name,
            play_type: this.play_type
        };
    };
    
    /**
     * make Predicate string for where statement to find this schedule.
     * 
     * @returns predicate for this schedule if play_date is not undefined.
     */
    this.predicate = function() {
        if(play_date != null)
            return wherePredicate(this.play_date, this.play_time, this.cinema, this.theater);
    };
}

// schedule = new Schedule(Date('2021-11-29'), DATE('2021-11-29 15:00'), '서울', '1', '20200087')






function insertSchedule(data) {
    var play_date = data.play_date;
    var play_time = data.play_time;
    var cinema = data.cinema;
    var theater = data.theater;
    var movie_id = data.movie_id;
    var movie_name = data.movie_name;
    data.play_date = Util.dateToString(play_date);
    data.play_time = Util.dateTimeToString(play_time);

    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status:false};
        var query = `insert into Schedule values (TO_DATE(:play_date, '${Util.dateFormat}'), TO_DATE(:play_time, '${Util.dateTimeFormat}'), :cinema, :theater, :movie_id, :movie_name, :play_type)`;
        return connection.execute(query, data)
            .then((result) => {
                Log.info(TAG+"insertSchedule", "rows inserted: " + result.rowsAffected + " rows");
                connection.commit();
                return {status: true};
            })
            .catch((error) => {
                Log.error(TAG+"insertSchedule", error);
                return {status: false};
            })
    })
}

function selectSchedule(date, time, cinema, theater){
    var play_date = new Date(date);
    var play_time = new Date(time);
    var play_date_str = Util.dateToString(play_date);
    var play_time_str = Util.dateTimeToString(play_time);

    Log.info(TAG+"select", play_date_str+ "  " + play_time_str);

    return DBUtil.getDBConnection().then((connection) => {
        if(!connection)
            return false;
        var query = `select * from Schedule where `+
                `play_date=TO_DATE('${play_date_str}','YYYY-MM-DD') ` +
                `and play_time=TO_DATE('${play_time_str}','YYYY-MM-DD HH24:mi:ss') ` +
                `and cinema_name = '${cinema}' and theater_number = ${theater}`;
        Log.info(TAG+"select_schedule", "query: " + query);
        return connection.execute(query).then((result) => {
            if(!(result.rows.length == 1))
                return false;
            else if(!result.rows[0][4])
                return false;
            Log.info(TAG+"select_Schedule", "result="+ result.rows[0]);
            return new Schedule(date, time, cinema, theater, result.rows[0][4], result.rows[0][5], result.rows[0][6]);
        })
        .catch((error) => {
            Log.error(TAG+"select_schedule", error);
            return false;
        })
    })
    .catch((error) => {
        Log.error(TAG+"select_schedule", error);
        return false;
    })
    
}


/***
 * Search schedules of a cinema after now.
 * 
 * @param {String} cinema name
 * @param {JSON}   filter [filter{play_date, movie_id, movie_name}]
 * @returns JsonObject
 *              - status : if execute successfully
 *              - data : array of schedules after now. 
 *                      - each schedule represents a list.
 */
 const list_schedule = (cinema, filter) => {
    return DBUtil.getDBConnection()
    .then((connection) => {
        if(!connection){
            Log.info(TAG+"list_cinema", "connection is undefined");
            return {status: false};
        }

        var query = `select * from Schedule where cinema_name='${cinema}' `;
        if(filter){
            if(filter.play_date){
                query += `and play_date = TO_DATE(${Util.dateToString(filter.play_date)}, 'YYYY-MM-DD') `;
            }
            // else{
            //     query += `and play_time >= CURRENT_DATE `;
            // }
            if(filter.movie_id){
                query += `and movie_id = '${filter.movie_id}' `;
            }
            if(filter.movie_name){
                query += `and movie_name = '${filter.movie_name}' `;
            }
        }
        Log.info(TAG, query);
        query += `order by play_time`;
        return connection.execute(query).then((result) => {
                Log.info(TAG, "list_schedule_result: " + result.rows);
                var list = [];
                for(schedule of result.rows){
                    var record = [];
                    list.push( schedule );
                }
                
                return {status: true, data: list};
            })
            .catch((error) => {
                Log.error(TAG+"list_schedule", error);
                return {status: false};
            })
    })
}




function wherePredicate(play_date, play_time, cinema, theater) {
    if(play_date != null)
        return `play_date=TO_DATE('${Util.dateToString(play_date)}','YYYY-MM-DD') `
            + `and play_time=TO_DATE('${Util.dateTimeToString(play_time)}','YYYY-MM-DD HH24:mi:ss') `
            + `and cinema_name = '${cinema}' and theater_number = ${theater}`;
}