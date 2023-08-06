import express from 'express';
import colors from 'colors';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const __dirname = resolve();

const httpServer = createServer(app);
const io = new Server(httpServer);

const personalMeet = io.of('/personal');
const officialMeet = io.of('/official');

personalMeet.on('connection', (socket) => {
  console.log(`Clint connect on personalMeet id ${socket.id}`.bgMagenta);
});
officialMeet.on('connection', (socket) => {
  console.log(`Clint connect on officialMeet id ${socket.id}`.bgMagenta);

  socket.join('room1');
  officialMeet.to('room1').emit('some event');

  socket.on('msg', (data) => {
    // to all clients in the current namespace
    // io.sockets.emit('data', data)

    // to all clients in the current namespace except the sender
    // socket.broadcast.emit('data', data);

    officialMeet.emit('data', data);
  });

  socket.on('disconnect', () => {
    console.log(`Clint Disconnect id ${socket.id}`.bgRed);
  });
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

httpServer.listen(5050, () => {
  console.log('Server running on port 5050'.bgCyan);
});
