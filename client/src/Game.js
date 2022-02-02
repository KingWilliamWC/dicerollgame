import React, { Component } from "react";

import './Game.css';

import DiceRoll0 from './Images/DiceRoll0.png';

// import profileImageTest from './Images/ProfileImageTest.png';
import ExitImage from './SVG/Exit.svg';
import ExitFillImage from './SVG/Exit-Fill.svg';

class Game extends Component{
    constructor(props){
        super(props);

        this.state = {
            hostUserScore: 0,
            guestUserScore: 0,
            currentRound: 1,
            isHost: false,
            isSecond: false,
            activePlayerName: '',
            isSecondCurrentGo: false,
            isOurGo: false,
            DiceRoll1Image: null,
            DiceRoll2Image: null,
            exitImage: [ExitImage, ExitFillImage],
            exitImageState: 0,
            isPlayingDraw: false,
        }
    }

    startGame = () => {
        var randomNum = Math.round(Math.random());
        this.props.socket.emit('start game', {"randomNum": randomNum, 'gameid': sessionStorage.getItem('gameid')});
    }
    updatePlayerActiveText = () => {
        if(this.state.activePlayerName === this.props.hostUser.username){
            // the host user is active flip to guest user
            this.setState({activePlayerName: this.props.guestUser.username});
        }else{
            // the guest user must have been active
            this.setState({activePlayerName: this.props.hostUser.username});
        }
    }

    handleNextRound = () => {
        if(this.state.currentRound + 1 > this.props.maxRound && !this.state.isPlayingDraw){
            var hostUser = this.props.hostUser;
            hostUser.endScore = this.state.hostUserScore;
            var guestUser = this.props.guestUser;
            guestUser.endScore = this.state.guestUserScore;
            var winner = {};
            var loser = {};
            //console.log(hostUser);
            if(this.state.hostUserScore > this.state.guestUserScore){
                this.props.endGameHandler(hostUser, guestUser);
            }else if(this.state.guestUserScore > this.state.hostUserScore){
                this.props.endGameHandler(guestUser, hostUser);
            }else{
                //("Tiebreak!!");
                this.props.socket.emit('play tiebreak', {'gameid': sessionStorage.getItem('gameid')});
            }            
        }else{
            this.props.socket.emit('next round', {'gameid': sessionStorage.getItem('gameid')});
        }
    }

    // componentWillUnmount(){
        // console.log("game unmounting");
    // }

    handleActivePlayer = () => {
        if(this.state.isOurGo && this.state.isPlayingDraw && this.state.isSecond){
            var hostUser = this.props.hostUser;
            hostUser.endScore = this.state.hostUserScore;
            var guestUser = this.props.guestUser;
            guestUser.endScore = this.state.guestUserScore;
            if(this.state.hostUserScore > this.state.guestUserScore){
                this.props.endGameHandler(hostUser, guestUser);
            }else if (this.state.guestUserScore > this.state.hostUserScore){
                this.props.endGameHandler(guestUser, hostUser);
            }
        }
        if(this.state.isOurGo){
            if(this.state.isSecond){
                this.handleNextRound();
            }
            this.setState({isOurGo: false});
        }else{
            this.setState({isOurGo: true});
        }
    }

