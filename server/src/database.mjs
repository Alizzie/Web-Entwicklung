import sqlite3 from 'sqlite3';

// open and connect to the database
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

// Create Veranstalter Table
db.run(`CREATE TABLE IF NOT EXISTS veranstalter (
    veranstalter_id INTEGER,
    name TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE,
    PRIMARY KEY(email,veranstalter_id)
  )`,
(err) => {
  if (err) {
    console.error(err.message);
  }
});

// Create guestList Table
db.run(`CREATE TABLE IF NOT EXISTS guestList (
    guestList_id INTEGER,  
    guest_id INTEGER,
    PRIMARY KEY(guestList_id,guest_id),
    FOREIGN KEY(guest_id) REFERENCES guests(guest_id)
    )`,
(err) => {
  if (err) {
    console.error(err.message);
  }
});

// create seatingPlan Table
db.run(`CREATE TABLE IF NOT EXISTS seatingPlan (
    seatingPlan_id INTEGER PRIMARY KEY,
    countTables INTEGER, 
    seatsPerTable INTEGER,
    seatsPerSide INTEGER NOT NULL CHECK(seatsPerSide in (1,2))
    )`,
(err) => {
  if (err) {
    console.error(err.message);
  }
});

// Create guest Table
db.run(`CREATE TABLE IF NOT EXISTS guests (
    guest_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    child INTEGER NOT NULL CHECK (child IN (0, 1)),
    invitation_status TEXT NOT NULL CHECK(invitation_status IN ('unbekannt', 'eingeladen', 'zugesagt', 'abgesagt'))
    )`,
(err) => {
  if (err) {
    console.error(err.message);
  }
}
);

// One event has one event manager, an event manager is also an guest that CAN be listed in the guest list
// guest_id represents the event manager
// name and date is stored as a text in a subset of the ISO-8601 format,

db.run(`CREATE TABLE IF NOT EXISTS veranstaltungen (
    id INTEGER PRIMARY KEY, 
    name TEXT,
    date TEXT,
    time TEXT,
    guestList_id INTEGER, 
    seatingPlan_id INTEGER, 
    veranstalter_id INTEGER,
    FOREIGN KEY(guestList_id) REFERENCES guestList(guestList_id),
    FOREIGN KEY(seatingPlan_id) REFERENCES seatingPlan(seatingPlan_id),
    FOREIGN KEY(veranstalter_id) REFERENCES veranstalter(veranstalter_id)
    )`,
(err) => {
  if (err) {
    console.error(err.message);
  }
});

// Beispieldatensätze
// GUEST TABLE: guest_id (begins with 0), name, child, invitation_status
/*
const stmt = `INSERT INTO guests(guest_id, name, child, invitation_status) VALUES(?, ?, ?, ?)`;
db.run(stmt,[1, 'Hans Honig', 0, 'eingeladen']);
db.run(stmt,[2, 'Peter Lustig', 1 , 'zugesagt']);
db.run(stmt,[3, 'Hannah Hatschi', 0, 'zugesagt']);
db.run(stmt,[4, 'John Doe', 0, 'unbekannt']);
db.run(stmt,[5, 'Peter unlustig', 0, 'abgesagt']);

// GUEST LIST: guestList_id (begins with 1),  guest_id
const stmt2 = `INSERT INTO guestList(guestList_id, guest_id) VALUES(?, ?)`;
db.run(stmt2,[11,1]);
db.run(stmt2,[11,2]);
db.run(stmt2,[11,3]);
db.run(stmt2,[12,4]);
db.run(stmt2,[12,5]);

// SEATING PLAN:  seatingPlan_id (begins with 2), countTables, seatsPerTable, seatsPerSide E {1,2}
const stmt3 = `INSERT INTO seatingPlan(seatingPlan_id, countTables, seatsPerTable, seatsPerSide) VALUES(?, ?, ?, ?)`;
db.run(stmt3,[21,15,5,1]);
db.run(stmt3,[22,20,4,2]);
db.run(stmt3,[23,100,10,2]);

// VERANSTALTER: veranstalter_id (begins with 3),email,name,password,
const stmt5 = `INSERT INTO veranstalter(veranstalter_id, email, name,password) VALUES(?, ?, ?, ?)`;
db.run(stmt5,[31,'root@root.com','root','root']);

// VERANSTALTUNGEN: id, name, date, time, guestList_id,seatingPlan_id , guest_id
const stmt6 = `INSERT INTO veranstaltungen(id, name, date,time,guestList_id,seatingPlan_id,veranstalter_id) VALUES(?, ?, ?, ?, ?, ?, ?)`;
db.run(stmt6,[41,"Hochzeit 31",31122022,2000,11,23,31]);
*/

// Example of an print statement
// const exampleSTMT = 'SELECT * FROM guestList gL JOIN guests g on gL.guest_id = g.guest_id';

db.all('select * from veranstalter ', [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});

export { db };

// close the database connection
/*
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});
*/
