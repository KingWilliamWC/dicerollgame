import React, { Component } from "react";

import VSComputerGame from "./VSComputerGame";
import EndOfGameComputer from "./EndOfGameComputer";

class VSComputerGameGlobal extends Component{
    constructor(props){
        super(props);

        this.state = {
            gameFinished: false,
            winner: null,
            loser: null,
        }
    }

    gameEnd = (winner, loser) => {
        this.setState({gameFinished: true, winner: winner, loser: loser});
    }

    componentDidMount(){
        if(!sessionStorage.getItem('user')){
            window.location.href = `/`;
        }
    }

    render(){
        return(
            <div>
                {this.state.gameFinished ? <EndOfGameComputer winner={this.state.winner}/> : <VSComputerGame maxround={1} gameEndHandler={this.gameEnd}/>}
            </div>
        )
    }
}

export default VSComputerGameGlobal;