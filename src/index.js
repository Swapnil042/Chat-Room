const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const Filter = require('bad-words')

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket)=>{
    console.log('new connection')

    socket.emit('message', 'welcome!!')
    socket.broadcast.emit('message', 'new user has joined!!')

    socket.on('sendMessage',(message, callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
           return callback('profanity is not allowed!!')
        }
        io.emit('message', message)
        callback()
    })

    socket.on('location', ({lat, long}, callback)=>{
        io.emit('message', `https://google.com/maps?q=${lat},${long}`)
        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('message', 'a user has left')
    })
})

server.listen(PORT, ()=>{
    console.log(`Server is up on port ${PORT}`)
})