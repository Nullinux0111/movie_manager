const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');

const port = process.env.PORT || 3001;
var host = 'localhost';
var database = 'xe';

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`server is listening at ${host}:${port}`);
});


app.get('/', (req, res) => {
  var user = req.query.user;
  var pwd = req.query.pwd;
  var query= req.query.query;
  var respond = "";
  console.log("try to login as "+user + ", "+pwd);
  oracledb.getConnection({
      user: user,
      password: pwd,
      host: host, 
      database: database 
    }).then((connection) => {
        console.log("connection executed");
        respond += "<p>Login Succeed! </p>\n";
        if(query){
          try {
            connection.execute(query).then((result) => {
              console.log(`Query: ${query}`);
              console.log(result.rows);
  
              respond += `<p>Query: ${query}</p>`;
              for( i in result.rows){
                respond+="<br>"
                for(j in result.rows[i]){
                  respond+="\t" + result.rows[i][j];
                }
              }
              res.send({'text': respond});
            })
            .catch((err) => {
              logError(2, err, query);
              respond += "<p>error location: 2</p>"
                      + `<p>query: ${query}</p>`
                      + `<p>${err.message}</p>`;
              res.send({'text': respond});
            })
            
          } catch(e){
            logError(3, e, query);
            respond += "<p>error location: 3</p>"
                    + `<p>query: ${query}</p>`
                    + `<p>${e}</p>`;
            res.send({'text': respond});
          }
        }
        else{
          console.log("Query is not received.");
          res.send({'text': respond}); 
        }
        doRelease(connection);
        console.log("Connection is released.");
        console.log("respond:" + respond);
    })
    .catch((err) => {    
      logError(1, err);
      respond += "<p>error location: 1</p>"
              +`<p>${err.message}</p>`;
      res.send({text: respond});
      console.log("respond:" + respond);
    })
});

app.post('/api', (req, res) => {
  res.send(req.body);
  console.log(req.body);
  console.log("body: ", req.body); 
  console.log("req.query:" + req.query.user);
  var user = req.body.user;
  var pwd = req.body.pwd;
  var query= req.body.query;
  var respond = "";
  console.log("try to login as "+user + ", "+pwd);
  oracledb.getConnection({
      user: user,
      password: pwd,
      host: host, 
      database: database 
    }).then((connection) => {
        console.log("connection executed");
        respond += "<p>Login Succeed!</p>\n";
        res.writeHead(200, { 'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*'
        });
        if(query){
          try{
            connection.execute(query).then((result) => {
              console.log(`Query: ${query}`);
              console.log(result.rows);
  
              respond += `<p>Query: ${query}</p>`;
              for( i in result.rows){
                respond+="<br>"
                for(j in result.rows[i]){
                  respond+="\t" + result.rows[i][j];
                }
              }
              res.send({text: respond});
            })
            .catch((err) => {
              logError(2, err, query);
              respond += "<p>error location: 2</p>"
                      + `<p>query: ${query}</p>`
                      + `<p>${err.message}</p>`;
              res.send({text: respond});
            })
            
          } catch(e){
            logError(3, e, query);
            respond += "<p>error location: 3</p>"
                    + `<p>query: ${query}</p>`
                    + `<p>${e}</p>`;
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.send({text: respond});
          }
        }
        else{
          console.log("Query is not received.");
          res.send({text: respond}); 
        }
        doRelease(connection);
        console.log("Connection is released.");
        console.log("respond:" + respond);
    })
    .catch((err) => {    
      logError(1, err);
      respond += "<p>error location: 1</p>"
              +`<p>${err.message}</p>`;
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.send({text: respond});
      console.log("respond:" + respond);
    })
});


function doRelease(connection) {
  connection.release(function (err) {
      if (err) {
          console.error(err.message);
      }
  });
}

function logError(num, error, query){
  if(num){
    console.log(`error location: ${num}`);
  }
  if(query){
    console.log("Query: " + query);
  }
  console.error(error);
}