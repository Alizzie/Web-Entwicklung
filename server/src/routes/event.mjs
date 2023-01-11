import express from 'express';
import { db } from '../database.mjs';

export const eventRouter = express.Router();
// TODO VERANSTALTER ID ODER NAME herholen
const veranstalterId = '42828481831';

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
  const sqlStmtSeatingPlan = 'INSERT INTO seatingPlan(countTables, seatsPerTable, seatsPerSide) VALUES(?, ?, ?)';
  const sqlStmtEvents = 'INSERT INTO veranstaltungen(name, date,time,seatingPlan_id,veranstalter_id) VALUES(?, ?, ?, ?, ?)';
  const body = request.body;
  const seatingPlanData = [body.countTables, body.countTableSeats, body.useBothSides === 'on' ? 2 : 1];

  // Inserting the seatingPlan first, so that we get an auto generated seatingPlan_id
  db.run(sqlStmtSeatingPlan, seatingPlanData, err => {
    if (err) {
      throw err;
    }
  });
  // getting the seatingPlan_id to insert it then in the 'veranstaltungen' table
  db.get('SELECT last_insert_rowid() as seatingPlanId', (err, row) => {
    if (err) {
      throw (err);
    }
    const eventData = [body.name, body.date, body.time, row.seatingPlanId, veranstalterId];
    db.run(sqlStmtEvents, eventData, (err) => {
      if (err) {
        throw err.message;
      }
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
