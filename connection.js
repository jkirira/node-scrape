const mysql = require("mysql")

const connection = mysql.createConnection({
    host: "192.168.56.56",
    user: "homestead",
    port:3306,
    password: "secret",
    database: "jobmag"
})

connection.connect((err) => {
    
    if(err) throw err;
    else console.log("MySql Connected")
})

// connection.query(
//     'SELECT tables',
//     function(err, results, fields) {
//       console.log(results); // results contains rows returned by server
//       console.log(fields); // fields contains extra meta data about results, if available
//       console.log(err); // fields contains extra meta data about results, if available
//     }
//   );

module.exports = connection