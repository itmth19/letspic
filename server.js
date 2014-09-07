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

var upload_dir = '/pics';
var pic_name = '[sender]_[receiver]_[date].jpg';

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
   responseTo(req,res);
}).listen(port);

sys.puts("Server is listening on port" + port);

//Reponse
function responseTo(req,res){
  var header = '';
  var body = '';
  var url_params = url.parse(req.url);
  var query = url_params.query;


  //switch params
  switch(url_params.pathname){
    case "/":
    case "/user":
    case "/user/sendpic":
      uploadFile(req,res);
    case "/user/update/like":
    case "/user/update/message":
    case "/user/message/send":
  }
}

function returnError(res){
  res.writeHeader(404,{"Content-Type":"text/plain"});
  res.write('Not found');
  res.end();
}

function uploadFile(req,res){
  //upload file code
  var form = new formidable.IncomingForm();
  form.uploadDir = upload_dir;

  form.on('error',function(error){
    
  });

  form.parse(req, function(err,fields,files){
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('OK');
    res.end();
  });

  form.on('end',function(error){
    
  });

  return;
}

