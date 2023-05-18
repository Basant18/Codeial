module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        cors: {
          origin: "http://localhost:8000",
          methods: ["GET", "POST"]
        }
    });
    io.sockets.on('connection', function(socket){
        console.log('new connection recieved', socket.id);
        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });
        socket.on('join_room', function(data){
            console.log('joining request recieved',data);
            socket.join(data.chatRoom);
            io.in(data.chatRoom).emit('user_joined', data);
        });

        // CHANGE:: detect send_message and brodcast to everyone in the room
        socket.on('send_message', function(data){
            io.in(data.chatRoom).emit('recieve_message', data);
        });
    });
}