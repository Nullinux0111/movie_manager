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
                    
        var actors = info.actors.map((value) => value["peopleNm"]);
        var director;
        var grade;
        var prdtStatNm;
        if(info.directors[0])
            director=info.directors[0].peopleNm;
        else 
            director = "'undefined'";
        if(info.audits[0])
            grade = info.audits[0].watchGradeNm;
        else
            grade = "'undefined'";
        
        if(info.prdtStatNm){
            if(info.prdtStatNm == "개봉")
                prdtStatNm = "개봉";
            else if(info.prdtStatNm == "개봉예정")
                prdtStatNm = "개봉예정";
            else 
                prdtStatNm = "unexpected";
        }
        
        var bindParams = {
            code : info.movieCd,
            name : info.movieNm,
            director : director,
            actors : Buffer.from(JSON.stringify(actors), "utf8"),
            grade : grade,
            genre : info.genres[0].genreNm,
            runningTime : info.showTm,
            prdtStat : prdtStatNm
        }
        Log.info(TAG +"insertMovie", bindParams.director);
        if(!info.movieCd || !info.movieNm)
            return false;
        else
            return DBUtil.getDBConnection().then((connection) => {
                var query = `insert into movie values (:code, :name, :director, :actors, :grade, :genre, :runningTime, null, :prdtStat)`;
                if(!connection)
                    return false;
                return connection.execute(query, bindParams).then((result) => {
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