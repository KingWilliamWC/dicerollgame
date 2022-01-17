import React, { Component } from "react";

import './EndOfGame.css';
import profileImageTest from './Images/ProfileImageTest.png';

class EndOfGame extends Component{
    render(){
        return(
            <div id='endOfGame'>
                <div id='gameBartop'>
                    <p id='roundText'>End Of Game</p>
                </div>
                <p className="wonText">{this.props.winner.username} Won!</p>
                <div id='gameProfilesContainer'>
                    <div className="gameProfile gameProfileTop">
                        <img className="gameProfileImage" src={profileImageTest}></img>
                        <div className="gameProfileNameScoreContainer">
                            <p className="gameProfileName">{this.props.winner.username}</p>
                            <p className="gameProfileScore">{this.props.winner.endScore}</p>
                        </div>
                    </div>
                </div>
                <div id='buttonBottomContainer'>
                    <a className="gameWonbuttonContainer buttonGreen">
                        <p>Play Again</p>
                    </a>
                    <a onClick={() => this.props.exitGameHandler()} className="gameWonbuttonContainer buttonRed">
                        <p>Exit</p>
                    </a>
                </div>
            </div>
        )
    }
}

export default EndOfGame;