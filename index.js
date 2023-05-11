require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize =  require('./bd');
const models = require('./models/models');
const router = require('./routes/index');
const errorHandler = require('./milddleware/ErrorHandlingMiddleware');

const http = require('http');
const WebSocket = require( "ws");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app)
const webSocketServer = new WebSocket.Server({noServer: true});

webSocketServer.on('connection', ws => {
    ws.on('message', function (message) {
        message = JSON.parse(message);
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                console.log(message)    
                break;
            case 'connection':
                broadcastMessage(message)
                console.log("Вы подкдючились")  
        }
      });
});

server.on('upgrade', (request, socket, head) => {
    webSocketServer.handleUpgrade(request, socket, head, (ws) => {
        webSocketServer.emit('connection', ws, request)
    })
})

function broadcastMessage(message) {
    webSocketServer.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.use(errorHandler);
const start = async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        server.listen(PORT, () => console.log('server working' + PORT));
    } catch (e) {
        console.log(e)
    }
}

start()
