const sqlite3 = require('sqlite3').verbose();

console.log("Begin"); 
// open the database
let db = new sqlite3.Database('mydb.db', (err) => {
  if (err) {
   console.error(err.message); // throw Error
   throw err; 
  }
  console.log('Connected to the database.');
});

// create a table
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Table created');
});

// insert a row
db.run('INSERT INTO users (name, email) VALUES (?, ?)', ['John', 'john@example.com'], function(err) {
  if (err) {
    console.error(err.message);
  }
  console.log(`A row has been inserted with rowid ${this.lastID}`);
});

// print the table
db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});

// close the database connection
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});

module.exports = db; 