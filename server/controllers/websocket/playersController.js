const e = require("express")

let Players = {}

const move = async (socket, data) => {

    Players[socket.id] = data
    socket.to(data.room).emit('updateMoves', Players)

}

const connect = async (socket, data) => {

    socket.join(data.room)
    Players[socket.id] = data
    socket.to(data.room).emit('updateMoves', Players)

}

const disconnect = async (socket) => {

    console.log(`Deconnecté au client ${socket.id}`)
    delete Players[socket.id]
    socket.broadcast.emit('disconect', { Players, socket: socket.id })

}

const chat = async (socket, data) => {

    socket.to(data.room).emit('chat', data)

}

const switchRoom = async (socket, data) => {

    socket.leave(data.oldRoom)
    socket.join(data.newRoom)
    Players[socket.id].room = data.newRoom
    socket.to(data.oldRoom).emit('disconect', { Players, socket: socket.id })
    socket.to(data.newRoom).emit('updateMoves', Players)

}

module.exports = {
    move,
    disconnect,
    connect,
    chat,
    switchRoom
}