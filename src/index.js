import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import {Server} from 'socket.io';

import {addUserEvents} from '../src/events/user';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

addUserEvents(io);

app.get('/', (req, res) => {
    res.send('Server is running');
});

server.listen(PORT, () => {
    console.log(`Listening to the port: ${PORT}`)
})

