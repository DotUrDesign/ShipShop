const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http)

const PORT = 3006;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) =>  {
    console.log("User connected...");

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    })

    socket.on('disconnect', () => {
        console.log('User disconnected...')
    })
})

http.listen(PORT, () => console.log(`Server is running at port ${PORT}`));