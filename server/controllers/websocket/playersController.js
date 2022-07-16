let Players = {}

const move = async (socket, data) => {

    Players[socket.id] = data
    socket.broadcast.emit('updateMoves', Players)

}

const connect = async (io, socket, data) => {

    Players[socket.id] = data
    io.emit('updateMoves', Players)

}

const disconnect = async (socket) => {

    console.log(`Deconnecté au client ${socket.id}`)
    delete Players[socket.id]
    socket.broadcast.emit('disconect', { Players, socket: socket.id })

}

const chat = async (io, data) => {

    io.emit('chat', data)

}

module.exports = {
    move,
    disconnect,
    connect,
    chat
}