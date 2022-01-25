import React, { Component } from "react";

import DiceRoll0 from './Images/DiceRoll0.png';

import ExitImage from './SVG/Exit.svg';
import ExitFillImage from './SVG/Exit-Fill.svg';

class LocalMultiplayerGame extends Component{
    constructor(props){
        super(props);

        this.state = {
            user: null,
            userScore: 0,
            player2user: null,
            player2userScore: 0,
            isUsersGo: null,
            isUsersGoButton: false,
            currentRound: 1,
            isSecondCurrentGo: false,
            shouldChangeRound: false,
            exitImage: [ExitImage, ExitFillImage],
            exitImageState: 0,
        }
    }

    randomIntFromInterval = (min, max) => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    componentDidMount(){
        if(!sessionStorage.getItem('user')){
            window.location.href = `/login`;
        }else if(!sessionStorage.getItem('player2user')){
            window.location.href = `/localmultiplayer`;
        }else{
            this.setState({DiceRoll1Image: document.getElementById("dice1"), DiceRoll2Image: document.getElementById("dice2"), user: JSON.parse(sessionStorage.getItem('user')), player2user: JSON.parse(sessionStorage.getItem('player2user'))}, () => {
                var randomNum = this.randomIntFromInterval(0,1);
                if(randomNum === 1){
                    // the user will be starting
                    this.setState({isUsersGoButton: true, isUsersGo: true, activePlayerName: this.state.user.username})
                }else{
                    // the player 2 user will be starting
                    this.setState({isUsersGoButton: true, isUsersGo: false, activePlayerName: this.state.player2user.username})
                }
            });
        }
    }

    Delay = (time) => {
        // this delay is purely for human entertainment, clearly computers are superior
        return new Promise(resolve => setTimeout(resolve, time));
    }

    handleActiveUser = () => {
        if(this.state.isUsersGo){
            // it is now player2's go
            this.setState({isUsersGo: false, activePlayerName: this.state.player2user.username, isUsersGoButton: true}, () => {
            });
        }else{
            this.setState({isUsersGo: true, activePlayerName: this.state.user.username, isUsersGoButton: true});
        }
    }

    workoutScoreToAdd = (diceRolled1, diceRolled2) =>{
        //workout score to add and if an extra turn is required
        var scoreToAdd = 0;
        scoreToAdd += (diceRolled1 + diceRolled2); // add the points on the two dice
        
        // even/odd check
        if((diceRolled1 + diceRolled2) % 2 === 0){
            scoreToAdd += 10
        }
        else{
            // if it's not even then it's odd
            scoreToAdd -= 5
        }
        return scoreToAdd;
    }

    onEndGame = () => {
        this.state.user.endScore = this.state.userScore;
        this.state.player2user.endScore = this.state.player2userScore;
        if(this.state.userScore !== this.state.player2userScore){
            if(this.state.userScore > this.state.player2userScore){
                this.props.gameEndHandler(this.state.user, this.state.player2user);
            }else{
                this.props.gameEndHandler(this.state.player2user, this.state.user);
            }
        }else{
            console.log("I hate this part");
        }

    }

