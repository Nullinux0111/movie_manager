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

app.post('/')


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

app.get('/listMovie', (req, res) => {
  var data = req.query.filter;
  console.log("listMovie executed.");
  
  movie.list_movies(data).then((result) => {
    sendRespond(res, 200, result);
  })
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
    Log.error(TAG+"/selectSchedule", error);
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
      Log.info(TAG+"test", "target found");
      reserve.reserve(user_id, target, seat_num).then((result) => {
        sendRespond(res, 200, result);
      })
    })
  }
  else
    sendRespond(res, 200, {status: false});
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


// statistic







app.listen(port, () => {
  console.log(`server is listening at ${host}:${port}`);
})



// TEST 함수

app.get('/backTest', (req, res)=> {
  var data = req.body.filter;
  console.log("listMovie executed.");
  
  movie.list_movies(data).then((result) => {
    sendRespond(res, 200, result);
  })
})

app.get('/dummyData', (req, res) => {
  var response = ""
  const api = require('./movieAPI');
  api.insertMovieToDB({movieCode: 20210028}).then(
  api.insertMovieToDB({movieCode: 20212015})).then(
  api.insertMovieToDB({movieCode: 20191282})).then(
  api.insertMovieToDB({movieCode: 20212168})).then(
  api.insertMovieToDB({movieCode: 20210611})).then(
  api.insertMovieToDB({movieCode: 20196264})).then(
  api.insertMovieToDB({movieCode: 20205986})).then(
  api.insertMovieToDB({movieCode: 20210087})).then(()=>{
    response += "insert Movie finished \t\n";
  }).then(

  customerACC.join_customer({
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
  })).then(
    
  Admin.addEmployee({
    id: "EMPL",
    name: "직원",
    phone: "010-0000-0101",
    birthday: null,
    cinema: "안산",
    dept: "시설팀",
    salary: null
  })).then((result)=>{
    if(result)
      response += "insert employee finished \t \n";
    else
      response += "insert employee Failed \t \n";
  }).then(
  schedule.insertSchedule({
    play_date: "2021-12-09",
    play_time: "2021-12-09 09:00:00",
    cinema: "안산",
    theater: 1,
    movie_id: "20196264",
    movie_name: "유체이탈자",
    play_type: "day"
  })).then(
  schedule.insertSchedule({
    play_date: "2021-12-09",
    play_time: "2021-12-09 09:00:00",
    cinema: "서울",
    theater: 1,
    movie_id: "20196264",
    movie_name: "유체이탈자",
    play_type: "day"
  })).then(
  schedule.insertSchedule({
    play_date: "2021-12-10",
    play_time: "2021-12-10 09:00:00",
    cinema: "안산",
    theater: 2,
    movie_id: "20210028",
    movie_name: "스파이더맨: 노 웨이 홈",
    play_type: "day"
  })).then(
  schedule.insertSchedule({
    play_date: "2021-12-10",
    play_time: "2021-12-10 09:00:00",
    cinema: "서울",
    theater: 2,
    movie_id: "20210028",
    movie_name: "스파이더맨: 노 웨이 홈",
    play_type: "day"
  })).then(
  schedule.insertSchedule({
    play_date: "2021-12-09",
    play_time: "2021-12-09 13:00:00",
    cinema: "안산",
    theater: 1,
    movie_id: "20210028",
    movie_name: "스파이더맨: 노 웨이 홈",
    play_type: "day"
  })).then(
  schedule.insertSchedule({
    play_date: "2021-12-09",
    play_time: "2021-12-09 13:00:00",
    cinema: "서울",
    theater: 1,
    movie_id: "20196264",
    movie_name: "유체이탈자",
    play_type: "day"
  })).then((result) => {
    response += "insert Movie finished \t\n";
    sendRespond(res, 200, response);
  })


})


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