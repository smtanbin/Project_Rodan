


con.connect((err) => {
  if (err) throw err;
  con.query("SELECT * FROM INIT", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});