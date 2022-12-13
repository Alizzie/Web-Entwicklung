import path from 'path';
import express from 'express';

const server = express();
server.use(express.json());
const port = 8080;
const dirname = path.dirname(process.argv[1]);

server.use(express.static(path.join(dirname, '../../client/build')));

server.get('/', (request, response) => {
  response.sendFile(path.join(dirname, '../../client/build/index.html'));
});

server.listen(8080, () => {
    console.log("Listen on port 8080...");
});
