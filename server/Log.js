
exports.error = (TAG, error, query) => {
    var date = new Date();
    var log = "";
    console.log("========LogError=======");
    console.log(date.getDate() + "일 " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()+"."+Date.now()%1000);
    if(TAG){
        log+= TAG+": ";
    }
    console.error(log+error);
    if(query){
        console.log("Query: " + query);
    }
    console.error("logError ended");
}
exports.info = (TAG, message) => {
    var date = new Date();
    var log = "";
    console.log("");
    console.log(date.getDate() + "일 " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()+"."+Date.now()%1000);
    if(TAG){
      log += TAG + ": ";
    }
    
    console.log("logInfo: "+log+message);
}
