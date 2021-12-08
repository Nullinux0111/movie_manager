const Log = require('./Log');
const DBUtil = require('./DBUtil');

const TAG = "Movie.js:"


exports.list_movies = (data) => list_movies(data);





function list_movies(data) {
    var query = "select * from movie where ";
    var filterCount = 0;
    if(data){
        if(data.movie_id){
            query += `movie_id = '${data.movie_id}' `;
            filterCount = 1;
        }
        if(data.movie_name){
            if(filterCount == 1)
                query += `and `;
            filterCount += 1;
            query += `movie_name LIKE '%${data.movie_name}%' `;
        }
        if(data.director){
            if(filterCount > 0)
                query += `and `;
            filterCount += 1;
            query += `director LIKE '%${data.director}%' `;
        }
    }
    if(filterCount == 0)
        query = "select * from movie";
    
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection)
            return {status: false};

        return connection.execute(query).then((result)=>{
            Log.info(TAG+"list", "result: " + result.rows);
            rows = result.rows;
            return {status: true, data: rows};
        })
        .catch((error) => {
            Log.error(TAG+"list", error);
            return {status: false};
        })
    })
    
}

function updateMovie(data) {
    var query = "update movie set ";
    var filterCount = 0;
    if(data){
        if(data.movie_name){
            filterCount = 1;
            query += `movie_name LIKE '%${data.movie_name}%' `;
        }
        if(data.director){
            if(filterCount > 0)
                query += `and `;
            filterCount += 1;
            query += `director LIKE '%${data.director}%' `;
        }
        if(data.is_on){
            if(filterCount > 0)
                query += `and `;
            filterCount += 1;
            query += `status=status+1 `;
        }
        if(data.grade){
            if(filterCount > 0)
                query += `and `;
            filterCount += 1;
            query += `grade='${data.grade}' `;
        }
        if(data.synopsis){
            if(filterCount > 0)
                query += `and `;
            filterCount += 1;
            query += `synopsis='${data.synopsis}' `;
        }
    }
    if(filterCount == 0)
        return Promise.resolve({status:false});
    
    query += `where movie_id='${data.movie_id}'`
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection)
            return {status: false};

        return connection.execute(query).then((result)=>{
            Log.info(TAG+"update", "rowsAffected: " + result.rowsAffected);
            return {status: true};
        })
        .catch((error) => {
            Log.error(TAG+"update", error);
            connection.rollback();
            return {status: false};
        })
    })
        
}