const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');
const Log = require('./Log');

const customerACC = require('./customer_account');
const employeeACC = require('./employee_account');
const reserve = require('./reservation');
const movie = require('./Movie');
const schedule = require('./Schedule');
const Admin = require('./admin');
const Util = require('./Util');

var app = express();
var host = 'localhost';
var port = 3001;
var database = 'xe';

const TAG = "main.js:";

app.use(bodyParser.json());
app.use(cors());


// Account

app.post('/customer_join', (req, res) => {
  console.log("Req_body: ", req.body);
  var user = req.body.id;
  var pwd = req.body.pwd;
  var name = req.body.name;
  var phone = req.body.phone;
  var birthday = req.body.birthday;
  var respond = "";
  console.log("try to join as "+user + ", "+pwd + " by POST protocol.");

  var data = {
    id: user,
    pwd: pwd,
    name: name,
    phone: phone,
    birthday: birthday
  }
  Log.info("main", "id: "+data.id);
  customerACC.join_customer(data).then((result)=>{
      if(result){
        sendRespond(res, 200, {status: true, text:"success"});
      }
      else{
        sendRespond(res, 200, {status: false, text:"Failed"});
      }

  });
})

app.post('/login', (req, res) => {
  var id = req.body.id;
  var pwd = req.body.pwd;
  var type = req.body.type;

  if(!id || !pwd || !type){
    Log.info(TAG+"login", "id or pwd or type is undefined.");
    sendRespond(res, 500, {status: false});
  }
  if(type=="Customer")
    customerACC.login_customer(id, pwd).then((result) => {
      sendRespond(res, 200, result);
    })
  else if(type=="Employee")
    employeeACC.login_employee(id, pwd).then((result) => {
      sendRespond(res, 200, result);
    })
  else{
    sendRespond(res, 200, {status: false});
  }
})