    componentDidMount(){
        this.setState({DiceRoll1Image: document.getElementById("dice1"), DiceRoll2Image: document.getElementById("dice2")});
        const url = new URL(window.location.href);
        if(url.searchParams.get("jointype")){
            if(url.searchParams.get("jointype") === 'create'){
                this.setState({isHost: true}, () => {
                    this.startGame();
                })
            }
        }

        this.props.socket.on('game force exit', (data) => {
            window.location.href = `/`;
        })

        this.props.socket.on('start game', (data) => {
            if(data.userToStart === 'host' && this.state.isHost){
                // the host (which is us) has been selected to go first
                //console.log("It's our turn first");
                this.setState({isOurGo: true});
            }else if(data.userToStart === 'guest' && !this.state.isHost){
                // the guest (which is us) has been selected to go first
                //console.log("It's our turn first");
                this.setState({isOurGo: true});
            }else{
                this.setState({isSecond: true});
            }
            data.userToStart === 'host' ? this.setState({activePlayerName: this.props.hostUser.username}) : this.setState({activePlayerName: this.props.guestUser.username})
            // console.log(data);
        })

        this.props.socket.on('player turn', (data) => {
            this.state.DiceRoll1Image.src = `/diceImages/DiceRoll${data.diceRolled1}.png`;
            this.state.DiceRoll2Image.src = `/diceImages/DiceRoll${data.diceRolled2}.png`;
            if(this.state.isOurGo){
                //console.log(data);
                if(this.state.isHost){
                    // handle score for us (we are the host)
                    if(this.state.hostUserScore + data.scoreToAdd < 0){
                        this.setState({hostUserScore: 0})
                    }else{
                        this.setState({hostUserScore: this.state.hostUserScore + data.scoreToAdd})
                    }
                }else{
                    // we must be the guest
                    if(this.state.guestUserScore + data.scoreToAdd < 0){
                        this.setState({guestUserScore: 0})
                    }else{
                        this.setState({guestUserScore: this.state.guestUserScore + data.scoreToAdd})
                    }
                }
            }else{
                // just set the score
                if(this.state.isHost){
                    // we are the host and we are recieving this because of a guest action
                    if(this.state.guestUserScore + data.scoreToAdd < 0){
                        this.setState({guestUserScore: 0})
                    }else{
                        this.setState({guestUserScore: this.state.guestUserScore + data.scoreToAdd})
                    }
                }else{
                    // we must be the guest
                    if(this.state.hostUserScore + data.scoreToAdd < 0){
                        this.setState({hostUserScore: 0})
                    }else{
                        this.setState({hostUserScore: this.state.hostUserScore + data.scoreToAdd})
                    }
                }
            }
            // after the scoring has been handled
            if(data.goAgain){
                this.setState({isSecondCurrentGo: true});
            }else if(!data.goAgain && this.state.isOurGo){
                // it's the end of our go
                if(this.state.isSecond){
                    // we are the second person so check for end of round, else next iter of round
                    this.handleNextRound();
                }
                this.setState({isOurGo: false});
            }else if(!data.goAgain && !this.state.isOurGo){
                // end of other persons go and now it ours
                this.setState({isOurGo: true});
            }

            if(!data.goAgain){
                this.updatePlayerActiveText();
            }
        })

        this.props.socket.on('extra turn', (data) => {
            this.state.DiceRoll1Image.src = `/diceImages/DiceRoll${data.diceRolled1}.png`;
            this.state.DiceRoll2Image.src = `/diceImages/DiceRoll0.png`;
            this.setState({isSecondCurrentGo: false});
            if(this.state.isOurGo){
                //console.log("It's our lucky day today");
                //console.log(data);
                if(this.state.isHost){
                    // the host (which is us) extra turn
                    this.setState({hostUserScore: this.state.hostUserScore + data.scoreToAdd}, () => {
                        this.handleActivePlayer();
                    });
                }else{
                    // we must be the guest
                    this.setState({guestUserScore: this.state.guestUserScore + data.scoreToAdd}, () => {
                        this.handleActivePlayer();
                    });
                }
            }else{
                //console.log("It's the other persons lucky day today");
                if(this.state.isHost){
                    this.setState({guestUserScore: this.state.guestUserScore + data.scoreToAdd}, () => {
                        this.handleActivePlayer();
                    });
                }else{
                    this.setState({hostUserScore: this.state.hostUserScore + data.scoreToAdd}, () => {
                        this.handleActivePlayer();
                    });
                }
            }

            //after the scoring has been handled



            // username active handle
            this.updatePlayerActiveText();
        })

        this.props.socket.on('tiebreak turn', (data) => {
            this.state.DiceRoll1Image.src = `/diceImages/DiceRoll${data.diceRolled1}.png`;
            this.state.DiceRoll2Image.src = `/diceImages/DiceRoll0.png`;
            this.setState({isSecondCurrentGo: false});
            if(this.state.isOurGo){
                //("It's our lucky day today");
                //console.log(data);
                if(this.state.isHost){
                    // the host (which is us) extra turn
                    this.setState({hostUserScore: data.diceRolled1}, () => {
                        this.handleActivePlayer();
                    });
                }else{
                    // we must be the guest
                    this.setState({guestUserScore: data.diceRolled1}, () => {
                        this.handleActivePlayer();
                    });
                }
            }else{
                //console.log("It's the other persons lucky day today");
                if(this.state.isHost){
                    this.setState({guestUserScore: data.diceRolled1}, () => {
                        this.handleActivePlayer();
                    });
                }else{
                    this.setState({hostUserScore: data.diceRolled1}, () => {
                        this.handleActivePlayer();
                    });
                }
            }
        })

        this.props.socket.on('next round', (data) => {
            if(!this.state.isPlayingDraw){
                // only add 1 if it's standard state
                this.setState({currentRound: this.state.currentRound + 1});
            }
        })

        // this.props.socket.on('score set', (data) => {
        //     if(data.userToAdd === 'host'){
        //         this.setState({hostUserScore: data.scoreToSet});
        //     }else{
        //         // we must be setting th
        //     }
        // })

        this.props.socket.on('play tiebreak', (data) => {
            this.setState({currentRound: 'Tiebreak',hostUserScore: 0, guestUserScore: 0, isPlayingDraw: true});
        })
    }

