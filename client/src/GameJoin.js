import React, { Component } from "react";

// import { io } from 'socket.io-client';

import './GameJoin.css';

import NoUser from "./NoUser";

import profileImageTest from './Images/ProfileImageTest.png';

import ExitImage from './SVG/Exit.svg';
import ExitFillImage from './SVG/Exit-Fill.svg';

class GameJoin extends Component{
    constructor(props){
        super(props);

        this.state = {
            isHost: false,
            user: null,
            hostUser: null,
            guestUser: null,
            isGuestUserReady: false,
            isHostUserReady: false,
            userConnected: false,
            socket: null,
            exitImage: [ExitImage, ExitFillImage],
            exitImageState: 0,
        }
    }

    onUserInfo = (data) => {
        if(data.username !== this.state.user.username){
            // console.log(data);
            this.state.isHost ? this.setState({guestUser: data, userConnected: true, }) : this.setState({hostUser: data, userConnected: true, isHostUserReady: data.ready})
        }
    }

    onReadyUpdate = (data) => {
        if(data.user.username === this.state.user.username){
            this.state.isHost ? this.setState({isHostUserReady: data.ready}) : this.setState({isGuestUserReady: data.ready});
        }else{
            this.state.isHost ? this.setState({isGuestUserReady: data.ready}) : this.setState({isHostUserReady: data.ready});
        }
        // this.state.isHost ? this.setState({isGuestUserReady: data.ready}) : this.setState({isHostUserReady: data.ready});
        // if(data.user.username !== this.state.user.username){
        // }else{

        // }
    }

    createGame = (url) => {
        this.setState({isHost: true, hostUser: JSON.parse(localStorage.getItem('user'))} , () => {
            // const socket = io(url);
            this.props.socket.on('connect', () => {
                // check session storage key exists, request to server to create game with previously server generated gameid
                if(localStorage.getItem('gameid') !== null){
                    this.props.socket.emit('create game', {'gameid': localStorage.getItem('gameid')})
                }else{
                    console.log("no id to connect to");
                }
            });

            this.props.socket.on('force exit', (data) => {
                // console.log("Leaving game");
                if(data.isHost){
                    // the entire game has ended and there is no host
                    window.location.href = `/`;
                }else if(!data.isHost && this.state.isHost){
                    // the guest has infact left remove them from the render
                    this.setState({
                        guestUser: null,
                        isGuestUserReady: false,
                        userConnected: false,

                    })
                }else if(!data.isHost && !this.state.isHost){
                    // we have recieved the cue to leave
                    window.location.href = `/`;
                }
            })
    
            this.props.socket.on('user join', (data) => {
                var userData = JSON.parse(localStorage.getItem('user'));
                userData.ready = this.state.isHost ? this.state.isHostUserReady : this.state.isGuestUserReady;
                this.props.socket.emit('user info', {'user': userData, 'gameid': localStorage.getItem('gameid')})
            })

            this.props.socket.on('ready update', (data) => {
                this.onReadyUpdate(data);
            })
    
            this.props.socket.on('user info', (data) => {
                this.onUserInfo(data);
            })

            this.setState({socket: this.props.socket});
        });        
    }

    joinGame = (url) => {
        // const socket = io(url);
        this.props.socket.on('connect', () => {
            // check session storage game id exists
            if(localStorage.getItem('gameid') !== null){
                this.props.socket.emit('join game', {'username': "William", 'gameid': localStorage.getItem('gameid')})
            }else{
                console.log("no id to connect to");
            }
        });

        this.props.socket.on('force exit', (data) => {
            // console.log("Leaving game");
            if(data.isHost){
                // the entire game has ended and there is no host
                window.location.href = `/`;
            }else if(!data.isHost && this.state.isHost){
                // the guest has infact left remove them from the render
                this.setState({
                    guestUser: null,
                    isGuestUserReady: false,
                    userConnected: false,

                })
            }else if(!data.isHost && !this.state.isHost){
                // we have recieved the cue to leave
                window.location.href = `/`;
            }
        })

        this.props.socket.on('user join', (data) => {
            this.props.socket.emit('user info', {'user': JSON.parse(localStorage.getItem('user')), 'gameid': localStorage.getItem('gameid')})
        })

        this.props.socket.on('user info', (data) => {
            this.onUserInfo(data);
        })

        this.props.socket.on('ready update', (data) => {
            this.onReadyUpdate(data);
        })

        this.setState({socket: this.props.socket, guestUser: JSON.parse(localStorage.getItem('user'))});
    }

    updateReadyState = () => {
        this.state.isHost ? this.state.socket.emit('ready update',  {'user': JSON.parse(localStorage.getItem('user')), 'ready': !this.state.isHostUserReady, 'gameid': localStorage.getItem('gameid')})
        : this.state.socket.emit('ready update',  {'user': JSON.parse(localStorage.getItem('user')), 'ready': !this.state.isGuestUserReady, 'gameid': localStorage.getItem('gameid')})
    }

