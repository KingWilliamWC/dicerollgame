const pm2io = require('@pm2/io');

const realtimeUser = pm2io.counter({
    name: "Active Websocket Connections",
    id: "app/websocket/connections"
});
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}
const rootSocket = (io) => {
    io.on('connection', (socket) => {
        console.log("Connection to server");
        realtimeUser.inc();
        // Lobby logic
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
            // console.log(data);
            io.to(data.gameid).emit("ready update", data);
        })

        socket.on('game start', (data) => {
            io.to(data.gameid).emit('game start', {"hostUser": data.hostUser, "guestUser": data.guestUser});
        })

        // in-game logic
        socket.on("start game", (data) => {
            console.log(data.randomNum);
            if(data.randomNum === 0){
                io.to(data.gameid).emit('start game', {"userToStart": "host"});
            }else{
                io.to(data.gameid).emit('start game', {"userToStart": "guest"});
            }
        })

        socket.on("player turn", (data) => {
            console.log(data);
            //workout score to add and if an extra turn is required
            var scoreToAdd = 0;
            scoreToAdd += (data.diceRolled1 + data.diceRolled2); // add the points on the two dice
            
            // even/odd check
            if((data.diceRolled1 + data.diceRolled2) % 2 === 0){
                scoreToAdd += 10
            }
            else{
                // if it's not even then it's odd
                scoreToAdd -= 5
            }

            // does both dice equal each other
            if(data.diceRolled1 === data.diceRolled2){
                data.goAgain = true;
            }else{
                data.goAgain = false;
            }

            data.scoreToAdd = scoreToAdd;
            io.to(data.gameid).emit('player turn', (data));
        })

        socket.on('extra turn', (data) => {
            data.scoreToAdd = data.diceRolled1;
            io.to(data.gameid).emit('extra turn', (data));
        })

        socket.on('next round', (data) => {
            io.to(data.gameid).emit('next round');
        })

        socket.on('exit game', (data) => {
            //console.log(io.of('/').in(data.gameid).fetchSockets().length);
            io.to(data.gameid).emit('exit game');
        })

        socket.on('force exit', (data) => {
            // console.log(data);
            io.to(data.gameid).emit('force exit', (data));
        })

        socket.on('game force exit', (data) => {
            // console.log(data);
            io.to(data.gameid).emit('game force exit', (data));
        })

        socket.on('game won', (data) => {
            console.log(data);
            io.to(data.gameid).emit('game won', (data));
        })

        socket.on('play tiebreak', (data) => {
            // console.log(data);
            console.log("Game playing tiebreak");
            io.to(data.gameid).emit('play tiebreak', (data));
        })

        socket.on('tiebreak turn', (data) => {
            // console.log(data);
            io.to(data.gameid).emit('tiebreak turn', (data));
        })

        socket.on('alert play again', (data) => {
            console.log(data);
            io.to(data.gameid).emit('alert play again', (data));
        })

        socket.on('play again', (data) => {
            io.to(data.gameid).emit('play again', (data));
        })

        socket.on('disconnect', () => {
            realtimeUser.dec();
            console.log("Disconnection to server");
        })
    })
}

module.exports = rootSocket;