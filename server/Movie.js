const Log = require('./Log');
const DBUtil = require('./DBUtil');

const TAG = "Movie.js:"


exports.list_movies = (data) => list_movies(data);





function list_movies(data) {
    var query = "select * from movie where ";
    if(data.movie_id)
        query += `movie_id = '${data.movie_id}'`;
    else if(data.movie_name)
        query += `movie_name LIKE '%${data.movie_name}%'`;
    else if(data.director)
        query += `director LIKE %'${data.director}'`;
    else
        query = "select * from movie";
    
    return DBUtil.getDBConnection().then((connection) => {
        if(!connection)
            return {status: false};

        connection.execute(query).then((result)=>{
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