var sys = require('sys');
var db = require('db-mysql');
var my_http = require('http');
var url = require('url');


//Variables
var port ='8888';
var db_host = 'localhost';
var db_user = 'root';
var db_pass = 'root';
var db_name = 'letspic';
var db_port = '3306';

//Database connection
var cnn = db.createConnection({
  "hostname":db_host,
  "user":db_user,
  "password":db_pass,
  "database":db_name,
  "port":db_port
});

cnn.connect();

//Handle database connection close
cnn.on('close',function(error)){
  if(error){
    console.log('Connection closed unexpectedly!');
  }else{
    cnn.createConnection(cnn.config);
  }
}

//Create server
my_http.createServer(function(req,res){
  var url_params = url.parse(req.url);
  responseTo(req,res);
}).listen(port);

sys.puts("Server is listening on port" + port);

//Reponse
function responseTo(params,res){
  var header = '';
  var body = '';
  var query = params.query;
  //switch params
  switch(params.pathname){
    case "/":
    case "/user":
    case "/user/sendpic"
    case "/user/update/like"
    case "/user/update/message"
    case "/user/message/send"
  }
}

function returnError(res){
  res.writeHeader(header);
  res.write(body);
  res.end();

}

