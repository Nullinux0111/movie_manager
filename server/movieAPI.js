const Log = require('./Log');
const DBUtil = require('./DBUtil');
const TAG = "movieAPI";
const fetch = require('node-fetch');

const DEBUG = true;

exports.getMovieInfo = (data) => getMovieInfo(data);
exports.insertMovieToDB = (data) => insertMovieToDB(data);


function getMovieInfo(data){
    
    var query = "";
    if(data.title)
        query += `http://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=8d87809b4aeb3882889061a07a04116e&movieNm=${data.title}`;
    else if(data.movieCode)
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


function insertMovieToDB(data) {
    return getMovieInfo(data).then((info) => {
        var bindParams = {
            code : info.movieCd,
            name : info.movieNm,
            director : info.directors[0].peopleNm,
            actors : null, //info.actors,
            grade : info.audits[0].watchGradeNm,
            genre : info.genres[0].genreNm,
            runningTime : info.showTm
        }
        Log.info(TAG +"insertMovie", bindParams.director);
        if(!info.movieCd || !info.movieNm)
            return false;
        else
            DBUtil.getDBConnection().then((connection) => {
                var query = `insert into movie values (:code, :name, :director, :actors, :grade, :genre, :runningTime, null)`;
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