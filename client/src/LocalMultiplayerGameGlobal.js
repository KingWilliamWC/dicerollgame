import React, { Component } from "react";

import LocalMultiplayerGame from "./LocalMultiplayerGame";
import EndOfGameLocalMultiplayer from "./EndOfGameLocalMultiplayer";

class LocalMultiplayerGameGlobal extends Component{
    constructor(props){
        super(props);

        this.state = {
            gameFinished: false,
            winner: null,
            loser: null,
        }
    }

    componentDidMount(){
        if(!sessionStorage.getItem('user')){
            window.location.href = `/`;
        }
    }

    gameEnd = (winner, loser) => {
        this.setState({gameFinished: true, winner: winner, loser: loser});
    }

    render(){
        return(
            <div>
                {this.state.gameFinished ? <EndOfGameLocalMultiplayer winner={this.state.winner}/> : <LocalMultiplayerGame maxround={5} gameEndHandler={this.gameEnd}/>}
            </div>
        )
    }
}

export default LocalMultiplayerGameGlobal;