    onRollDice = () => {
        if(this.state.isOurGo && this.state.isSecondCurrentGo && !this.state.isPlayingDraw){
            // this is the one roll dice game state
            var diceRolled1 = Math.floor(Math.random() * (6 - 1 + 1) + 1);
            this.props.socket.emit('extra turn', ({"diceRolled1": diceRolled1, 'gameid': sessionStorage.getItem('gameid')}));
        }
        else if(this.state.isOurGo && !this.state.isSecondCurrentGo && !this.state.isPlayingDraw){
            // this is the multi roll dice game state
            var diceRolled1 = Math.floor(Math.random() * (6 - 1 + 1) + 1);
            var diceRolled2 = Math.floor(Math.random() * (6 - 1 + 1) + 1);
            //console.log(diceRolled1);
            this.props.socket.emit('player turn', ({"diceRolled1": diceRolled1, "diceRolled2": diceRolled2, 'gameid': sessionStorage.getItem('gameid')}));
        }else if(this.state.isPlayingDraw){
            // this is the one roll tiebreak dice game state
            var diceRolled1 = Math.floor(Math.random() * (6 - 1 + 1) + 1);
            this.props.socket.emit('tiebreak turn', {"diceRolled1": diceRolled1, 'gameid': sessionStorage.getItem('gameid')});
        }else{
            // this should not happen, we screwed up massively if it did
            console.log("errrr... nothing to do");
        }
    }

    onExitGame = () => {
        this.props.socket.emit('game force exit', {'gameid': sessionStorage.getItem('gameid')});
    }
    render(){
        return(
            <div id='game'>
                <div id='gameBartop'>
                    <img onClick={() => this.onExitGame()} onPointerLeave={() => this.setState({exitImageState: 0})} onPointerEnter={() => this.setState({exitImageState: 1})} className="exitButton" src={this.state.exitImage[this.state.exitImageState]}></img>
                    <p id='roundText'>Round {this.state.currentRound}</p>
                </div>
                <div id='gameProfilesContainer'>
                    <div className="gameProfile gameProfileTop">
                        <img className="gameProfileImage" src={this.props.hostUser.profileImage}></img>
                        <div className="gameProfileNameScoreContainer">
                            <p className="gameProfileName">{this.props.hostUser.username}</p>
                            <p className="gameProfileScore">{this.state.hostUserScore}</p>
                        </div>
                    </div>
                    <div className="gameProfile">
                        <img className="gameProfileImage" src={this.props.guestUser.profileImage}></img>
                        <div className="gameProfileNameScoreContainer">
                            <p className="gameProfileName">{this.props.guestUser.username}</p>
                            <p className="gameProfileScore">{this.state.guestUserScore}</p>
                        </div>
                    </div>
                </div>
                <p id='turnText'>{this.state.activePlayerName}'s Turn!</p>
                <p id='doubleText'>{this.state.isSecondCurrentGo ? 'DOUBLE!' : ''} </p>
                <div id='diceContainer'>
                    <img id='dice1' src={DiceRoll0} className="dice"></img>
                    <img id='dice2' src={DiceRoll0} className="dice"></img>
                </div>
                
                <a onClick={() => this.onRollDice()} className={this.state.isOurGo ? 'buttonContainer buttonGreen' : 'buttonContainer buttonGreen gameButtonNotActive'}>
                    <p>Roll Dice</p>
                </a>
            </div>
        )
    }
}

export default Game;