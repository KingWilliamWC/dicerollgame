import React, { Component } from "react";

import GameJoin from "./GameJoin";
import Game from "./Game";
import EndOfGame from "./EndOfGame";

import { io } from 'socket.io-client';

class GlobalGame extends Component{
    constructor(props){
        super(props);

        this.state = {
            hasGameStarted: false,
            hasGameFinished: false,
            socket: null,
            hostUser: null,
            guestUser: null,
            winner: null,
            loser: null,
            isHost: false,
        }
    }
    componentDidMount(){
        const url = new URL(window.location.href);
        if(url.searchParams.get("jointype")){
            if(url.searchParams.get("jointype") === 'create'){
                this.setState({isHost: true}, () => {
                    this.startGame();
                })
            }
            const socket = io(this.props.routes.gamesocket, {transports:['websocket'], upgrade: false});
            socket.on('game start', (data) => {
                this.setState({hostUser: data.hostUser, guestUser: data.guestUser}, () => {
                    this.setState({hasGameStarted: true});
                })
            })
    
            socket.on('game won', (data) => {
                console.log("Winner Score:" + JSON.parse(data.winner).endScore);
                console.log("Loser Score:" + JSON.parse(data.loser).endScore);
                this.setState({winner: JSON.parse(data.winner), loser: JSON.parse(data.loser), hasGameFinished: true});
            })

            socket.on('play again', (data) => {
                this.setState({hasGameFinished: false});
            })
            
            this.setState({socket: socket});
        }else{
            window.location.href = `/`;
        }
    }

    startGame = (hostUser, guestUser) => {
        this.state.socket.emit('game start', {'gameid': sessionStorage.getItem('gameid'), 'hostUser': hostUser, 'guestUser': guestUser});
    }

    endGame = (winner, loser) => {
        this.state.socket.emit('game won', {'gameid': sessionStorage.getItem('gameid'), 'winner': JSON.stringify(winner), 'loser': JSON.stringify(loser)})
    }

    exitGame = () => {
        this.state.socket.emit('exit game', {'gameid': sessionStorage.getItem('gameid')});
        sessionStorage.removeItem('gameid');
        window.location.href = `/`;
    }

    alertPlayAgain = () => {
        // this.setState({requestingAgain: true}, () => {
            
        // });
        this.state.socket.emit('alert play again', {'gameid': sessionStorage.getItem('gameid'), 'isHost': this.state.isHost});
    }

    render(){
        return(
            <div id='globalGameContainer'>
                {this.state.hasGameStarted ?
                this.state.hasGameFinished ?
                <EndOfGame routes={this.props.routes} alertPlayAgainHandler={this.alertPlayAgain} socket={this.state.socket} exitGameHandler={this.exitGame} winner={this.state.winner} loser={this.state.loser}/>
                :
                <Game endGameHandler={this.endGame} maxRound={5} hostUser={this.state.hostUser} guestUser={this.state.guestUser} socket={this.state.socket}/>
                :
                this.state.socket ?
                <GameJoin gameStartedHandler={this.startGame} socket={this.state.socket}/>
                :
                'Connecting to server...'
                }
            </div>
        )
    }
}

export default GlobalGame;