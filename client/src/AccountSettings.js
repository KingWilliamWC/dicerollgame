import React, { Component } from "react";

import axios from "axios";

import SettingsProfileImageSelect from "./SettingsProfileImageSelect";

class AccountSettings extends Component{
    constructor(props){
        super(props);

        this.state = {
            user: null,
            changeProfileImage: false,
            changeUsername: false,
            errorText: ['Username Taken!', 'Username must be at least 4 characters', "Username can't be longer than 24 characters"],
            errorTextState: 0,
            errorState: 0,
        }
    }

    componentDidMount(){
        var storageUser = JSON.parse(sessionStorage.getItem('user'));
        this.setState({user: storageUser});
    }

    onProfileImageEditClick = () => {
        this.setState({changeProfileImage: true})
    }

    async updateProfileImage(sendData){
        const res = await axios.post(this.props.routes.updateprofileimage, sendData);
        return await res.data;
    }

    async updateUsername(sendData){
        const res = await axios.post(this.props.routes.updateusername, sendData);
        return await res.data;
    }

    onProfileImageEditFinished = (newProfileImage) => {
        var sendData = {
            'id': JSON.parse(sessionStorage.getItem('user'))._id,
            'newProfileImage': newProfileImage,
        }
        this.updateProfileImage(sendData)
        .then((data) => {
            if(data.success){
                console.log("Finished updating user profile image");
                console.log(data);
                sessionStorage.setItem('user', JSON.stringify(data.user));
                this.setState({changeProfileImage: false, user: data.user});
                this.props.updateBartopImage(data.user.profileImage);
            }
        })
    }

    onEditUsername = () => {
        this.setState({changeUsername: true}, () => {
            document.getElementById("usernameEditInput").value = this.state.user.username;
            document.getElementById("usernameEditInput").focus();
        });
    }

    onEditUsernameDone = () => {
        this.setState({
            errorTextState: 0,
            errorState: 0,
        }, () => {
            var newUsername = document.getElementById("usernameEditInput").value.trim();
            // console.log(newUsername.length);
            if(newUsername.length >= 4 && newUsername.length <= 24 && newUsername !== this.state.user.username){
                // don't bother if it is not
                var sendData = {
                'newUsername': newUsername,
                'currentUsername': this.state.user.username,
                'id': this.state.user._id
                }
                this.updateUsername(sendData)
                .then((data) => {
                    if(data.success){
                        var currentUser = this.state.user;
                        currentUser.username = data.username;
                        sessionStorage.setItem('user', JSON.stringify(currentUser));
                        this.setState({user: currentUser, changeUsername: false});
                    }else if (data.reason === 'duplicate'){
                        this.setState({errorState: 1});
                    }
                })
            }else if(newUsername === this.state.user.username){
                this.setState({changeUsername: false});
            }else if(newUsername.length < 4){
                this.setState({errorState: 1, errorTextState: 1});
            }else if(newUsername.length > 24){
                this.setState({errorState: 1, errorTextState: 2});
            }
        })
    }

    onEditUsernameCancel = () => {
        this.setState({changeUsername: false});
    }

    // onProfileImageEditFinished = (newProfileImage) => {
    //     this.props.saveProfileImageHandler(newProfileImage);
    // }
    render(){
        return(
            <div id='accountSettings'>
                {this.state.changeProfileImage ? <SettingsProfileImageSelect currentImage={this.state.user.profileImage} onFinished={this.onProfileImageEditFinished}/> :
                <div id="gameHistoryWrapper">
                    <p className="tabTitle">My account</p>
                    <div className="tabUnderline"></div>
                    <div id="accountSettingsContentContainer">
                        <div id='imageChangeContainer'>
                            <img id="userImageChangeImage" src={this.state.user ? this.state.user.profileImage : ''}></img>
                            <p onClick={() => this.onProfileImageEditClick()} id='imageChangeTextButton'>Edit</p>
                        </div>
                        <div id='usernameEditContainer'>
                            <p id='usernameEditTitle'>Username:</p>
                            <div id='usernameEditContent'>
                                {this.state.changeUsername ?
                                <div id='editUsernameContainer'>
                                    {this.state.errorState === 1 ?
                                    <p className="errorText">{this.state.errorText[this.state.errorTextState]}</p>
                                    :
                                    ''
                                    }
                                    <input maxLength={24} onKeyPress={(e) => {if(e.key === 'Enter'){this.onEditUsernameDone()}}} autoComplete="off" id='usernameEditInput'></input>
                                    <div id='submitButtons'>
                                        <div onClick={() => this.onEditUsernameCancel()} className="cancelButton completeButton">
                                            <p>Cancel</p>
                                        </div>
                                        <div onClick={() => this.onEditUsernameDone()} className="completeButton buttonRight">
                                            <p>Done</p>
                                        </div>
                                    </div>

                                </div>
                                :
                                <div id='editUsernamePreviewContainer'>
                                    <p id='usernameEditPreviewText'>{this.state.user ? this.state.user.username : ''}</p>
                                    <p onClick={() => this.onEditUsername()} id='imageChangeTextButton'>Edit</p>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default AccountSettings;