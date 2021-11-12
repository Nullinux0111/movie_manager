const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');
var app = express();
var host = 'localhost';
var port = 3001;
var database = 'xe';

app.use(bodyParser.json());
app.use(cors());


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
      console.log(result.rows);
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
      res.send({text: respond, data: result.rows});
    })
    .catch((err) => {    
      logError(1, err);
      respond += "error location: 1"
              +`${err.message}`;
      sendRespond(res, 500, {text: respond});
    })
});

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
      console.log(result.rows);
      
      if(!query || !result) {
        console.log("query or result is undefined.");
        sendRespond(res, 200, {text:respond});
        return;
      }
      sendRespond(res, 200, {text: respond, data: result.rows});
    })
    .catch((err) => {    
      if(query) logError(2, err, query);
      else logError(1, err);
      respond += "<p>error location: 1</p>"
              +`<p>${err.message}</p>`;
      sendRespond(res, 500, {text: respond});
    })
  
});


app.listen(port, () => {
  console.log(`server is listening at ${host}:${port}`);
})


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

function logError(num, error, query){
  var date = new Date();
  console.log(date.getDate() + "일 " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()+"."+Date.now()%1000);
  if(num){
    console.log(`error location: ${num}`);
  }
  if(query){
    console.log("Query: " + query);
  }
  console.error("logError:"+error);
  console.error("logError ended");
}