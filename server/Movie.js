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
            var count = 0;
            var movie_rows=[];
            var promises = [];
            for(var i = 0; i < result.rows.length; i++) {
                
                promises.push(new Promise((resolve, reject) => {
                    var movie_1 = result.rows[i].slice(0,3);
                    var movie_2 = result.rows[i].slice(4);
                    DBUtil.getJsonData(result.rows[i][3]).then((d) => {
                        Log.info(TAG+"list", d);
                        var j = JSON.parse(`${d}`);
                        movie_1.push(j);
                        movie_rows.push(movie_1.concat(movie_2));
                        count++;
                        if(count==result.rows.length){
                            resolve(movie_rows);
                        }
                        else
                            resolve(null);
                    })
                    
                }))
            }
            return Promise.all(promises).then((result) => {
                return {status: true, data: movie_rows};
            })
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