// Socket.IO handler for real-time messaging
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('👤 User connected:', socket.id);

        // Handle user joining rooms
        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            console.log(`👤 User ${socket.id} joined room: ${roomId}`);
        });

        // Handle leaving rooms
        socket.on('leave-room', (roomId) => {
            socket.leave(roomId);
            console.log(`👤 User ${socket.id} left room: ${roomId}`);
        });

        // Handle real-time messaging
        socket.on('send-message', (data) => {
            socket.to(data.roomId).emit('receive-message', data);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('👤 User disconnected:', socket.id);
        });
    });
};