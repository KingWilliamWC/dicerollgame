import React, { Component } from "react";
import axios from "axios";

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

    componentDidMount(){
        if(!sessionStorage.getItem('user')){
            window.location.href = `/login`;
        }
    }
    onStartJoinGame = () => {
        this.setState({isJoiningGame: 1})
    }

    onJoinGame = () => {
        var userID = document.getElementById("gameIdInput").value.toLowerCase();
        // check user id input is 6 characters minus whitespace i.e. " "
        if(userID.trim().length === 6){
            // this is to access on join game
            sessionStorage.setItem('gameid', userID);
            window.location.href = `/game?jointype=join`;
        }
    }

    async getNewGameID(){
        const res = await axios.post(this.props.routes.newgameid);
        return await res.data;
    }

    onCreateGame = () => {
        this.getNewGameID()
        .then(data => {
            if(data.success){
                sessionStorage.setItem('gameid', data.newGameID);
                window.location.href = `/game?jointype=create`;
            }
        })
        
    }
    render(){
        return(
            <div id='onlinehome'>
                <HomeBartop routes={this.props.routes}/>
                <p className="selectionText">Online</p>
                <div className={this.state.centreButtonsContainerClasses[this.state.isJoiningGame]}>
                    <a onClick={() => this.onStartJoinGame()} className="buttonContainer buttonRed">
                        <p>Join Game</p>
                    </a>
                    <a onClick={() => this.onCreateGame()} className="buttonContainer buttonBlue">
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