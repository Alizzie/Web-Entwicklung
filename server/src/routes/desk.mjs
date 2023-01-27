import express from 'express';
import { db } from '../database.mjs';
// import { db } from '../database.mjs';

export const deskRouter = express.Router();

deskRouter.post('/', (request, response) => {
  const body = request.body;

  const sqlStmtDesk = 'INSERT OR REPLACE INTO desk(id, deskIndex) VALUES(?, ?)';
  const sqlStmtGuestAtTable = 'INSERT OR REPLACE INTO guestAtDesk(guest_id, guestPosition, id, deskIndex) VALUES(?, ?, ?, ?)';

  for (let deskIndex = 0; deskIndex < body.numOfTables; deskIndex++) { // Iterating for every Table
    const deskData = [body.veranstaltungId, deskIndex];
    db.run(sqlStmtDesk, deskData, error);

    for (let posInsideTable = 0; posInsideTable < body.numOfSeatsperTable; posInsideTable++) { // Adding all Guests to their Table
      const pos = posInsideTable + deskIndex * body.numOfSeatsperTable;
      const guestAtDeskData = [body.guestIdAtTable[pos], posInsideTable, body.veranstaltungId, deskIndex];
      db.run(sqlStmtGuestAtTable, guestAtDeskData, error);
    }
  }
});

// countTables,seatsPerTable,seatsPerSide
deskRouter.get('/tableNumbers/:id', (request, response) => {
  const sqlStmt = 'SELECT countTables, seatsPerTable, seatsPerSide FROM seatingPlan WHERE seatingPlan_id = (SELECT veranstaltungen.seatingPlan_id FROM veranstaltungen WHERE veranstaltungen.id = ?)';
  db.get(sqlStmt, request.params.id, (err, row) => {
    if (err) {
      console.log(err.message);
    }
    response.json(row);
  });
});

deskRouter.get('/:id', (request, response) => {
  const sqlStmt = 'SELECT guests.guest_id, guestPosition, guestAtDesk.id, deskIndex, name FROM guestAtDesk LEFT JOIN guests ON guestAtDesk.guest_id = guests.guest_id WHERE guestATDesk.id = ? ORDER BY deskIndex ASC, guestPosition ASC';
  db.all(sqlStmt, request.params.id, (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log(rows);
    response.json(rows);
  });
});

function error (err) {
  if (err) {
    console.log(err.message);
  }
}
