import React, { Component } from "react";

class GameHistory extends Component{
    constructor(props){
        super(props);

        this.state = {
            userHistory: [],
            collectingData: true,
        }
    }
    componentDidMount(){
        var currentHistory = JSON.parse(sessionStorage.getItem('user')).gameHistory;
        var userHistoryComponents = [];
        if(currentHistory.length > 0){
            for(var i = 0; i < currentHistory.length; i++){
                userHistoryComponents.push(
                    <div className="userHistoryItem">
                        <p className='userHistoryItemDate'>{currentHistory[i].gameDateTime}</p>
                        <p className="userHistoryItemTitle">Winner</p>
                        <p className="userHistoryItemUser">{currentHistory[i].winner.username} - {currentHistory[i].winner.endScore}</p>
                        <p className="userHistoryItemTitle">Loser</p>
                        <p className="userHistoryItemUser">{currentHistory[i].loser.username} - {currentHistory[i].loser.endScore}</p>
                    </div>
                )
            }
        }
        this.setState({userHistory: userHistoryComponents, collectingData: false})
    }
    render(){
        return(
            <div id='gameHistoryContainer'>
                <div id="gameHistoryWrapper">
                    <p className="tabTitle">Game History</p>
                    <div className="tabUnderline"></div>
                    <div id='gameHistoryContentContainer'>
                        {this.state.userHistory.length > 0 ? this.state.userHistory : ''}
                    </div>
                </div>

            </div>
        )
    }
}

export default GameHistory;