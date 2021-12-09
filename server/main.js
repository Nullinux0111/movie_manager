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

  if(dept != "매점팀" && dept != "관리자" )  sendRespond(res, 200, {status: false});
  else{
    Admin.listItem(cinema).then((result) => {
      sendRespond(res, 200, result);
    })
  }

})

app.post('/admin/listItemStocks', (req, res) => {
  var cinema = req.body.cinema;
  var dept = req.body.department;

  if(dept != "매점팀" && dept != "관리자" )  sendRespond(res, 200, {status: false});
  else{
    Admin.listItemStocks(cinema).then((result) => {
      sendRespond(res, 200, result);
    })
  }

})


app.post('/admin/listMaterial', (req, res) => {
  var cinema = req.body.cinema;
  var dept = req.body.department;

  if(dept != "시설팀" && dept != "관리자" )  sendRespond(res, 200, {status: false});
  else{
    Admin.listMaterial(cinema).then((result) => {
      sendRespond(res, 200, result);
    })
  }
})

app.post('/admin/listEmployee', (req, res) => {
  var cinema = req.body.cinema;
  var dept = req.body.department;
  var filter = req.body.filter;
  if(dept != "인사팀" && dept != "관리자" ) sendRespond(res, 200, {status: false});
  else{
    Admin.listEmployee(filter).then((result)=>{
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


app.get('/dummyData', (req, res) => {
  const init = require('./init.js');
  init.dummyData(res);
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