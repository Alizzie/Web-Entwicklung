import express from 'express';
import { db } from '../database.mjs';

export const eventRouter = express.Router();
// TODO VERANSTALTER ID ODER NAME herholen
export const veranstalterId = '31';

eventRouter.get('/', (request, response) => {
  // ID besorgen von Account der eingelogt ist
  const sqlStmt = 'SELECT * FROM veranstaltungen v WHERE v.veranstalter_id = ?';
  db.all(sqlStmt, veranstalterId, (err, rows) => {
    if (err) {
      throw err;
    }

    console.log(rows);
    response.json(rows);
  });
});

eventRouter.post('/', (request, response) => {
  const body = request.body;

  // Creating the seatingPlan first, so that we get an auto generated seatingPlan_id
  const seatingPlanData = [body.countTables, body.countTableSeats, body.useBothSides];
  const sqlStmtSeatingPlan = 'INSERT INTO seatingPlan(countTables, seatsPerTable, seatsPerSide) VALUES(?, ?, ?)';
  db.run(sqlStmtSeatingPlan, seatingPlanData, err => {
    if (err) {
      throw err;
    }
  });

  // Creating the guestList with default values
  const sqltStmtGuestList = 'INSERT INTO guestList DEFAULT VALUES';
  db.run(sqltStmtGuestList, err => {
    if (err) {
      throw err;
    }
  });

  // Creating new Event by getting ids of seatingPlan and guestList first
  getIds().then(x => {
    const eventData = [body.name, body.date, body.time, x.gId, x.sId, veranstalterId];
    const sqlStmtEvents = 'INSERT INTO veranstaltungen(name, date,time,guestList_id,seatingPlan_id,veranstalter_id) VALUES(?, ?, ?, ?, ?, ?)';
    db.run(sqlStmtEvents, eventData, (err) => {
      if (err) {
        throw err.message;
      }

      db.get('SELECT last_insert_rowid() as veranstaltung_id', (err, row) => {
        if (err) {
          throw err;
        }
        response.json(row);
      });
    });
  });
});

export async function getIds () {
  const sId = await requestSeatingPlanId();
  const gId = await requestGuestListId();
  return { sId, gId };
}

function requestSeatingPlanId () {
  return new Promise((resolve, reject) => {
    db.get('SELECT last_insert_rowid() as seatingPlanId', (err, row) => {
      if (err) {
        return reject(err);
      }

      return resolve(row.seatingPlanId);
    });
  });
}

function requestGuestListId () {
  return new Promise((resolve, reject) => {
    db.get('SELECT last_insert_rowid() as guestListId', (err, row) => {
      if (err) {
        throw reject(err);
      }

      return resolve(row.guestListId);
    });
  });
}

eventRouter.delete('/', (request, response) => {
  const sqlStmt = 'DELETE FROM veranstaltungen WHERE veranstaltungen.id = ?';
  db.run(sqlStmt, request.body.id, (err) => {
    if (err) {
      throw err;
    }
    response.json('Event deleted');
  });
});
