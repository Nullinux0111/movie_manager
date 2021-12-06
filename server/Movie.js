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
            query += `movie_name LIKE '%${data.movie_name}%'`;
        }
        if(data.director){
            if(filterCount > 0)
                query += `and `;
            filterCount += 1;
            query += `director LIKE '%${data.director}%'`;
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