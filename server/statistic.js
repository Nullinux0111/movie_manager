const Log = require('./Log');
const DBUtil = require('./DBUtil');
const Util = require('./Util');


exports.movie_total_sales = (filter) => movie_total_sales(filter);
exports.movie_total_viewers = (filter) => movie_total_viewers(filter);


/**
 * ticketStatus - 0: reservation, 1: printed, 2: canceled, 3: refund
 * @param {JSON} filter It has filter options (movie_id, cinema, date|dateAfter, ticketStatus).
 * @return count reservations.
 */
function movie_total_viewers(filter){
    var movie_id = filter.movie_id;
    var cinema = filter.cinema;
    var date = filter.date;
    var dateAfter = filter.dateAfter;
    var ticketStatus = filter.ticketStatus;
    var filterCount = 0;

    var query = `select count(id) from Reservation where`
    if(movie_id){
        query += `movie_id = '${movie_id}' `;
        filterCount=1;
    }
    if(cinema) {
        if(filterCount == 1)
            query += 'and ';
        filterCount += 1;
        query += `cinema_name = '${cinema}' `;
    }
    if(date) {
        if (filterCount > 0)
            query += 'and ';
        filterCount += 1;
        query += `play_date = TO_DATE('${date}', '${Util.dateFormat}') `;
    }
    else if(dateAfter) {
        if(filterCount > 0)
            query += 'and ';
        filterCount += 1;
        query += `play_date >= TO_DATE('${date}', '${Util.dateFormat}') `;
    }
    if(ticketStatus) {
        if(filterCount > 0)
            query += 'and ';
        filterCount += 1;
        query += `isPrinted = ${ticketStatus}`;
    }
    else if(filterCount == 0)
        query += `select count(id) from Reservation`;

    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status:false};
        
        return connection.execute(query).then((result) => {
            if(!result.rows || !result.rows[0] || !result.rows[0].length==1){
                if(!result.rows[0])
                    Log.info(TAG+"ticketCost", "result.rows[0]: " + result.rows[0]);
                else if(!result.rows[0].length==1)
                    Log.info(TAG+"ticketCost", "result.rows[0] length: "+result.rows[0].length);
                return {status:false};
            }

            Log.info(TAG+"movie_total_sales", "result.rows[0][0]: " + result.rows[0][0])
            return {status: true, count: result.rows[0][0]};
        })

    })
}

/**
 * 
 * @param {JSON} filter year: Number|String, month: Number|String date: String, dateBefore: String, dateAfter: String,
 *                       
 * @returns 
 */
 function movie_total_sales(filter){
    var movie_id = filter.movie_id;
    var cinema = filter.cinema;
    var year = filter.year;
    var month = filter.month;
    var date = filter.date;
    var dateBefore = filter.dateBefore;
    var dateAfter = filter.dateAfter;
    var group = filter.group;
    var ticketStatus = filter.ticketStatus;
    var filterCount = 0;

    var query = `select SUM(cost) from Reservation where`
    if(movie_id){
        query += `movie_id = '${movie_id}' `;
        filterCount=1;
    }
    if(cinema) {
        if(filterCount == 1)
            query += 'and ';
        filterCount += 1;
        query += `cinema_name = '${cinema}' `;
    }
    if(year){
        if(filterCount > 0) query += `and `;
            query += `EXTRACT(YEAR FROM play_date) == ${year} `
        if(month){
                query += `and EXTRACT(MONTH FROM play_date) == ${month} `
        }
        filterCount += 1;
    }
    else if(date) {
        if (filterCount > 0)
            query += 'and ';
        filterCount += 1;
        query += `play_date = TO_DATE('${date}', '${Util.dateFormat}') `;
    }
    else if(dateBefore) {

    }
    else if(dateAfter) {
        if(filterCount > 0)
                query += 'and ';
            filterCount += 1;
            query += `play_date >= TO_DATE('${date}', '${Util.dateFormat}') `;
    }
    if(ticketStatus) {
        if(filterCount > 0)
            query += 'and ';
        filterCount += 1;
        query += `isPrinted = ${ticketStatus}`;
    }
    else if(filterCount == 0)
        query += `select sum(cost) from Reservation`;

    return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return {status:false};
        
        return connection.execute(query).then((result) => {
            if(!result.rows || !result.rows[0] || !result.rows[0].length==1){
                if(!result.rows[0])
                    Log.info(TAG+"ticketCost", "result.rows[0]: " + result.rows[0]);
                else if(!result.rows[0].length==1)
                    Log.info(TAG+"ticketCost", "result.rows[0] length: "+result.rows[0].length);
                return {status:false};
            }

            Log.info(TAG+"movie_total_sales", "result.rows[0][0]: " + result.rows[0][0])
            return {status: true, count: result.rows[0][0]};
        })

    })
}