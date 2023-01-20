
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

    const data = [body.name, body.children, body.invitationStatus, row.guestListId];
    console.log('data', data);

    db.run(sqlStmt, data, (err) => {
      if (err) {
        throw err;
      }
    });
  });

  response.json({ message: 'Guests added' });
});

guestRouter.delete('/', (request, response) => {
  const guestIds = request.body.guestIds; // this is a array of ids
  console.log('guestIds:::', guestIds);

  const sqlStmt = 'DELETE FROM guests WHERE guest_id IN (' + guestIds.join(',') + ')';
  db.run(sqlStmt, (err) => {
    if (err) {
      response.status(500).json({ error: err.message });
    } else {
      response.json({ message: 'Guests deleted' });
    }
  });
});

guestRouter.put('/:guestId', (request, response) => {
  const guestData = request.body;
  const guestId = request.params.guestId;
  const data = [guestData.name, guestData.children, guestData.invitationStatus, guestId];
  const sqlStmt = 'UPDATE guests SET name = ?, child = ?, invitation_status = ? WHERE guest_id = ?';
  db.run(sqlStmt, data, (err) => {
    if (err) {
      console.log(err.message);
      response.status(500).json({ error: err.message });
    } else {
      response.json({ message: 'Guest updated' });
    }
  });
});
