var sys = require('sys');
var db = require('mysql');
var my_http = require('http');
var url = require('url');
var sendpic = require('./sendpic');

/* Variables */
var port ='8888';
var db_host = 'localhost';
var db_user = 'root';
var db_pass = '';
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
cnn.on('close',function(error){
  if(error){
    console.log('Connection closed unexpectedly!');
  }else{
    cnn.createConnection(cnn.config);
  }
});

/*Create server*/
my_http.createServer(function(req,res){
  sys.puts('Request received!');
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
      sys.puts('Index');
      returnSuccess(res);
      break;
      
    case "/user":
      sys.puts('/User');
      break;
    case "/user/send/pic":
      /*if is post request*/
      if (req.method.toLowerCase() == 'post'){
        uploadFile(req,res);
      }
      break;
    case "/user/like/pic":
      query = url_params.query;
      likeAPicture(query["user_id"],query["pic_id"],res);
      break;
    /*case "/user/update/message":
    case "/user/send/message":
    case "/user/get/friends":*/
  }
}

function getUserInfo(id){
  var result = {};
  var query = "SELECT * FROM tbl_users ";
  query += "WHERE ID = " + db.escape(id);

  cnn.query(query,function(error,rows,fields){
    if(error) throw "ERROR";
    
    /*get the result*/
    data = rows[0];
    result["facebook_id"] = data['facebook_id'];
    result["nationality"] = data['nationality'];
    result["gender"] = data['gender'];
  });

  return JSON.stringify(result);
}

function getFriendsList(id,limit_number){
  //get user from different countries
  var user = JSON.parse(getUserInfo(id));
  var result = '';
  var result = {};
  var query = "SELECT * FROM tbl_users ";
  query += "WHERE ID = " + db.escape(id) + " ";
  query += "AND country <> " + user["nationality"] + " "; /*set different coutries*/
  query += "ORDER BY RAND() LIMIT " + limit_number;
  cnn.query(query,function(error,rows,fields){
    if(error) throw "ERROR";
    result = rows;
  });
  
  return JSON.stringify(result);
}

function makeFriendWith(user_id,friend_id){
  
}

function sendMessage(user_id,friend_id,message){
  /*send message from user to friend*/

  /*add updates to friend's updates*/
  
  /*add updates to user's updates*/
}

function likeAPicture(user_id,pic_id,res){/*作成中*/
  var query = '';
  
  /*save in to tbl_pics*/
  var result = {};
  var query = "UPDATE tbl_pics ";
  query +="SET liked = " + db.escape('1');
  query += "WHERE ID = " + db.escape(pic_id);

  cnn.query(query,function(error,rows,fields){
    if(error) throw "ERROR";
    else{
      //add updates to user
      info = {};
      info["pic_id"] = pic_id;
      info["friend_id"] = user_id;
      if(addUpdates(user_id,'pic',JSON.stringify(info))){
        returnSuccess(res);
      }else{
        returnError(res);
      }
    } 
  });
}

function addUpdates(user_id,_type,_info){/*作成中*/
  /*save in to tbl_user_id_updates*/
  var result = {};
  var post = {type:_type, info:_info, checked: '0', init_date: now() };
  var query = "INSERT INTO tbl_user_" + db.escape(user_id) + "_updates ";
  query +="SET ? "
  query += "WHERE ID = " + db.escape(pic_id);

  cnn.query(query,post,function(error,rows,fields){
    if(error){
      return false;
    }
    else{
      return true;
    } 
  });
}


function userRegistration(facebook_id,nationality,gener){
  var query = '';
  query = "INSERT IGNORE INTO tbl_users (FacebookID, country, sex) VALUES (";
  query += db.escape(facebook_id) + ", '";
  query += db.escape(nationality) + "', '";
  query += db.escape(gener) + "');";
  cnn.query(query,function(error,fields){
    if(error) throw "ERROR";
  });
  
}

function returnError(res){
  res.writeHeader(404,{"Content-Type":"text/plain"});
  res.write('Not found');
  res.end();
}

function returnSuccess(res){
  res.writeHead(200, {'content-type': 'text/plain'});
  res.write('OK');
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
    returnSuccess(res);
  });

  form.parse(req, function(err,fields,files){
    returnSuccess(res);
  });

  return;
}

