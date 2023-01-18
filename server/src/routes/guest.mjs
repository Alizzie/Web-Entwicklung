
import express from 'express';
import { db } from '../database.mjs';

export const guestRouter = express.Router();

guestRouter.get('/:id', (request, response) => {
  const veranstaltungId = request.params.id;
  console.log('veranstaltungId: ', veranstaltungId);
  // SQL Statement to get the guestID
  const sqlStmt = 'SELECT * FROM guests g WHERE g.guestList_id = (SELECT guestList_id from veranstaltungen v where v.id = ?)';

  db.all(sqlStmt, veranstaltungId, (err, rows) => {
    if (err) {
      throw err;
    }

    console.log('rows: ', rows);
    response.json(rows);
  });
});

guestRouter.post('/', (request, response) => {
  const body = request.body;
  console.log('body', body);
  const sqlStmt = 'INSERT INTO guests(name,child,invitation_status,guestList_id) VALUES(?, ?, ?, ?)';
  const getGuestListId = 'Select guestList_id as guestListId from veranstaltungen where id = ?';

  db.get(getGuestListId, body.veranstaltungId, (err, row) => {
    if (err) {
      throw err;
    }
    console.log('row', row);
    const data = [body.name, body.children === 'on' ? 1 : 0, body.invitationStatus, row.guestListId];
    console.log('data', data);
    db.run(sqlStmt, data, (err) => {
      if (err) {
        throw err;
      }
    });
  });
});

guestRouter.delete('/', (request, response) => {
  const guestIds = request.body.guestIds; // this is a array of ids
  console.log('guestIds:::', guestIds);

  db.all('SELECT * from GUESTS', (err, row) => {
    if (err) {
      throw err;
    }
    console.log('rows:::', row);
  });
  const sqlStmt = 'DELETE FROM guests WHERE guest_id IN (?)';
  db.run(sqlStmt, guestIds, (err) => {
    if (err) {
      response.status(500).json({ error: err.message });
    } else {
      response.json({ message: 'Guests deleted' });
    }
  });
});
