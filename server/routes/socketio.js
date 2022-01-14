function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
const rootSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on('join game', (data) => {
            if(data.gameid.trim().length === 6){
                socket.join(data.gameid);
                io.to(data.gameid).emit("user join", {'username': makeid(3)});
            }
        })

        socket.on('create game', (data) => {
            if(data.gameid.trim().length === 6){
                socket.join(data.gameid);
            }
        })

        socket.on('user info', (data) => {
            if(data.gameid.trim().length === 6){
                io.to(data.gameid).emit("user info", data.user);
            }
        })

        socket.on('ready update', (data) => {
            console.log(data);
            io.to(data.gameid).emit("ready update", data);
        })
    })
}

module.exports = rootSocket;