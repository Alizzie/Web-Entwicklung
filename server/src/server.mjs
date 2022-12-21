import path from 'path';
import express from 'express';

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

server.get('/', (request, response) => {
  response.sendFile(path.join(dirname, '../../client/build/index.html'));
});

server.post('/login', function (request, response) {
  
 
    console.log('get login data', request.body);
    const [username, password] = request.body;
    
    // TODO DB CECK IF CORRECT PASSWORD => YES, THEN ACCEPTED: TRUE, ELSE FALSE

    // Data sended back to client
    const data = {
      accepted: true,
      name: username,
      pword: password
    };
    // data will be send back to client as response in json
    response.json(data);
});

server.post('/newEvent', function (request, response) {
 
    console.log('get new event data', request.body);
    const [name,date,time,] = request.body;
    
    // Data sended back to client
    const data = {
      accepted: true,
    };
    // data will be send back to client as response in json
    response.json(data);
});


server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listen on port ${port} ...`);
  }
});
