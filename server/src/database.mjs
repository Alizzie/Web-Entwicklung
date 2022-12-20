import sqlite3 from 'sqlite3';

// open and connect to the database
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
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
  } else {
    console.log('GästeListe erstellt');
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
  console.log('Sitzplan erstellt');
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
  console.log('Gast table erstellt');
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
    guest_id INTEGER,
    FOREIGN KEY(guestList_id) REFERENCES guestList(guestList_id),
    FOREIGN KEY(seatingPlan_id) REFERENCES seatingPlan(seatingPlan_id),
    FOREIGN KEY(guest_id) REFERENCES guests(guest_id)
    )`,
(err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Veranstaltungen erstellt');
});

// Beispieldatensätze
// GUEST TABLE: guest_id name child invitation_status
/*
const stmt = `INSERT INTO guests(guest_id, name, child, invitation_status) VALUES(?, ?, ?, ?)`;
db.run(stmt,[01, 'Hans Honig', 0, 'eingeladen']);
db.run(stmt,[02, 'Peter Lustig', 1 , 'zugesagt']);
db.run(stmt,[03, 'Hannah Hatschi', 0, 'zugesagt']);
db.run(stmt,[04, 'John Doe', 0, 'unbekannt']);
db.run(stmt,[05, 'Peter unlustig', 0, 'abgesagt']);

// GUEST LIST: guestList_id ,  guest_id
const stmt2 = `INSERT INTO guestList(guestList_id, guest_id) VALUES(?, ?)`;
db.run(stmt2,[11,01]);
db.run(stmt2,[11,02]);
db.run(stmt2,[11,03]);
db.run(stmt2,[12,04]);
db.run(stmt2,[12,05]);

// SEATING PLAN:  seatingPlan_id, countTables, seatsPerTable, seatsPerSide E {1,2}
const stmt3 = `INSERT INTO seatingPlan(seatingPlan_id, countTables, seatsPerTable, seatsPerSide) VALUES(?, ?, ?, ?)`;
db.run(stmt3,[21,15,5,1]);
db.run(stmt3,[22,20,4,2]);
db.run(stmt3,[23,100,10,2]);

// VERANSTALTUNGEN: id, name, date, time, guestList_id,seatingPlan_id , guest_id
const stmt4 = `INSERT INTO veranstaltungen(id, name, date,time,guestList_id,seatingPlan_id,guest_id) VALUES(?, ?, ?, ?, ?, ?, ?)`;
db.run(stmt4,[31,"Hochzeit 31",31122022,2000,11,23,01]) */

// print the table

// Example of an print statement
db.all('SELECT * FROM guestList gL JOIN guests g on gL.guest_id = g.guest_id ', [], (err, rows) => {
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
