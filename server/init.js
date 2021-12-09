const DBUtil = require('./DBUtil');


exports.dummyData = (res) => dummyData(res);



function dummyData(res) {
    var response = ""
    const api = require('./movieAPI');
  
    api.insertMovieToDB({movieCode: 20210028}).then(()=>{
      return api.insertMovieToDB({movieCode: 20212015})
    })
    .then(() => {
      return api.insertMovieToDB({movieCode: 20191282})
    })
    .then(() => {
      return api.insertMovieToDB({movieCode: 20212168})
    })
    .then(() => {
      return api.insertMovieToDB({movieCode: 20210611})
    })
    .then(() => {
      return api.insertMovieToDB({movieCode: 20196264})
    })
    .then(() => {
      return api.insertMovieToDB({movieCode: 20205986})
    })
    .then(() => {
      return api.insertMovieToDB({movieCode: 20210087})
    })
    .then(()=>{
      response += "insert Movie finished \t\n";
    })
    .then(() => {
      return customerACC.join_customer({
        id: "TEST",
        pwd: "test",
        name: "유저",
        phone: "010-000-0000",
        birthday: "2000-01-01"
      }).then((result)=>{
        if(result)
          response += "insert customer finished \t \n";
        else
          response += "insert customer Failed \t \n";
      })
    }).then(()=> {
      return Admin.addEmployee({
        id: "EMPL",
        name: "직원",
        phone: "010-0000-0101",
        birthday: null,
        cinema: "안산",
        dept: "시설팀",
        salary: null
      }).then((result)=>{
        if(result)
          response += "insert employee finished \t \n";
        else
          response += "insert employee Failed \t \n";
      })
    }).then(()=> {
      return Admin.addEmployee({
        id: "TEST",
        name: "매점직원",
        phone: "010-0000-0101",
        birthday: null,
        cinema: "안산",
        dept: "매점팀",
        salary: null
      }).then((result)=>{
        if(result)
          response += "insert employee finished \t \n";
        else
          response += "insert employee Failed \t \n";
      })
    }).then(()=>{
      schedule.insertSchedule({
        play_date: "2021-12-09",
        play_time: "2021-12-09 09:00:00",
        cinema: "안산",
        theater: 1,
        movie_id: "20196264",
        movie_name: "유체이탈자",
        play_type: "day"
      })
    }).then(()=>{
      schedule.insertSchedule({
        play_date: "2021-12-09",
        play_time: "2021-12-09 09:00:00",
        cinema: "서울",
        theater: 1,
        movie_id: "20196264",
        movie_name: "유체이탈자",
        play_type: "day"
      })
    }).then(()=>{
      schedule.insertSchedule({
        play_date: "2021-12-10",
        play_time: "2021-12-10 09:00:00",
        cinema: "안산",
        theater: 2,
        movie_id: "20210028",
        movie_name: "스파이더맨: 노 웨이 홈",
        play_type: "day"
      })
    }).then(()=>{
      schedule.insertSchedule({
        play_date: "2021-12-10",
        play_time: "2021-12-10 09:00:00",
        cinema: "서울",
        theater: 2,
        movie_id: "20210028",
        movie_name: "스파이더맨: 노 웨이 홈",
        play_type: "day"
      })
    }).then(()=>{
      schedule.insertSchedule({
        play_date: "2021-12-09",
        play_time: "2021-12-09 13:00:00",
        cinema: "안산",
        theater: 1,
        movie_id: "20210028",
        movie_name: "스파이더맨: 노 웨이 홈",
        play_type: "day"
      })
    }).then(()=>{
      schedule.insertSchedule({
        play_date: "2021-12-09",
        play_time: "2021-12-09 13:00:00",
        cinema: "서울",
        theater: 1,
        movie_id: "20196264",
        movie_name: "유체이탈자",
        play_type: "day"
      })
    }).then((result)=>{
      response += "insert Schedules finished \t\n";
      return initSeats();
    })
    .then(()=> {
      return initItems().then(()=> {
        response += "insert Items finished\n"
        return initMaterials();
      })
    })
    .then(()=> {
      return initMaterials().then(()=>{
        response += "insert Materials finished\n"
      })
    })
    .then(()=> sendRespond(res, 200, response))
    .catch((error) => {
      Log.error(TAG, error);
    })
  
  }
  
  function initSeats() {
    const DBUtil = require('./DBUtil');
    var cinemas = ["안산", "서울"];
    var theaters = [1, 2, 3, 4];
    var seats = [];
    
    for(var i=0; i<6; i++){
      for(var j=0; j<10;j++){
        seats.push([String.fromCharCode(i+65) + String(j+1)]);
      }
    }
  
    return DBUtil.getDBConnection().then((connection)=>{
      var promises = [];
      if(!connection) {
        sendRespond(res, 200, false);
        return;
      }
      for(var cinema of cinemas){
        for(var theater of theaters){
          promises.push(new Promise((resolve, reject) => {
            connection.executeMany(`insert into seat values('${cinema}', ${theater}, :bv, '기본' )`,
                                    seats, {autoCommit:false, batchErrors:true})
            .then((result) => {
                if(result.batchErrors){
                  Log.error(TAG+"initSeats", result.batchErrors);
                  connection.rollback();
                  resolve(false);
                }
                connection.commit();
                resolve(true);
            })
          }))
        }
      }
      Promise.all(promises).then((result) => {
        Log.info(TAG+"initSeats", "initSeats Complete");
        connection.close();
      })
    })
  }
  
  
  function initItems() {
    const DBUtil = require('./DBUtil');
    var promises =[];
    var cinemas = ["안산"];
    var items = ["달콤팝콘L", "고소팝콘M", "콜라M", "콜라L", "제로콜라M", "제로콜라L",
                "레몬에이드", "아메리카노"];
    var costs = [6000, 6000, 3000, 3500, 3000, 3500,
                3500, 3000];
    var materials = ["옥수수", "옥수수", "콜라", "콜라", "제로콜라", "제로콜라",
                    "레몬에이드", "아메리카노"];
    var binds = [];
    items.map((value, index) => {
      binds.push([value, materials[index], costs[index]]);
    })
    return initItemStocks().then((result) => {
      return DBUtil.getDBConnection().then((connection) => {
        if(!connection) return false;
        for(var cinema of cinemas) {
    
          promises.push(new Promise((resolve, reject) => {
            connection.executeMany(`insert into Item values(:0, :1, '${cinema}', :2)`, binds)
              .then((result) => {
                if(result.batchErrors){
                  Log.error(TAG+"initItems", result.batchErrors);
                  connection.rollback();
                  resolve(false);
                }
                connection.commit();
                resolve(true);
              })
              .catch((error) => {
                Log.error(TAG+"initItem", error);
                resolve(false);
              })
          }))
        }
        Promise.all(promises).then((result) => {
          Log.info(TAG+"initItems", "initItems Complete");
          connection.close();
        })
        .catch((error) => {
          Log.error(TAG+"initItem all", error);
        })
      })
    })
  }
  
  
  function initItemStocks(){
    const DBUtil = require('./DBUtil');
    var cinemas = ["안산", "서울"];
    var promises = [];
    var items = ["옥수수", "콜라", "제로콜라", "음료컵", "레몬에이드", "아메리카노"];
    var stocks = [2, 500, 500, 1000, 300, 300];
    var binds = [];
    items.map((value, index) => {
      binds.push([value, stocks[index]]);
    })
    return DBUtil.getDBConnection().then((connection) => {
      if(!connection) return false;
  
      for(var cinema of cinemas){
        promises.push(new Promise((resolve, reject) => {
          connection.executeMany(`insert into Item_stocks values(:0, '${cinema}', :1)`, binds)
            .then((result) => {
              if(result.batchErrors){
                Log.error(TAG+"initItem_stocks", result.batchErrors);
                connection.rollback();
                resolve(false);
              }
              Log.info(TAG+"initItem_stocks", "item_stocks are initialized");
              connection.commit();
              resolve(true);
            })
            .catch((error) => {
              Log.error(TAG+"initItemStocks", error);
              resolve(false);
            })
        }))
      }
      Promise.all(promises).then((result) => {
        Log.info(TAG+"initItem_stocks", "initItem_stocks Complete");
        connection.close();
      })
      .catch((error) => {
        Log.error(TAG+"initItem_stocks all", error);
      })
    })
  }
  
  function initMaterials(){
    const DBUtil = require('./DBUtil');
    var cinemas = ["안산", "서울"];
    var promises = [];
    var items = ["영사기", "매점테이블", "매점의자", "좌석", "어린이용방석"];
    var stocks = [5, 20, 70, 350, 100];
    var binds = [];
    items.map((value, index) => {
      binds.push([value, stocks[index]]);
    })
    return DBUtil.getDBConnection().then((connection) => {
      if(!connection) return false;
  
      for(var cinema of cinemas){
        promises.push(new Promise((resolve, reject) => {
          connection.executeMany(`insert into Material values(:0, '${cinema}', :1)`, binds)
            .then((result) => {
              if(result.batchErrors){
                Log.error(TAG+"initMaterials", result.batchErrors);
                connection.rollback();
                resolve(false);
              }
              Log.info(TAG+"initMaterials", "materials are initialized");
              connection.commit();
              resolve(true);
            })
            .catch((error) => {
              Log.error(TAG+"initMaterials", error);
              resolve(false);
            })
        }))
      }
      Promise.all(promises).then((result) => {
        Log.info(TAG+"initMaterials", "initMaterials Complete");
        connection.close();
      })
      .catch((error) => {
        Log.error(TAG+"initMaterials all", error);
      })
    })
  }
  