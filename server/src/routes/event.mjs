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

eventRouter.post('/', (request, response) => {
  const body = request.body;
  const seatingPlanData = [body.countTables, body.countTableSeats, body.useBothSides];
  const sqlStmtSeatingPlan = 'INSERT INTO seatingPlan(countTables, seatsPerTable, seatsPerSide) VALUES(?, ?, ?)';
  // Creating the seatingPlan first, so that we get an auto generated seatingPlan_id
  db.run(sqlStmtSeatingPlan, seatingPlanData, err => {
    if (err) {
      throw err;
    }
  });

  db.get('SELECT last_insert_rowid() as seatingPlanId', (err, row) => {
    if (err) {
      throw (err);
    }
    const seatingPlanId = row.seatingPlanId;
    // Creating guestList before Event,so that we get an auto generated guestList_id
    db.run('INSERT INTO guestList DEFAULT VALUES', (err) => {
      if (err) {
        throw err;
      }
      db.get('SELECT last_insert_rowid() as guestListId', (err, row) => {
        if (err) {
          throw err;
        }
        const guestListId = row.guestListId;
        const sqlStmtEvents = 'INSERT INTO veranstaltungen(name, date,time,guestList_id,seatingPlan_id,veranstalter_id) VALUES(?, ?, ?, ?, ?, ?)';
        const eventData = [body.name, body.date, body.time, guestListId, seatingPlanId, veranstalterId];
        db.run(sqlStmtEvents, eventData, (err) => {
          if (err) {
            throw err.message;
          }
        });
      });
    });
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
  });
});
