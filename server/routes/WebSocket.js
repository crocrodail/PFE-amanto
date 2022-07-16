const connection = require('../controllers/websocket/ConnectionController.js')
const players = require('../controllers/websocket/playersController.js')


module.exports = (io) => {

  io.on('connection', async (socket) => {

    console.log(`Connecté au client ${socket.id}`)
    
    socket.on('disconnect', () => players.disconnect(socket))
    socket.on('connected', (data) => players.connect(io, socket, data))
    socket.on('move', (data) => players.move(socket, data))
    socket.on('chat', (data) => players.chat(io, data))

  })

}
