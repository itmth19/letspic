var sys = require('sys');
var db = require('db-mysql');
var my_http = require('http');
var url = require('url');
var sendpic = require('./sendpic');

/* Variables */
var port ='8888';
var db_host = 'localhost';
var db_user = 'root';
var db_pass = 'root';
var db_name = 'letspic';
var db_port = '3306';

var upload_dir = '/pics';
var pic_name = '[sender]_[receiver]_[date].jpg';

/*Database connection*/
var cnn = db.createConnection({
  "hostname":db_host,
  "user":db_user,
  "password":db_pass,
  "database":db_name,
  "port":db_port
});

cnn.connect();

/*Handle database connection close*/
cnn.on('close',function(error)){
  if(error){
    console.log('Connection closed unexpectedly!');
  }else{
    cnn.createConnection(cnn.config);
  }
}

/*Create server*/
my_http.createServer(function(req,res){
   responseTo(req,res);
}).listen(port);

sys.puts("Server is listening on port" + port);

/*Reponse*/
function responseTo(req,res){
  var header = '';
  var body = '';
  var url_params = url.parse(req.url);
  var query = url_params.query;


  /*switch params*/
  switch(url_params.pathname){
    case "/":
    case "/user":
    
    case "/user/send/pic":
      /*if is post request*/
      if (req.method.toLowerCase() == 'post'){
        uploadFile(req,res);
      }
    case "/user/like/pic":
    case "/user/update/message":
    case "/user/send/message":
    case "/user/get/friends"
  }
}

function getUserInfo(id){
  var query = "";
  cnn.query(query,function(error,rows,fields){
    if(error) throw error;
    for(var i in rows){
      console.log(rows[i].id);
    }
  });
}

function getFriendsList(user_id){
  //get user from different countries
  var query = "";
  cnn.query(query,function(error,rows,fields){
    if(error) throw error;
    for(var i in rows){
      console.log(rows[i].id);
    }
  });
}

function sendMessage(user_id,friend_id,message){
  /*send message from user to friend*/

  /*add updates to friend's updates*/
  
  /*add updates to user's updates*/
}

function likeAPicture(user_id,pic_id){
  var query = '';
  
  /*save in to tbl_pics*/

  /*updates the user_id_updates */

  /*check if there are 2 likes => add to friend list*/
}

function userRegistration(facebook_id,nationality,gener){
  /*updates tbl_users table*/

  /*create user's updates table*/
}

function returnError(res){
  res.writeHeader(404,{"Content-Type":"text/plain"});
  res.write('Not found');
  res.end();
}

function uploadFile(req,res){
  /*upload file code*/
  var form = new formidable.IncomingForm();
  form.uploadDir = upload_dir;

  form.on('error',function(error){
    res.writeHeader(404,{"Content-Type":"text/plain"});
    res.write('ERROR');
    res.end();
  });

  /*override the events when finish uploading*/
  form.on('end',function(error){
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('OK');
    res.end();
  });

  form.parse(req, function(err,fields,files){
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('Finished');
    res.end();
  });

  return;
}

