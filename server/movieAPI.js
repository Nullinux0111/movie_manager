const Log = require('./Log');
const DBUtil = require('./DBUtil');
const TAG = "movieAPI";
const fetch = require('node-fetch');

const DEBUG = true;

exports.getMovieInfo = (data) => getMovieInfo(data);
exports.insertMovieToDB = (data) => insertMovieToDB(data);

/**
 * 
 * @param {JSON} data Json data for query 
 *                      { title : movie name, movieCode : movie code }
 * @returns {Promise<JSON | undefined>} Promise
 */
function getMovieInfo(data){
    
    var query = "";
    if(data.title)
        return Promise.resolve();
        //query += `http://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=8d87809b4aeb3882889061a07a04116e&movieNm=${data.title}`;
    if(data.movieCode)
        query +=`http://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=8d87809b4aeb3882889061a07a04116e&movieCd=${data.movieCode}`;
    return fetch(query)
            .then((res) => res.json())
            .then((res) => {
                var info = res.movieInfoResult.movieInfo;
                Log.info(TAG, "query: "+query);
                return info;
            })
            .catch((err) => {
                Log.error(TAG, err);
            })
}

/**
 * Insert movie data to Database by movie code or movie name.
 * 
 * @param {JSON} data Json data for query 
 *                      { title : movie name, movieCode : movie code }
 * @returns Promise
 */
function insertMovieToDB(data) {
    return getMovieInfo(data).then((info) => {
        if(!info)
            return false;
        var bindParams = {
            code : info.movieCd,
            name : info.movieNm,
            director : info.directors[0].peopleNm,
            actors : info.actors,
            grade : info.audits[0].watchGradeNm,
            genre : info.genres[0].genreNm,
            runningTime : info.showTm
        }
        Log.info(TAG +"insertMovie", bindParams.director);
        if(!info.movieCd || !info.movieNm)
            return false;
        else
            DBUtil.getDBConnection().then((connection) => {
                var query = `insert into movie values (:code, :name, :director, :actors, :grade, :genre, :runningTime, null, 0)`;
                if(!connection)
                    return false;
                connection.execute(query, bindParams).then((result) => {
                    if(DEBUG)
                        Log.info(TAG+"insertMovie", "Movie inserted.");
                    connection.commit();
                    return true;
                })
                .catch((error) => {
                    Log.error(TAG+"insertMovieToDB", error);
                    return false;
                })
            })
    })
}