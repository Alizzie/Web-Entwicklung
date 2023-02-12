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
    PRIMARY KEY(veranstalter_id)
  )`,
(err) => {
  if (err) {
    console.error(err.message);
  }
});

// Create guestList Table
db.run(`CREATE TABLE IF NOT EXISTS guestList (
    guestList_id INTEGER PRIMARY KEY
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
    guest_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL,
    child INTEGER NOT NULL CHECK (child IN (0, 1)), 
    invitation_status TEXT NOT NULL CHECK(invitation_status IN ('Unknown', 'Invited', 'Accepted', 'Declined')),
    guestList_id INTEGER,
    FOREIGN KEY(guestList_id) REFERENCES guestList(guestList_id)
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
    seatingPlan_id INTEGER , 
    veranstalter_id INTEGER,
    FOREIGN KEY(guestList_id) REFERENCES guestList(guestList_id) ON DELETE CASCADE,
    FOREIGN KEY(seatingPlan_id) REFERENCES seatingPlan(seatingPlan_id) ON DELETE CASCADE,
    FOREIGN KEY(veranstalter_id) REFERENCES veranstalter(veranstalter_id)
    )`,
(err) => {
  if (err) {
    console.error(err.message);
  }
});

// Create desk (table) Table
db.run(`CREATE TABLE IF NOT EXISTS desk (
  id INTEGER, 
  deskIndex INTEGER,
  FOREIGN KEY(id) REFERENCES veranstaltungen(id) ON DELETE CASCADE,
  PRIMARY KEY(id,deskIndex)
  )`,
(err) => {
  if (err) {
    console.error(err.message);
  }
}
);

db.run(`CREATE TABLE IF NOT EXISTS guestAtDesk (
  guest_id INTEGER,
  guestPosition INTEGER, 
  id INTEGER,
  deskIndex INTEGER,
  FOREIGN KEY(id, deskIndex) REFERENCES desk(id, deskIndex),
  FOREIGN KEY(guest_id) REFERENCES guests(guest_id) ON DELETE SET NULL,
  PRIMARY KEY(id,guestPosition,deskIndex)
  )`,
(err) => {
  if (err) {
    console.error(err.message);
  }
}
);

export { db };
