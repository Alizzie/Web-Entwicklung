const sqlite3 = require('sqlite3').verbose();


// open the database
let db = new sqlite3.Database('database.db', (err) => {
  if (err) {
   console.error(err.message); 
 
  }
  console.log('Connected to the database.');
});


// Create guestList Table <- probably not necessary
db.run(`CREATE TABLE IF NOT EXISTS guestList (
    guestList_id INTEGER PRIMARY KEY, 
    name TEXT, 
    date TEXT)`, 
    (err) => {
    if (err) {
      console.error(err.message);
    }
    else
    {
        console.log('GästeListe erstellt');
    }
    
  });


// create seatingPlan Table 
db.run(`CREATE TABLE IF NOT EXISTS seatingPlan (
    seatingPlan_id INTEGER PRIMARY KEY,
    countTables INTEGER, 
    seatsPerTable INTEGER),
    seatsPerSide INTEGER NOT NULL CHECK(seatsPerSide in (1,2)
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
        if(err)
        {
            console.error(err.message); 
            throw err; 
        }
        console.log('Gast table erstellt');    
    }
    ); 

// Veranstaltung erstellen
db.run(`CREATE TABLE IF NOT EXISTS veranstaltungen (
    id INTEGER PRIMARY KEY, 
    name TEXT,
    date TEXT,
    time Integer,
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

// guest 









// print the table
db.all('SELECT * FROM veranstaltungen', [], (err, rows) => {
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
