import express from 'express';
import { db } from '../database.mjs';

export const eventRouter = express.Router();
// TODO VERANSTALTER ID ODER NAME herholen
const veranstalterId = '31';

eventRouter.get('/', (request, response) => {
  // ID besorgen von Account der eingelogt ist
  const sqlStmt = 'SELECT * FROM veranstaltungen v WHERE v.veranstalter_id = ?';
  db.all(sqlStmt, veranstalterId, (err, rows) => {
    if (err) {
      throw err;
    }
    if (!rows) {
      console.log('no Events there');
    }
    console.log(rows);
    response.json(rows);
  });
});

eventRouter.delete('/', (request, response) => {
  const sqlStmt = 'DELETE FROM veranstaltungen WHERE veranstaltungen.id = ?';
  console.log(request.body);
  console.log(request.body.id);
  db.run(sqlStmt, request.body.id, (err) => {
    if (err) {
      throw err;
    }
    response.json('Event deleted');
    // Response ?
  });
});
