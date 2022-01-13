import React, { Component } from "react";

import HomeBartop from "./HomeBartop";

import './GameHome.css';

class GameHome extends Component{
    render(){
        return(
            <div id='gameHome'>
                <HomeBartop/>
                <div className='centreButtonsContainer'>
                    <a href="/online" className="buttonContainer buttonRed">
                        <p>Online</p>
                    </a>
                    <a className="buttonContainer buttonBlue">
                        <p>Local Multiplayer</p>
                    </a>
                </div>
                <div id='noFriendsContainer'>
                    <p id='noFriendsTitle'>Don't Have Any Friends?</p>
                    <p id='playAgainstTheComputerText'>Play Against The Computer</p>
                </div>
            </div>
        )
    }
}

export default GameHome;