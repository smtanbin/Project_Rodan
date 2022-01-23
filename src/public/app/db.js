const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "lorian",
  password: "admin",
  database: "lorian"
});
