import express from 'express';
import { db } from '../database.mjs';

export const loginRouter = express.Router();

loginRouter.post('/', (request, response) => {
  const sqlStmt = 'SELECT veranstalter_id AS veranstalterId, name, password FROM veranstalter WHERE name=? AND password=?';
  db.get(sqlStmt, request.body, (err, row) => {
    if (err) {
      throw err;
    }

    let loginSucces = false;
    if (row) {
      loginSucces = true;
      request.session.userId = row.veranstalterId;
    }

    const data = {
      accepted: loginSucces
    };

    response.json(data);
  });
});

loginRouter.post('/signUp', (request, response) => {
  const body = request.body;
  const addUser = 'INSERT INTO veranstalter(name,password,email) VALUES(?,?,?)';

  db.run(addUser, [body.name, body.password, body.email], (err) => {
    const signedUp = !err;

    // AFTER INSERTING THE USER,
    db.get('SELECT last_insert_rowid() AS veranstalterId', (err) => {
      if (err) {
        console.log(err.message);
      }
    });

    response.json({ acces: signedUp });
  });
});
