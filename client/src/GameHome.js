import React, { Component } from "react";

import HomeBartop from "./HomeBartop";

import './GameHome.css';

class GameHome extends Component{
    componentDidMount(){
        if(!sessionStorage.getItem('user')){
            window.location.href = `/login`;
        }
    }
    render(){
        return(
            <div id='gameHome'>
                <HomeBartop/>
                <div className='centreButtonsContainer'>
                    <a href="/online" className="buttonContainer buttonRed">
                        <p>Online</p>
                    </a>
                    <a href="/localmultiplayer" className="buttonContainer buttonBlue">
                        <p>Local Multiplayer</p>
                    </a>
                </div>
                <div id='noFriendsContainer'>
                    <p id='noFriendsTitle'>Don't Have Any Friends?</p>
                    <a href="/vscomputergame" id='playAgainstTheComputerText'>Play Against The Computer</a>
                </div>
            </div>
        )
    }
}

export default GameHome;