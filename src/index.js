import express from 'express';
import http from 'http';
import cors from 'cors';

import {Server} from 'socket.io';

import {userEvents} from '../src/users/userEvents';

const PORT = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

userEvents(io);

app.get('/', (req, res) => {
    res.send('Server is running');
});

server.listen(PORT, () => {
    console.log(`Listening to the port: ${PORT}`)
})

