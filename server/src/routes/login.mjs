import express from 'express';
import { db } from '../database.mjs';
// import { veranstalterId } from './event.mjs';

export const loginRouter = express.Router();

loginRouter.post('/', function (request, response) {
  const sqlStmt = 'select veranstalter_id as veranstalterId,name, password from veranstalter where name=? and password=?';
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

loginRouter.post('/signUp', function (request, response) {
  const body = request.body;
  const addUser = 'INSERT INTO veranstalter(name,password,email) VALUES(?,?,?)';

  db.run(addUser, [body.name, body.password, body.email], (err) => {
    const signedUp = !err;

    // AFTER INSERTING THE USER,
    db.get('SELECT last_insert_rowid() as veranstalterId', (err, row) => {
      if (err) {
        console.log(err.message);
      }
      console.log(row.veranstalterId);
    });

    response.json({ acces: signedUp });
  });
});
