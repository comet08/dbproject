var express = require('express');
var app = express();
var router = require('./routes/main')(app);
//var dbconfig = require('./routes/db.js');
const mysql = require("mysql");
var bodyParser = require('body-parser');
var async = require('async');
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.json());

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})

var connection = mysql.createConnection({

  user : 'root',

  password : 'comet08',
  port: 3307,
  database : 'project_db'
  });

app.use(express.static('public'));
connection.connect();






app.get('/register', function(req, res){
    var id = req.query.id;
    var pw = req.query.pw;
    var name = req.query.name;
    var tel = req.query.tel;
    var address = req.query.address;
    var address_add = req.query.address_add;
    address = address+" "+address_add;

    var crop = req.query.crop;
    var area = req.query.width;
    connection.query(`insert into user values('${id}','${name}','${pw}','${tel}','${address}','${crop}','${area}')`, function(err, rows){
      if(err)
        console.log(err);
      else{
      console.log("회원가입완료");
      res.render('login.html');
      }
    })
})

const session = require('express-session');
app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

//로그인-로그아웃버튼
app.get('/test', function(req, res){
  if(req.session.userid){
     res.send(true);
  } 
})

// 유저 페이지
app.get('/user', function(req, res) {
  let content;
  if(req.session.userid){
    console.log(req.session.userid)
    connection.query(`select * from user where user.id = '${req.session.userid}'`, function(err, rows){
      if(err)
        console.log(err);
      else{
        console.log(req.session.userid);
        res.send(rows);
      }})
  }
  else{
    console.log("로그아웃상태");
    var s = false;
    res.send(s);
  }
}
)

// 로그인 GET
app.get('/login', function(req, res, next) {
    let session = req.session;
    let content;
    if(session.userid){
      content = `<h3>${session.name}님 안녕하세요. 로그인에 성공하셨습니다 ~</h3>
      <form action="/logout" method="get">
          <input type="submit" value="로그아웃">
      </form>`;
      res.send(content);
    }
});
   
  
  // 로그인 POST
app.post("/login", async function(req,res,next){
  let body = req.body;
  let inputPassword = body.pw;
  let inputId = body.id;
  
  connection.query(`select * from user where user.id = '${inputId}'`, function(err, rows, fields){
    if(err)
      console.log(err);
    else{
      let dbPassword = rows[0].pw;
    if(dbPassword == inputPassword){
      console.log("비밀번호 일치");
      req.session.id = inputId;
      req.session.name = rows.name;
      req.session.userid = inputId;
      console.log(req.session.userid);
      res.redirect("index.html");
    }
    else{
      console.log("비밀번호 불일치");
      res.redirect("/login");
    }
  }})
});

//관리자 로그인
app.post("/adminlogin", async function(req,res,next){
  let body = req.body;
  let inputPassword = body.adminpw;
  let inputId = body.adminid;
  console.log("머지")
  connection.query(`select * from admin where admin.id = '${inputId}'`, function(err, rows, fields){
    if(err)
      console.log(err);
    else{
      let dbPassword = rows[0].pw;
    if(dbPassword == inputPassword){
      console.log("비밀번호 일치");
      req.session.id = inputId;
      req.session.userid = inputId;
      req.session.auth = "1";
      console.log(req.session.userid);
      res.redirect("adminm4.html");
    }
    else{
      console.log("비밀번호 불일치");
      res.redirect("/adminlogin");
    }
  }})
});

  
//로그아웃
app.get("/logout", function(req,res,next){
    req.session.destroy();
    res.clearCookie('sid');
    res.render("login.html");
});


//수확신고
app.get("/areg", function(req,res,next){
  var crop = req.query.cropname;
  var width = req.query.width;
  var date = new Date();
  if(req.session.userid){
    var day = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    var uid = req.session.userid;
    connection.query(`insert into harvesting(uid, crop, width, date) values('${uid}','${crop}','${width}','${day}')`, function(err, rows){
      if(err)
        console.log(err);
      else{
      console.log("수확신고완료");
      res.render('1-3.html');
      }
    })
  }
  else
    res.render("login.html");

});


//수확신청현황
app.get('/showAreg', function(req, res){
  if(req.session.id){
    connection.query(`select * from harvesting where harvesting.uid='${req.session.userid}'`, function(err, rows){
      console.log(rows);
      res.send(rows);
    })
  }
})

//파종신청
app.get('/sowing', function(req, res){
  if(req.session.userid){
    var uid = req.session.userid;
    var crop = req.query.cropname;
    var width = req.query.sowingwidth;
    var address = req.query.sowingaddress;
    var day = new Date();
    day = day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();

    let myaddress = new String(address).split(" ");
    myaddress = myaddress[0]+" "+myaddress[1];
    let check = 0;
    let allwidth=0;
    connection.query(`select width from sowing_width where address ='${myaddress}' and crop='${crop}'`, function(err, rows){
      if(err){
        console.log(err);
      }
      if(rows.length == 0){
        check = 1;
      }
      else
        allwidth = rows[0].width;
      allwidth = eval(`${allwidth} + ${width}`);

      if(check == 0){
        connection.query(`update sowing_width set width='${allwidth}' where crop='${crop}'and address='${myaddress}'`, function(err, rows){
          if(err){
            console.log(err);
          }
        })
      }
        else{
       
        connection.query(`insert into sowing_width(address, width, crop) values('${myaddress}','${allwidth}','${crop}')`, function(err, rows){
          if(err)
            console.log(err);

        })
      }
    })
    

    connection.query(`insert into sowing(uid, crop, width, address, reg_date) values('${uid}','${crop}','${width}','${address}','${day}')`, function(err, rows){
     
      res.render("4-2.html")
    })
  }
  else
    res.render("login.html");
})

