const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');
const Log = require('./Log');

const customerACC = require('./customer_account');
const reserve = require('./reservation');
const movie = require('./Movie');
const schedule = require('./Schedule');

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
  var user = req.body.user;
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
  if(!id || !pwd){
    Log.info(TAG+"login", "id or pwd is undefined.");
    sendRespond(res, 500, {status: false});
  }

  customerACC.login_customer(id, pwd).then((result) => {
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
  reserve.load_schedule_cinema(cinema,filter).then((result) => {
    sendRespond(res, 200, result);
  })
})


// Reservation

app.post('/reservation', (req, res) => {
  var play_date = req.body.date;
  var play_time = req.body.time;
  var cinema = req.body.cinema;
  var theater = req.body.theater;
  var seat_num = req.body.seat_num;
  var user_id = req.body.user;
  if(play_date && play_time && cinema && theater && seat_num && user_id){
    schedule.selectSchedule(play_date, play_time, cinema, theater).then((target) => {
      if(!target) sendRespond(res, 200, target);
      Log.info(TAG+"test", "target found");
      reserve.reserve(user_id, target, seat_num).then((result) => {
        sendRespond(res, 200, result);
      })
    })
  }
  else
    sendRespond(res, 200, {status: false});
})









app.listen(port, () => {
  console.log(`server is listening at ${host}:${port}`);
})



// TEST 함수

app.get('/backTest', (req, res)=> {
  var play_date = req.query.date;
  var play_time = req.query.time;
  var cinema = req.query.cinema;
  var theater = req.query.theater;
  var seat_num = req.query.seat_num;
  var user_id = req.query.user;
  if(play_date && play_time && cinema && theater && seat_num && user_id){
    schedule.selectSchedule(play_date, play_time, cinema, theater).then((target) => {
      if(!target) sendRespond(res, 200, target);
      Log.info(TAG+"test", "target found");
      reserve.reserve(user_id, target, seat_num).then((result) => {
        sendRespond(res, 200, result);
      })
    })
  }
  else
    sendRespond(res, 200, {status: false});
  
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