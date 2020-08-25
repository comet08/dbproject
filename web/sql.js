var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',    // 호스트 주소
  user     : 'root',           // mysql user
  password : 'comet08',       // mysql password
  database : 'project_db'         // mysql 데이터베이스
});

connection.getConnection();
connection.query('SELECT * from test', 
function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
connection.end();