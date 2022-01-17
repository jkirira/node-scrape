const mysql = require("mysql")

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    port:3307,
    password: "root",
    database: "myjobmag"
})

connection.connect((err) => {
    
    if(err) throw err;
    else 
    console.log("MySql Connected")
})

connection.query(
    'SELECT tables',
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
      console.log(err); // fields contains extra meta data about results, if available
    }
  );

module.exports = connection