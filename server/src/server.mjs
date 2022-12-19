import path from 'path';
import express from 'express';

const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true}));
const dirname = path.dirname(process.argv[1]);

// clientseitige statische Daten
server.use(express.static(path.join(dirname, '../../client/build')));

// Kommandozeile übergebene Port
let port;
if (!process.argv[2]) {
  port = 8080;
} else {
  port = process.argv[2];
}

server.get('/', (request, response) => {
  response.sendFile(path.join(dirname, '../../client/build/index.html'));
});

server.post('/', function (request, response) {
  console.log("POST", request.body);
  response.send(request.body);
});

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listen on port ${port} ...`);
  }
});
