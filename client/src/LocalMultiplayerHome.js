import React, { Component } from "react";

import HomeBartop from "./HomeBartop";

class LocalMultiplayerHome extends Component{
    randomIntFromInterval = (min, max) => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    componentDidMount(){
        if(!localStorage.getItem('user')){
            window.location.href = `/login`;
        }
    }

    onJoinGame = () => {
        var newUsername = document.getElementById("player2nameInput").value;
        if(newUsername.trim().length > 0 && newUsername !== JSON.parse(localStorage.getItem('user')).username){
            localStorage.setItem('player2user', JSON.stringify({"username": newUsername, "profileImage": `/ProfileImages/${this.randomIntFromInterval(1, 15)}.png`}));
            window.location.href = `/localmultiplayergame`;
        }
    }
    render(){
        return(
            <div id='localmultiplayerhome'>
                <HomeBartop routes={this.props.routes}/>
                <p className="selectionText">Local Multiplayer</p>
                <div className='centreButtonsContainer'>
                    <div id='gameJoinInputContainer'>
                        <p id='gameIDInputTitleText'>Player 2's Name:</p>
                        <input maxLength={24} onKeyPress={(e) => {if(e.key === 'Enter'){this.onJoinGame()}}} placeholder="any name you like" id='player2nameInput'></input>
                        <a onClick={() => this.onJoinGame()} className="buttonContainer buttonBlue buttonContainerCenter">
                            <p>Play</p>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default LocalMultiplayerHome;