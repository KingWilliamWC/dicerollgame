import React, { Component } from "react";

import './GameJoin.css';

import profileImageTest from './Images/ProfileImageTest.png';

class GameJoin extends Component{
    render(){
        return(
            <div id='gameJoin'>
                <div id='gameJoinContainer'>
                    <div id='gameJoinTitle'>
                        <p id='gameIDText'>Game ID: <span id='gameIDValue'>{sessionStorage.getItem('gameid') ? sessionStorage.getItem('gameid') : ''}</span></p>
                    </div>
                    <div id='gameJoinUsersContainer'>
                        <div className="gameJoinUser">
                            <img className="gameJoinProfileImage" src={profileImageTest}></img>
                            <p className="gameJoinProfileName">KingWilliamWC</p>
                            <p className="readyText">Ready</p>
                        </div>
                        <div id='gameJoinVsCentre'>
                            <div id='gameJoinVsLine'>
                                <div id='gameJoinVsCircle'>
                                    <p>VS</p>
                                </div>
                            </div>
                        </div>
                        <div className="gameJoinUser gameJoinUserLeft">
                            <img className="gameJoinProfileImage" src={profileImageTest}></img>
                            <p className="gameJoinProfileName">K469</p>
                            <p className="notReadyText">Not Ready</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GameJoin;