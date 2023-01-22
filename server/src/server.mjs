import path from 'path';
import express from 'express';

// REQUESTS
import { loginRouter } from '../src/routes/login.mjs';
import { eventRouter } from './routes/event.mjs';
import { guestRouter } from './routes/guest.mjs';
import { deskRouter } from './routes/desk.mjs';

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// clientseitige statische Daten
const dirname = path.dirname(process.argv[1]);
server.use(express.static(path.join(dirname, '../../client/build')));

// Kommandozeile übergebene Port
let port;
if (!process.argv[2]) {
  port = 8080;
} else {
  port = process.argv[2];
}

server.use('/api/login', loginRouter);
server.use('/api/events', eventRouter);
server.use('/api/guest', guestRouter);
server.use('/api/desk', deskRouter);

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listen on port ${port} ...`);
  }
});
