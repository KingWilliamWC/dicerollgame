import React, { Component } from "react";

import axios from "axios";

import SettingsProfileImageSelect from "./SettingsProfileImageSelect";

class AccountSettings extends Component{
    constructor(props){
        super(props);

        this.state = {
            user: null,
            changeProfileImage: false,
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

    onProfileImageEditFinished = (newProfileImage) => {
        var sendData = {
            'id': JSON.parse(sessionStorage.getItem('user'))._id,
            'newProfileImage': newProfileImage,
        }
        this.updateProfileImage(sendData)
        .then((data) => {
            if(data.success){
                console.log("Finished updating user profile image");
                sessionStorage.setItem('user', JSON.stringify(data.user));
                this.setState({changeProfileImage: false, user: data.user});
                this.props.updateBartopImage(data.user.profileImage);
            }
        })
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
                                <p id='usernameEditPreviewText'>KingWilliamWC</p>
                                <p id='imageChangeTextButton'>Edit</p>
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