app.post('/viewCustomerInfo', (req, res) => {
  var id = req.body.id;
  customerACC.loadInfo(id).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.post('/viewEmployeeInfo', (req, res) => {
  var id = req.body.id;
  employeeACC.loadInfo(id).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.post('/updateCustomerInfo', (req, res) => {
  var data = req.body.data;
  var id = data.id;
  
  customerACC.setInfo(id, data).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.post('/updateEmployeeInfo', (req, res) => {
  var data = req.body.data;
  var id = data.id;
  
  employeeACC.setInfo(id, data).then((result) => {
    sendRespond(res, 200, result);
  })
})


// Cinema

app.post('/list_cinema', (req, res)=>{
  console.log("list_cinema executed.");
  reserve.list_cinema().then((result) => {
    sendRespond(res, 200, result);
  })
})



// Movie

app.get('/movieInsertAPI', (req, res) => {
  var cd = req.query.code;
  var nm = req.query.name;
  const api = require('./movieAPI');

  api.insertMovieToDB({title: nm, movieCode: cd}).then((data)=>{
    sendRespond(res, 200, data);
  })

})

app.post('/listMovie', (req, res) => {
  var data = req.body.filter;
  console.log("listMovie executed.");
  
  movie.list_movies(data).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.post('/getMovieName', (req, res) => {
  var movie_id = req.body.movie_id;

  movie.getMovieName(movie_id).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.post('/getMovieInfo', (req, res) => {
  var movie_id = req.body.movie_id;
  var movie_name = req.body.movie_name;
  var data={
    movie_id: movie_id,
    movie_name: movie_name
  };
  movie.getMovieInfo(data).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.post('/updateMovieInfo', (req, res) => {
  var movie_id = req.body.movie_id;
  var data = req.body.data;
  if(!movie_id) sendRespond(res, 200, {status: false});
  else{
    data.movie_id = movie_id;
    movie.updateMovie(data).then((result) => {
      sendRespond(res, 200, result);
    })
  }
})


// Schedule

app.post('/selectSchedule', (req, res) => {
  var play_date = req.query.date;
  var play_time = req.query.time;
  var cinema = req.query.cinema;
  var theater = req.query.theater;
  schedule.selectSchedule(play_date, play_time, cinema, theater).then((result) => {
    if(result)
      sendRespond(res, 200, result);
    else
      sendRespond(res, 200, {status:false});
  })
  .catch((error) => {
    Log.error(TAG+"/selectSchedule", error);
  })
})



app.post('/list_schedule', (req, res) => {
  var cinema = req.body.cinema;
  var filter = req.body.filter;
  if(!cinema){
    Log.info(TAG+"load_schedule_cinema", "cinema is undefined.");
    sendRespond(res, 500, {status: false});
  }
  schedule.list_schedule(cinema,filter).then((result) => {
    sendRespond(res, 200, result);
  })
})


// Reservation

app.post('/list_empty_seats', (req, res) => {

})

app.post('/check_seat_available', (req, res) => {
  var date = req.body.date;
  var time = req.body.time;
  var cinema = req.body.cinema;
  var theater = req.body.theater;
  var seat = req.body.seat_num;
  schedule.selectSchedule(date, time, cinema, theater).then((result) => {
    if(result)
      reserve.isSeatAvailable(result, seat).then((isAvailable) => {
        if(isAvailable)
          sendRespond(res, 200, {status:true, isAvailable: true});
        else 
          sendRespond(res, 200, {status:true, isAvailable: false});
      })
    else
      sendRespond(res, 200, {status:false});
  })
  .catch((error) => {
    Log.error(TAG+"check_seat", error);
    sendRespond(res, 200, {status: false});
  })
  
})

app.post('/checkCost', (req, res) => {
  var play_date = req.body.date;
  var play_time = req.body.time;
  var cinema = req.body.cinema;
  var theater = req.body.theater;
  var seat = req.body.seat_num;
  schedule.selectSchedule(play_date, play_time, cinema, theater).then((result) => {
    if(result)
      reserve.checkCost(result, seat).then((result) => {
        sendRespond(res, 200, result);
      })
    else
      sendRespond(res, 200, {status:false});
  })
  .catch((error) => {
    Log.error(TAG+"/checkCost", error);
    sendRespond(res, 200, {status: false});
  })
  
})

app.post('/reservation', (req, res) => {
  var play_date = req.body.date;
  var play_time = req.body.time;
  var cinema = req.body.cinema;
  var theater = req.body.theater;
  var seat_num = req.body.seat_num;
  var user_id = req.body.user;
  console.log("seat_array: "+seat_num);
  if(play_date && play_time && cinema && theater && seat_num && user_id){
    schedule.selectSchedule(play_date, play_time, cinema, theater).then((target) => {
      if(!target) sendRespond(res, 200, {status:false, data:target});
      Log.info(TAG+"reservation", "target found");
      reserve.reserve(user_id, target, seat_num).then((result) => {
        sendRespond(res, 200, result);
      })
    })
    .catch((error) => {
      Log.error(TAG+"main.js", error);
    })
  }
  else
    sendRespond(res, 200, {status: false});
})


app.post('/myReservation', (req, res) => {
  var id = req.body.id;
  reserve.viewMyReservations(id).then((result) => {
    sendRespond(res, 200, result);
  })
})



// Admin

app.post('/admin/addCinema', (req, res) => {
  var cinema = req.body.cinema;

  Admin.addCinema(cinema).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.post('/admin/addDepartment', (req,res)=>{
  var cinema = req.body.cinema;
  var dept = req.body.dept;

  Admin.addDepartment(cinema, dept).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.post('/admin/addEmployee', (req, res) => {
  var id = req.body.id;
  var cinema = req.body.cinema;
  var dept = req.body.department;
  var name = req.body.name;
  var birthday = req.body.birthday;
  var phone = req.body.phone;
  var salary = req.body.salary;

  if(!id || !cinema || !dept || !name)
    sendRespond(res, 200, {status: false});
  
  var data = {
    id: id,
    cinema: cinema,
    dept: dept,
    name: name,
    birthday: birthday,
    phone: phone,
    salary: salary
  }

  Admin.addEmployee(data).then((result) => {
    if(!result) sendRespond(res, 200, {status: false});
    sendRespond(res, 200, result);
  })

})

app.post('/admin/getDepartment', (req, res) => {
  var id = req.body.employee_id;

  if(!id)
    sendRespond(res, 200, {status: false});
  
  else 
    Admin.getDepartment(id).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.post('/admin/setDepartment', (req, res) => {
  var id = req.body.employee_id;
  var cinema = req.body.cinema;
  var dept = req.body.department;

  if(!id)
    sendRespond(res, 200, {status: false});
  else
    Admin.setDepartment(id, cinema, dept).then((result) => {
      sendRespond(res, 200, result);
    })
})

app.post('/admin/setSalary', (req, res) => {
  var id = req.body.employee_id;
  var salary = req.body.salary;

  if(!id)
    sendRespond(res, 200, {status: false});
  else
    Admin.setSalary(id, salary).then((result) => {
      sendRespond(res, 200, result);
    })
})


app.post('/admin/listItem', (req, res) => {
  var cinema = req.body.cinema;
  var dept = req.body.department;

  if(dept != "매점팀")  sendRespond(res, 200, {status: false});
  else{
    Admin.listItem(cinema).then((result) => {
      sendRespond(res, 200, result);
    })
  }

})

app.post('/admin/listItemStocks', (req, res) => {
  var cinema = req.body.cinema;
  var dept = req.body.department;

  if(dept != "매점팀")  sendRespond(res, 200, {status: false});
  else{
    Admin.listItemStocks(cinema).then((result) => {
      sendRespond(res, 200, result);
    })
  }

})





// statistic







app.listen(port, () => {
  console.log(`server is listening at ${host}:${port}`);
})



// TEST 함수

app.get('/backTest', (req, res)=> {
  var cinema = req.query.cinema;
  var dept = req.query.department;

  if(dept != "매점팀")  sendRespond(res, 200, {status: false});
  else{
    Admin.listItem(cinema).then((result) => {
      sendRespond(res, 200, result);
    })
  }
})

app.get('/listMovie', (req, res) => {
  var data = req.query.filter;
  console.log("listMovie executed.");
  
  movie.list_movies(data).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.get('/getMovieInfo', (req, res) => {
  var movie_id = req.query.movie_id;
  var movie_name = req.query.movie_name;
  var data={
    movie_id: movie_id,
    movie_name: movie_name
  };
  movie.getMovieInfo(data).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.get('/dummyData', (req, res) => {
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

})

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

app.get('/hashpassword', (req, res) => {
  var pwd = req.query.pwd;
  var id = req.query.id;

  sendRespond(res, 200, Util.generateHashPassword(pwd, id));
})

app.get('/join_test', (req, res) => {
  var user = req.query.user;
  var pwd = req.query.pwd;
  var name = req.query.name;
  var phone = req.query.phone;
  var birthday = req.query.birthday;
  
  console.log("try to join as "+user + ", "+pwd + " by POST protocol.");

  var data = {
    id: user,
    pwd: pwd,
    name: name|"NuLL",
    phone: phone|"010-0000-0000",
    birthday: birthday
  }

  customerACC.join_customer(data).then((result)=>{
      if(result){
        sendRespond(res, 200, {status: true, text:"success"});
      }
      else{
        sendRespond(res, 200, {status: false, text:"Failed"});
      }

  });
})


app.get('/', (req, res) => {
  var user = req.query.user;
  var pwd = req.query.pwd;
  var query= req.query.query;
  var respond = "";

  console.log("try to login as "+user + ", "+pwd + " by GET protocol.");
  oracledb.getConnection({
      user: user,
      password: pwd,
      host: host, 
      database: database 
    }).then((connection) => {
        console.log("connection executed");
        respond += "Login Succeed!";
        if(query){
          console.log(`Query: ${query}`);
          respond += `Query: ${query}`;
          return connection.execute(query);
        }
        console.log("Query is not received.");
        doRelease(connection);
        console.log("Connection is released.");
    })
    .then((result) => {
      if(!query) {
        console.log("query is undefined.");
        sendRespond(res, 200, {text:respond});
        return;
      }
      else if(!result) {
        console.log("result is undefined.");
        sendRespond(res, 200, {text:respond});
        return;
      }
      sendRespond(res, 200, {text: respond, data: result.rows});
    })
    .catch((err) => {    
      Log.error(TAG+"/", err);
      respond += "error location: 1"
              +`${err.message}`;
      sendRespond(res, 500, {text: respond});
    })
})

app.post('/api', (req, res) => {
  console.log("Req_body: ", req.body);
  var user = req.body.user;
  var pwd = req.body.pwd;
  var query= req.body.query;
  var respond = "";

  console.log("try to login as "+user + ", "+pwd + " by POST protocol.");
  oracledb.getConnection({
      user: user,
      password: pwd,
      host: host, 
      database: database 
    }).then((connection) => {
        console.log("connection executed");
        respond += "Login Succeed!\n";
        if(query){
          console.log(`Query: ${query}`);
          respond += `Query: ${query}`;
          return connection.execute(query);
        }
        console.log("Query is not received.");
        doRelease(connection);
        console.log("Connection is released.");
    }).then((result) => {

      if(!query || !result) {
        console.log("query or result is undefined.");
        sendRespond(res, 200, {text:respond});
        return;
      }
      sendRespond(res, 200, {text: respond, data: result.rows});
    })
    .catch((err) => {    
      Log.error(TAG+"/api", err, query);
      respond += "<p>error location: 1</p>"
              +`<p>${err.message}</p>`;
      sendRespond(res, 500, {text: respond});
    })

});



// Util 함수

function doRelease(connection) {
  connection.release(function (err) {
      if (err) {
          console.error(err.message);
      }
  });
}

function sendRespond(res, status, body) {
  res.status(status).json(body);
  console.log("=========respond is sent: " + body
            + "=========");
}