    onRollDice = async () => {
        if(this.state.isSecondCurrentGo){
            var diceRolled1 = this.randomIntFromInterval(1, 6);
            this.state.DiceRoll1Image.src = `/diceImages/DiceRoll${diceRolled1}.png`;
            this.state.DiceRoll2Image.src = DiceRoll0;
            if(this.state.isUsersGo){
                // console.log(`User rolled: ${diceRolled1}`);
                this.setState({isSecondCurrentGo: false, userScore: this.state.userScore + diceRolled1});
            }else{
                // console.log(`Ai rolled: ${diceRolled1}`);
                this.setState({isSecondCurrentGo: false,player2userScore: this.state.player2userScore + diceRolled1});
            }
            await this.Delay(2000);

            if(this.state.shouldChangeRound){
                if(this.state.currentRound + 1 > this.props.maxround){
                    await this.Delay(1000);
                    this.onEndGame();
                }else{
                    this.setState({currentRound: this.state.currentRound + 1, shouldChangeRound: false});
                }
            }else{
                this.setState({shouldChangeRound: true});
            }
    
            this.handleActiveUser();
        }else{
            var diceRolled1 = this.randomIntFromInterval(1, 6);
            var diceRolled2 = this.randomIntFromInterval(1, 6);
            this.state.DiceRoll1Image.src = `/diceImages/DiceRoll${diceRolled1}.png`;
            this.state.DiceRoll2Image.src = `/diceImages/DiceRoll${diceRolled2}.png`;

            var scoreToAdd = this.workoutScoreToAdd(diceRolled1, diceRolled2);
            if(this.state.isUsersGo){
                // console.log(`User rolled: ${diceRolled1}, ${diceRolled2}`);
                if(this.state.userScore + scoreToAdd < 0){
                    this.setState({userScore: 0});
                }else{
                    this.setState({userScore: this.state.userScore + scoreToAdd});
                }
            }else{
                if(this.state.player2userScore + scoreToAdd < 0){
                    this.setState({player2userScore: 0});
                }else{
                    this.setState({player2userScore: this.state.player2userScore + scoreToAdd});
                }
            }
            
            if(diceRolled1 === diceRolled2){
                this.setState({isSecondCurrentGo: true});
                this.setState({isUsersGoButton: true});
            }else{
                await this.Delay(2000);
                if(this.state.shouldChangeRound){
                    if(this.state.currentRound + 1 > this.props.maxround){
                        this.onEndGame();
                    }else{
                        this.setState({currentRound: this.state.currentRound + 1, shouldChangeRound: false});
                    }
                }else{
                    this.setState({shouldChangeRound: true})
                }
                
                this.handleActiveUser();
            }
        }
    }

    onExitGame = () => {
        window.location.href  =`/`;
    }

    onRollDiceButtonClicked = () => {
        if(this.state.isUsersGoButton){
            this.setState({isUsersGoButton: false});
            this.onRollDice();
        }
    }

    render(){
        return(
            <div id='localmultiplayergame'>
                <div id='gameBartop'>
                    <img onClick={() => this.onExitGame()} onPointerLeave={() => this.setState({exitImageState: 0})} onPointerEnter={() => this.setState({exitImageState: 1})} className="exitButton" src={this.state.exitImage[this.state.exitImageState]}></img>
                    <p id='roundText'>Round {this.state.currentRound}</p>
                </div>
                <div id='gameProfilesContainer'>
                    <div className="gameProfile gameProfileTop">
                        <img className="gameProfileImage" src={this.state.user ? this.state.user.profileImage : ''}></img>
                        <div className="gameProfileNameScoreContainer">
                            <p className="gameProfileName">{this.state.user ? this.state.user.username : ''}</p>
                            <p className="gameProfileScore">{this.state.userScore}</p>
                        </div>
                    </div>
                    <div className="gameProfile">
                        <img className="gameProfileImage" src={this.state.player2user ? this.state.player2user.profileImage : ''}></img>
                        <div className="gameProfileNameScoreContainer">
                            <p className="gameProfileName">{this.state.player2user ? this.state.player2user.username : ''}</p>
                            <p className="gameProfileScore">{this.state.player2userScore}</p>
                        </div>
                    </div>
                </div>
                <p id='turnText'>{this.state.activePlayerName}'s Turn!</p>
                <p id='doubleText'>{this.state.isSecondCurrentGo ? 'DOUBLE!' : ''} </p>
                <div id='diceContainer'>
                    <img id='dice1' src={DiceRoll0} className="dice"></img>
                    <img id='dice2' src={DiceRoll0} className="dice"></img>
                </div>
                
                <a onClick={() => this.onRollDiceButtonClicked()} className={this.state.isUsersGoButton ? 'buttonContainer buttonGreen' : 'buttonContainer buttonGreen startButtonNotReady'}>
                    <p>Roll Dice</p>
                </a>
            </div>
        )
    }
}

export default LocalMultiplayerGame;