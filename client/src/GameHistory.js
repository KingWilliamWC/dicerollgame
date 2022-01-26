import React, { Component } from "react";

class GameHistory extends Component{
    render(){
        return(
            <div id='gameHistoryContainer'>
                <div id="gameHistoryWrapper">
                    <p className="tabTitle">Game History</p>
                    <div className="tabUnderline"></div>
                </div>
            </div>
        )
    }
}

export default GameHistory;