//사용자 파종신고 조회
app.get('/showsowing', function(req, res){
  if(req.session.userid){
    connection.query(`select * from sowing where sowing.uid='${req.session.userid}'`, function(err, rows){
      res.send(rows);
    })
  }
  else
    res.render("login.html");
})

//농작물 종류 선택 셀렉터

app.get('/selectkind', function(req, res){
    connection.query(`select distinct class from kind`, function(err, rows){
      res.send(rows);
    })
  }
)

app.post('/selectedkind', function(req, res){
    var cropclass = req.body.cropclass;
    connection.query(`select name from kind where kind.class='${cropclass}'`, function(err, rows){
      res.send(rows);
    })
  }
)


//신청현황조회
app.post('/showreg', function(req, res){

  var cropname = req.body.cropname;
  console.log(cropname)
  var tasks = [
    function(callback){
  
  connection.query(`select * from kind where kind.name='${cropname}'`, function(err, rows){
    callback(null, rows);
  })
},
  function(callback){
   
  connection.query(`select * from sowing_width where crop='${cropname}'`, function(err, rows){
    callback(null, rows);
  })
  }];
  async.series(tasks, function(err,results){
    res.json(results);
  })
}

)


app.post('/mylog', function(req, res){

  var crop = req.body.crop;
  var keyword = req.body.keyword;
  var real_date = req.body.real_date;
  var address = req.body.address;
  var value = req.body.value;
  var des = req.body.des;
  var uid = req.session.userid;
  var date = new Date();
  var day = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();

  connection.query(`insert into log(crop,keyword,address,reg_date,real_date,value,des,uid) values('${crop}', '${keyword}', '${address}', '${day}', '${real_date}', '${value}', '${des}','${uid}')`, function(err, rows){

  })
  connection.query(`select * from log where uid='${req.session.userid}'`, function(err,rows){
    res.json(rows);

  });
}

)

app.get('/showlog', function(req,res){
  connection.query(`select * from log where uid='${req.session.userid}'`, function(err,rows){
    res.json(rows);

  });
}
)

//허가를 위한 목록
app.get('/forpermit', function(req,res){
  connection.query(`select * from sowing where permit_date is NULL`, function(err,rows){
    res.json(rows);

  });
}
)

//허가 검색
app.post('/searchpermit', function(req,res){
  var crop = req.body.crop;
  connection.query(`select * from sowing where crop="${crop}" and permit_date is NULL`, function(err,rows){
    res.json(rows);
    
  });
}
)

//허가
app.post('/permit', function(req,res){
  var ids = req.body.myid;
  let ar = [];
  if(ids > 0){
    ar.push(ids);
    ids = ar;
  }
  console.log(ids);
  let date = new Date();
  var day = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
 
  for(let i = 0; i < ids.length; i++){
    connection.query(`update sowing set permit_date="${day}" where id = "${ids[i]}"`, function(err,rows){
      //console.log(rows);
    });
    connection.query(`insert into adminLog(id,permit_date,sid) values("${req.session.userid}","${day}","${ids[i]}")`, function(err,rows){
   
    });
  }
  res.render("adminm2.html");
}
)

app.post('/searchlog', function(req, res){

  var crop = req.body.selectcrop;
  var keyword = req.body.selectkey;
  var date = req.body.selectdate;
  var m="";
  console.log(crop);
  if(crop)
    m+=`crop='${crop}'`;
  if(keyword)
    m+=` keyword='${keyword}'`;
  if(date)
    m+=`real_date='${date}'`;

  console.log(m);
  connection.query(`select * from log where uid='${req.session.userid}' and ${m}`, function(err,rows){
    res.json(rows);
    console.log(rows);
  });
}

)

//농작지 정보 추가!
app.post('/addaddress', function(req,res){
  let add = req.body.address;
  let width = req.body.width;
  let address, area;
  connection.query(`select address, area from user where id='${req.session.userid}'`, function(err,rows, fields){
    console.log(rows);
    address = rows[0].address;
    area = rows[0].area;
    area=area+","+width;
    address = address+","+add;
    connection.query(`update user set area="${area}", address="${address}" where id='${req.session.userid}'`, function(err,rows){
      
      res.render("m4.html");
    });
  });
}
)
//관리자 로그파일

app.get('/adminlog', function(req, res){
  connection.query(`select * from adminLog, sowing where adminLog.id='${req.session.userid}' and adminLog.sid=sowing.id`, function(err,rows){
    res.json(rows);
  });
});

app.post('/searchdata', function(req, res){
  let crop = req.body.crop;
  connection.query(`select * from datas where crop = "${crop}"`, function(err,rows){
    res.json(rows);
  });
});


