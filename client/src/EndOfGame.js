import React, { Component } from "react";

import axios from "axios";

import './EndOfGame.css';
import profileImageTest from './Images/ProfileImageTest.png';

class EndOfGame extends Component{
    constructor(props){
        super(props);

        this.state = {
            isHost: false,
            gamePlayerAgainID: ['endGameAlertTextHide', 'endGameAlertText'],
            gamePlayAgainText: '',
            gamePlayAgainState: 0,
            isWantingToPlayAgain: false,
            exitingGame: false,
            otherPlayer: true,
            otherPlayerWantsToPlayAgain: false,
        }
    }
    componentDidMount(){
        const url = new URL(window.location.href);
        if(url.searchParams.get("jointype")){
            if(url.searchParams.get("jointype") === 'create'){
                this.setState({isHost: true}, () => {
                })
            }

            this.props.socket.on('alert play again', (data) => {
                console.log(this.state.isHost);
                if(this.state.isHost && !data.isHost){
                    // guest wants to play again
                    this.setState({
                        gamePlayAgainState: 1,
                        gamePlayAgainText: `${this.props.guest.username} wants to play again!`,
                        otherPlayerWantsToPlayAgain: true,
                    })
                }else if(!this.state.isHost && data.isHost){
                    // host wants to play again
                    this.setState({
                        gamePlayAgainState: 1,
                        gamePlayAgainText: `${this.props.host.username} wants to play again!`,
                        otherPlayerWantsToPlayAgain: true,
                    })
                }
            })

            this.props.socket.on('exit game', (data) => {
                if(!this.state.exitingGame){
                    this.setState({
                        gamePlayAgainState: 1,
                        gamePlayAgainText: this.state.isHost ? `${this.props.guest.username} has quit` : `${this.props.host.username} has quit`,
                        otherPlayer: false,
                    })
                }
            })
        }
    }

    exitGameSelfHandler = () => {
        this.setState({exitingGame: true}, () => {
            this.props.exitGameHandler();
        })
    }

    async getNewGameID(){
        const res = await axios.post(this.props.routes.newgameid);
        return await res.data;
    }

    onPlayAgainPress = () => {
        if(this.state.otherPlayerWantsToPlayAgain){
            // go back to the lobby, both come to a formal agreement
            // window.location.href = `/game`
            console.log("Start The Game Again");
            this.props.socket.emit('play again', {'gameid': localStorage.getItem('gameid')});
        }else{
            if(this.state.otherPlayer){
                // alert them of our wishes to play again
                this.setState({
                    isWantingToPlayAgain: true,
                    gamePlayAgainState: 1,
                    gamePlayAgainText: this.state.isHost ? `Awaiting ${this.props.guest.username}'s response...` : `Awaiting ${this.props.host.username}'s response...`,
                    otherPlayerWantsToPlayAgain: false,
                });
                this.props.alertPlayAgainHandler()
            }else{
                // just create another game without the other player
                console.log("No player to play with :(((((");
                this.getNewGameID()
                .then(data => {
                    if(data.success){
                        localStorage.setItem('gameid', data.newGameID);
                        window.location.href = `/game?jointype=create`;
                    }
                })
            }
        }
    }
    render(){
        return(
            <div id='endOfGame'>
                <div id='gameBartop'>
                    <p id='roundText'>End Of Game</p>
                </div>
                <p className="wonText">{this.props.winner.username} Won!</p>
                <div id='gameProfilesContainer'>
                    <div className="gameProfile gameProfileTop">
                        <img className="gameProfileImage" src={this.props.winner.profileImage}></img>
                        <div className="gameProfileNameScoreContainer">
                            <p className="gameProfileName">{this.props.winner.username}</p>
                            <p className="gameProfileScore">{this.props.winner.endScore}</p>
                        </div>
                    </div>
                </div>
                <div id='buttonBottomContainer'>
                    <p id={this.state.gamePlayerAgainID[this.state.gamePlayAgainState]}>{this.state.gamePlayAgainText}</p>
                    <div id='buttonBottomWrapper'>
                        <a onClick={() => this.onPlayAgainPress()} className="gameWonbuttonContainer buttonGreen">
                            <p>Play Again</p>
                        </a>
                        <a onClick={() => this.exitGameSelfHandler()} className="gameWonbuttonContainer buttonRed">
                            <p>Exit</p>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default EndOfGame;