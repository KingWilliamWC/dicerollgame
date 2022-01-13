import React, { Component } from "react";

import HomeBartop from "./HomeBartop";

import './OnlineHome.css';

class OnlineHome extends Component{
    constructor(props){
        super(props);

        this.state = {
            centreButtonsContainerClasses: ['centreButtonsContainer', 'hide'],
            isJoiningGame: 0,
        }
    }

    onStartJoinGame = () => {
        this.setState({isJoiningGame: 1})
    }

    onJoinGame = () => {
        var userID = document.getElementById("gameIdInput").value
        // check user id input is 6 characters minus whitespace i.e. " "
        if(userID.trim().length === 6){
            // this is to access on join game
            sessionStorage.setItem('gameid', userID);
            window.location.href = `/join`;
        }
    }
    render(){
        return(
            <div id='onlinehome'>
                <HomeBartop/>
                <p className="selectionText">Online</p>
                <div className={this.state.centreButtonsContainerClasses[this.state.isJoiningGame]}>
                    <a onClick={() => this.onStartJoinGame()} className="buttonContainer buttonRed">
                        <p>Join Game</p>
                    </a>
                    <a className="buttonContainer buttonBlue">
                        <p>Create Game</p>
                    </a>
                </div>
                <div className={this.state.centreButtonsContainerClasses[1-this.state.isJoiningGame]}>
                    <div id='gameJoinInputContainer'>
                        <p id='gameIDInputTitleText'>Game ID:</p>
                        <input maxLength={6} onKeyPress={(e) => {if(e.key === 'Enter'){this.onJoinGame()}}} placeholder="e.g. 2df5y7" id='gameIdInput'></input>
                        <a onClick={() => this.onJoinGame()} className="buttonContainer buttonBlue buttonContainerCenter">
                            <p>Join!</p>
                        </a>
                    </div>

                </div>
            </div>
        )
    }
}

export default OnlineHome;