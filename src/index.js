import express from 'express';
import http from 'http';
import cors from 'cors';

import {Server} from 'socket.io';

import {gameEvents} from './games/gameEvents';

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

gameEvents(io);


app.get('/', (req, res) => {
    res.send('Server is running');
});

server.listen(PORT, () => {
    console.log(`Listening to the port: ${PORT}`)
})

