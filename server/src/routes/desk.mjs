import express from 'express';
import { db } from '../database.mjs';
// import { db } from '../database.mjs';

export const deskRouter = express.Router();

// desk: id , deskIndex // guestAtDesk guestId,guestPosition,id, deskIndex
deskRouter.post('/', (request, response) => {
  const body = request.body;
  const sqlStmt = 'INSERT OR REPLACE INTO guestAtDesk(guest_id, guestPosition, id, deskIndex) VALUES(?, ?, ?, ?)';
  const sqlStmt1 = 'INSERT INTO desk(id, deskIndex) VALUES(?, ?)';
  console.log(body);
  for (let deskIndex = 0; deskIndex < body.numOfTables; deskIndex++) {
    const deskData = [body.veranstaltungId, deskIndex];
    db.run(sqlStmt1, deskData, error);
    const offset = deskIndex * body.numOfSeatsperTable;

    for (let deskPosition = offset; deskPosition < offset + body.numOfSeatsperTable; deskPosition++) {
      const guestAtDeskData = [request.body.guestIdAtTable[deskPosition], deskPosition % 4, body.veranstaltungId, deskIndex];
      db.run(sqlStmt, guestAtDeskData, error);
    }
  }
});

function error (err) {
  if (err) {
    console.log(err.message);
  }
}