    onStartGame = () => {
        if(this.state.isGuestUserReady && this.state.isHostUserReady){
            this.props.gameStartedHandler(this.state.hostUser, this.state.guestUser);
        }
    }

    componentDidMount() {
        // check if signed in before continuing
        if(localStorage.getItem('user')){
            // set user state for future use, await callback
            this.setState({user: JSON.parse(localStorage.getItem('user'))}, () => {
                const url = new URL(window.location.href);
                if(url.searchParams.get("jointype")){
                    if(url.searchParams.get("jointype") === 'create'){
                        console.log("Creating game");
                        this.createGame();
                    }else if (url.searchParams.get("jointype") === 'join'){
                        console.log("Joining game");
                        this.joinGame();
                    }
                }else{
                    window.location.href = `/`;
                }
            })
        }
    }

    onExitGame = () => {
        this.props.socket.emit('force exit', {'isHost': this.state.isHost, 'gameid': localStorage.getItem('gameid')});
    }

    render(){
        return(
            <div id='gameJoin'>
                <div id='gameJoinContainer'>
                    <div id='gameJoinTitle'>
                        <img onClick={() => this.onExitGame()} onPointerLeave={() => this.setState({exitImageState: 0})} onPointerEnter={() => this.setState({exitImageState: 1})} className="exitButton" src={this.state.exitImage[this.state.exitImageState]}></img>
                        <p id='gameIDText'>Game ID: <span id='gameIDValue'>{localStorage.getItem('gameid') ? localStorage.getItem('gameid') : ''}</span></p>
                    </div>
                    {this.state.isHost ?
                    <div id='startContainer'>
                        <a onClick={() => this.onStartGame()} className={this.state.isGuestUserReady && this.state.isHostUserReady ? "startButton" : "startButton startButtonNotReady"}>
                            <p>Start</p>
                        </a>
                    </div>
                    : ""}
                    <div id='gameJoinUsersContainer'>
                        {this.state.isHost ? 
                        <div className="gameJoinUser">
                            <img className="gameJoinProfileImage" src={this.state.user.profileImage}></img>
                            <p className="gameJoinProfileName">{this.state.user ? this.state.user.username : ''}</p>
                            {/*  */}
                            {this.state.isHostUserReady ?
                                <p className="readyText">Ready</p>
                            :
                                <p className="notReadyText">Not Ready</p>
                            }
                            {this.state.isHostUserReady ?
                                <div className="readyButton unReady" onClick={() => this.updateReadyState()} ><p>Unready</p></div>
                            :
                                <div className="readyButton" onClick={() => this.updateReadyState()} ><p>Ready</p></div>
                            }
                        </div>
                        :
                        <div className="gameJoinUser">
                            <img className="gameJoinProfileImage" src={this.state.hostUser ? this.state.hostUser.profileImage: ''}></img>
                            <p className="gameJoinProfileName">{this.state.hostUser ? this.state.hostUser.username : 'no name'}</p>
                            {/* <p className="readyText">Ready</p> */}
                            {this.state.isHostUserReady ?
                                <p className="readyText">Ready</p>
                            :
                                <p className="notReadyText">Not Ready</p>
                            }
                        </div>
                        }
                        <div id='gameJoinVsCentre'>
                            <div id='gameJoinVsLine'>
                                <div id='gameJoinVsCircle'>
                                    <p>VS</p>
                                </div>
                            </div>
                        </div>
                        {this.state.userConnected ?
                            this.state.isHost ? 
                            
                            <div className="gameJoinUser gameJoinUserLeft">
                                <img className="gameJoinProfileImage" src={this.state.guestUser.profileImage}></img>
                                <p className="gameJoinProfileName">{this.state.guestUser ? this.state.guestUser.username : ''}</p>
                                {this.state.isGuestUserReady ?
                                <p className="readyText">Ready</p>
                                :
                                    <p className="notReadyText">Not Ready</p>
                                }
                            </div>
                            :
                            <div className="gameJoinUser gameJoinUserLeft">
                                <img className="gameJoinProfileImage" src={this.state.user.profileImage}></img>
                                <p className="gameJoinProfileName">{this.state.user ? this.state.user.username : ''}</p>
                                {this.state.isGuestUserReady ?
                                <p className="readyText">Ready</p>
                                :
                                    <p className="notReadyText">Not Ready</p>
                                }
                                {this.state.isGuestUserReady ?
                                <div className="readyButton unReady" onClick={() => this.updateReadyState()} ><p>Unready</p></div>
                                :
                                    <div className="readyButton" onClick={() => this.updateReadyState()} ><p>Ready</p></div>
                                }
                            </div>
                        :
                        <NoUser/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default GameJoin;