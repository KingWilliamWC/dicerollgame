import React, { Component } from "react";

import { io } from 'socket.io-client';

import './GameJoin.css';

import NoUser from "./NoUser";

import profileImageTest from './Images/ProfileImageTest.png';

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
        }
    }

    onUserInfo = (data) => {
        if(data.username !== this.state.user.username){
            this.state.isHost ? this.setState({guestUser: data, userConnected: true}, () => {console.log(this.state.guestUser)}) : this.setState({hostUser: data, userConnected: true})
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
        this.setState({isHost: true} , () => {
            const socket = io(url);
            socket.on('connect', () => {
                // check session storage key exists, request to server to create game with previously server generated gameid
                if(sessionStorage.getItem('gameid') !== null){
                    socket.emit('create game', {'gameid': sessionStorage.getItem('gameid')})
                }else{
                    console.log("no id to connect to");
                }
            });
    
            socket.on('user join', (data) => {
                socket.emit('user info', {'user': JSON.parse(sessionStorage.getItem('user')), 'gameid': sessionStorage.getItem('gameid')})
            })

            socket.on('ready update', (data) => {
                this.onReadyUpdate(data);
            })
    
            socket.on('user info', (data) => {
                this.onUserInfo(data);
            })

            this.setState({socket: socket});
        });        
    }

    joinGame = (url) => {
        const socket = io(url);
        socket.on('connect', () => {
            // check session storage game id exists
            if(sessionStorage.getItem('gameid') !== null){
                socket.emit('join game', {'username': "William", 'gameid': sessionStorage.getItem('gameid')})
            }else{
                console.log("no id to connect to");
            }
        });

        socket.on('user join', (data) => {
            socket.emit('user info', {'user': JSON.parse(sessionStorage.getItem('user')), 'gameid': sessionStorage.getItem('gameid')})
        })

        socket.on('user info', (data) => {
            this.onUserInfo(data);
        })

        socket.on('ready update', (data) => {
            this.onReadyUpdate(data);
        })

        this.setState({socket: socket});
    }

    updateReadyState = () => {
        this.state.isHost ? this.state.socket.emit('ready update',  {'user': JSON.parse(sessionStorage.getItem('user')), 'ready': !this.state.isHostUserReady, 'gameid': sessionStorage.getItem('gameid')})
        : this.state.socket.emit('ready update',  {'user': JSON.parse(sessionStorage.getItem('user')), 'ready': !this.state.isGuestUserReady, 'gameid': sessionStorage.getItem('gameid')})
    }
    componentDidMount() {
        // check if signed in before continuing
        if(sessionStorage.getItem('user')){
            // set user state for future use, await callback
            this.setState({user: JSON.parse(sessionStorage.getItem('user'))}, () => {
                const url = new URL(window.location.href);
                if(url.searchParams.get("jointype")){
                    if(url.searchParams.get("jointype") === 'create'){
                        console.log("Creating game");
                        this.createGame('http://192.168.2.37:81/');
                    }else if (url.searchParams.get("jointype") === 'join'){
                        console.log("Joining game");
                        this.joinGame('http://192.168.2.37:81/');
                    }
                }else{
                    window.location.href = `/`;
                }
            })
        }
    }
    render(){
        return(
            <div id='gameJoin'>
                <div id='gameJoinContainer'>
                    <div id='gameJoinTitle'>
                        <p id='gameIDText'>Game ID: <span id='gameIDValue'>{sessionStorage.getItem('gameid') ? sessionStorage.getItem('gameid') : ''}</span></p>
                    </div>
                    <div id='gameJoinUsersContainer'>
                        {this.state.isHost ? 
                        <div className="gameJoinUser">
                            <img className="gameJoinProfileImage" src={profileImageTest}></img>
                            <p className="gameJoinProfileName">{this.state.user ? this.state.user.username : ''}</p>
                            {/*  */}
                            {this.state.isHostUserReady ?
                                <p className="readyText">Ready</p>
                            :
                                <p className="notReadyText">Not Ready</p>
                            }
                            <button onClick={() => this.updateReadyState()} >Ready</button>
                        </div>
                        :
                        <div className="gameJoinUser">
                            <img className="gameJoinProfileImage" src={profileImageTest}></img>
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
                                <img className="gameJoinProfileImage" src={profileImageTest}></img>
                                <p className="gameJoinProfileName">{this.state.guestUser ? this.state.guestUser.username : ''}</p>
                                {this.state.isGuestUserReady ?
                                <p className="readyText">Ready</p>
                                :
                                    <p className="notReadyText">Not Ready</p>
                                }
                            </div>
                            :
                            <div className="gameJoinUser gameJoinUserLeft">
                                <img className="gameJoinProfileImage" src={profileImageTest}></img>
                                <p className="gameJoinProfileName">{this.state.user ? this.state.user.username : ''}</p>
                                {this.state.isGuestUserReady ?
                                <p className="readyText">Ready</p>
                                :
                                    <p className="notReadyText">Not Ready</p>
                                }
                                <button onClick={() => this.updateReadyState()} >Ready</button>
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