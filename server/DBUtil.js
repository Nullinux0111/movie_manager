const Log = require('./Log.js')
const oracledb = require('oracledb');

var host = 'localhost';
var port = 3001;
var database = 'xe';


/**
 * 
 * @returns Promise
*/
exports.getDBConnection = () => {
    const TAG = "DBUtil.getDBconnection:";
    Log.info(TAG, "executed.");
    oracledb.autoCommit = false;
    return oracledb.getConnection({
        user: "TEST",
        password: "test",
        host: host, 
        database: database 
      }).catch((error) => {
          Log.error(TAG, error, `user:${user}, pwd:${pwd}`);
      })
}