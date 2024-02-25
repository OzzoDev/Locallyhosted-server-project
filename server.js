const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;
const hostname = '0.0.0.0'; 

const publicPath = path.join(__dirname);

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

fs.watch(publicPath, (event, filename) => {
  if (event === 'change') {
    console.log('File changed:', filename);
    io.emit('reload');
  }
});

io.on('connection', (socket) => {
  socket.on('reload', () => {
    console.log(auto);
    io.emit('reload');
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
