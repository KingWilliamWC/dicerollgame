import React, { Component } from "react";

class EndOfGameLocalMultiplayer extends Component{
    exitGameSelfHandler = () => {
        sessionStorage.removeItem('player2user');
        window.location.href = `/`;
    }

    onPlayAgainPress = () => {
        window.location.reload();
    }
    render(){
        return(
            <div id='localmultiplayerend'>
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
                    {/* <p id={this.state.gamePlayerAgainID[this.state.gamePlayAgainState]}>{this.state.gamePlayAgainText}</p> */}
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

export default EndOfGameLocalMultiplayer;