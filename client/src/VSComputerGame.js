import React, { Component } from "react";

import DiceRoll0 from './Images/DiceRoll0.png';

import ExitImage from './SVG/Exit.svg';
import ExitFillImage from './SVG/Exit-Fill.svg';

class VSComputerGame extends Component{
    constructor(props){
        super(props);

        this.state = {
            computerUserScore: 0,
            guestUserScore: 0,
            currentRound: 1,
            user: null,
            computerUser: {"username": 'Seaborne (Ai)', 'profileImage': '/ProfileImages/AI.png'},
            isUsersGo: null,
            isUsersGoButton: false,
            activePlayerName: '',
            DiceRoll1Image: null,
            DiceRoll2Image: null,
            shouldChangeRound: false,
            isSecondCurrentGo: false,
            exitImage: [ExitImage, ExitFillImage],
            exitImageState: 0,
            playingDraw: false,
            shouldCheckDrawEnd: false,
        }
    }

    randomIntFromInterval = (min, max) => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    componentDidMount(){
        if(!sessionStorage.getItem('user')){
            window.location.href = `/login`;
        }else{
            this.setState({DiceRoll1Image: document.getElementById("dice1"), DiceRoll2Image: document.getElementById("dice2")});
            var randomNum = this.randomIntFromInterval(0,1);
            if(randomNum === 1){
                // the user will be starting
                this.setState({user: JSON.parse(sessionStorage.getItem('user')), isUsersGoButton: true, isUsersGo: true, activePlayerName: JSON.parse(sessionStorage.getItem('user')).username});
            }else{
                // ai seaborne will be starting
                this.setState({user: JSON.parse(sessionStorage.getItem('user')), isUsersGo: false, activePlayerName: 'Seaborne (Ai)'}, () =>{
                    // just get them started
                    this.aiPlay();
                });
            }
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

    aiDelay = (time) => {
        // this delay is purely for human entertainment, clearly computers are superior
        return new Promise(resolve => setTimeout(resolve, time));
    }

    aiPlay = async () => {
        await this.aiDelay(1000);
        this.onRollDice();
    }

    handleActiveUser = () => {
        if(this.state.isUsersGo){
            this.setState({isUsersGo: false, activePlayerName: 'Seaborne (Ai)'}, () => {
                this.aiPlay();
            });
        }else{
            this.setState({isUsersGo: true, activePlayerName: this.state.user.username, isUsersGoButton: true});
        }
    }

    onEndGame = async () => {
        if(this.state.playingDraw){
            this.state.computerUser.endScore = this.state.computerUserScore;
            this.state.user.endScore = this.state.guestUserScore;
            if(this.state.guestUserScore > this.state.computerUserScore){
                this.props.gameEndHandler(this.state.user, this.state.computerUser);
            }else{
                this.props.gameEndHandler(this.state.computerUser, this.state.user);
            }
        }else{
            if(this.state.guestUserScore !== this.state.computerUserScore){
                // the game really has concluded
                // await this.aiDelay(1000);
                this.state.computerUser.endScore = this.state.computerUserScore;
                this.state.user.endScore = this.state.guestUserScore;
                if(this.state.guestUserScore > this.state.computerUserScore){
                    this.props.gameEndHandler(this.state.user, this.state.computerUser);
                }else{
                    this.props.gameEndHandler(this.state.computerUser, this.state.user);
                }
    
            }else{
                // on game draw
                this.setState({playingDraw: true, guestUserScore: 0, computerUserScore: 0, currentRound: "Tiebreak"});
            }
        }
    }

    onRollDiceButtonClicked = () => {
        if(this.state.isUsersGoButton){
            this.setState({isUsersGoButton: false});
            this.onRollDice();
        }
    }

    onExitGame = () => {
        window.location.href = `/`;
    }

    checkDrawEnd = async () => {
        if(this.state.shouldCheckDrawEnd){
            if(this.state.guestUserScore !== this.state.computerUserScore){
                await this.aiDelay(1000);
                this.onEndGame();
            }else{
                console.log("Game draw still equal, we must continue");
                this.setState({shouldCheckDrawEnd: false});
            }
            // }else{
            //     this.setState({currentRound: this.state.currentRound + 1, shouldChangeRound: false});
            // }
        }else{
            this.setState({shouldCheckDrawEnd: true});
        }
    }


    onRollDice = async () => {
        if(this.state.isSecondCurrentGo){
            var diceRolled1 = this.randomIntFromInterval(1, 6);
            this.state.DiceRoll1Image.src = `/diceImages/DiceRoll${diceRolled1}.png`;
            this.state.DiceRoll2Image.src = DiceRoll0;
            if(this.state.isUsersGo){
                console.log(`User rolled: ${diceRolled1}`);
                this.setState({isSecondCurrentGo: false, guestUserScore: this.state.guestUserScore + diceRolled1});
            }else{
                console.log(`Ai rolled: ${diceRolled1}`);
                this.setState({isSecondCurrentGo: false,computerUserScore: this.state.computerUserScore + diceRolled1});
            }
            if(this.state.shouldChangeRound){
                if(this.state.currentRound + 1 > this.props.maxround){
                    await this.aiDelay(1000);
                    this.onEndGame();
                }else{
                    this.setState({currentRound: this.state.currentRound + 1, shouldChangeRound: false});
                }
            }else{
                this.setState({shouldChangeRound: true})
            }
    
            await this.aiDelay(2000);
    
            this.handleActiveUser();
        }else if(!this.state.isSecondCurrentGo && !this.state.playingDraw){
            var diceRolled1 = this.randomIntFromInterval(1, 6);
            var diceRolled2 = this.randomIntFromInterval(1, 6);
            this.state.DiceRoll1Image.src = `/diceImages/DiceRoll${diceRolled1}.png`;
            this.state.DiceRoll2Image.src = `/diceImages/DiceRoll${diceRolled2}.png`;
    
            var scoreToAdd = this.workoutScoreToAdd(diceRolled1, diceRolled2);
            if(this.state.isUsersGo){
                console.log(`User rolled: ${diceRolled1}, ${diceRolled2}`);
                if(this.state.guestUserScore + scoreToAdd < 0){
                    this.setState({guestUserScore: 0});
                }else{
                    this.setState({guestUserScore: this.state.guestUserScore + scoreToAdd});
                }
            }else{
                console.log(`AI rolled: ${diceRolled1}, ${diceRolled2}`);
                if(this.state.computerUserScore + scoreToAdd < 0){
                    this.setState({computerUserScore: 0});
                }else{
                    this.setState({computerUserScore: this.state.computerUserScore + scoreToAdd});
                }
            }
    
            if(diceRolled1 === diceRolled2){
                this.setState({isSecondCurrentGo: true});
                if(!this.state.isUsersGo){
                    this.aiPlay();
                }else{
                    this.setState({isUsersGoButton: true});
                }
            }
            else{
                await this.aiDelay(2000);
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
        }else{
            var diceRolled1 = this.randomIntFromInterval(1, 6);
            this.state.DiceRoll1Image.src = `/diceImages/DiceRoll${diceRolled1}.png`;
            this.state.DiceRoll2Image.src = DiceRoll0;
            if(this.state.isUsersGo){
                console.log(`User rolled: ${diceRolled1}`);
                this.setState({isSecondCurrentGo: false, guestUserScore: diceRolled1}, () => {
                    this.checkDrawEnd();
                });
            }else{
                console.log(`Ai rolled: ${diceRolled1}`);
                this.setState({isSecondCurrentGo: false,computerUserScore: diceRolled1}, () => {
                    this.checkDrawEnd();
                });
            }
    
            await this.aiDelay(2000);
    
            this.handleActiveUser();
        }
    }

    render(){
        return(
            <div id='vscomputergame'>
                <div id='gameBartop'>
                    <img onClick={() => this.onExitGame()} onPointerLeave={() => this.setState({exitImageState: 0})} onPointerEnter={() => this.setState({exitImageState: 1})} className="exitButton" src={this.state.exitImage[this.state.exitImageState]}></img>
                    <p id='roundText'>Round {this.state.currentRound}</p>
                </div>
                <div id='gameProfilesContainer'>
                    <div className="gameProfile gameProfileTop">
                        <img className="gameProfileImage" src={this.state.user ? this.state.user.profileImage : ''}></img>
                        <div className="gameProfileNameScoreContainer">
                            <p className="gameProfileName">{this.state.user ? this.state.user.username : ''}</p>
                            <p className="gameProfileScore">{this.state.guestUserScore}</p>
                        </div>
                    </div>
                    <div className="gameProfile">
                        <img className="gameProfileImage" src={this.state.computerUser ? this.state.computerUser.profileImage : ''}></img>
                        <div className="gameProfileNameScoreContainer">
                            <p className="gameProfileName">Seaborne (Ai)</p>
                            <p className="gameProfileScore">{this.state.computerUserScore}</p>
                        </div>
                    </div>
                </div>
                <p id='turnText'>{this.state.activePlayerName}'s Turn!</p>
                <p id='doubleText'>{this.state.isSecondCurrentGo ? 'DOUBLE!' : ''} </p>
                <div id='diceContainer'>
                    <img id='dice1' src={DiceRoll0} className="dice"></img>
                    <img id='dice2' src={DiceRoll0} className="dice"></img>
                </div>
                
                <a onClick={() => this.onRollDiceButtonClicked()} className={this.state.isUsersGoButton ? 'buttonContainer buttonGreen' : 'buttonContainer buttonGreen gameButtonNotActive'}>
                    <p>Roll Dice</p>
                </a>
            </div>
        )
    }
}

export default VSComputerGame;