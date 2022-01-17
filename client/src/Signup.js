import React, { Component } from "react";

import ProfileImageSelect from "./ProfileImageSelect";

import axios from "axios";

class Signup extends Component{
    constructor(props){
        super(props);

        this.state = {
            userNameErrorClasses: ['errorHide', 'errorText'],
            userNameErrorText: ["Username must be at least 4 characters", "Username already exists"],
            userNameErrorTextState: 0,
            userNameErrorState: 0,
            passwordErrorClasses: ['errorHide', 'errorText'],
            passwordErrorText: ['Password must be at least 4 characters', `Passwords don't match`],
            passwordErrorTextState: 1,
            passwordErrorState: 0,

            signupState: 0,
            signupContainerClasses: ['registrationContainer', 'registrationContainerHide'],
            ProfileImageSelectClasses: ['profileImageSelectHide', 'profileImageSelectShow'],
            newUserID: null,
        }
    }

    async signupUser(sendData){
        const res = await axios.post(this.props.routes.signup, sendData);
        return await res.data;
    }
    userSignup = () => {
        this.setState({userNameErrorState: 0, passwordErrorState: 0}, () => {
            var inputError = false;
            var newUsername = document.getElementById("usernameInput").value.trim();
            var newPassword = document.getElementById("userPassword").value;
            var confirmedPassword = document.getElementById("confirmPassword").value;
            var newUsernameErrorState = 0; // default to nothing
            var newPasswordErrorState = 0; // default to nothing
            var newPasswordErrorTextState = 0;
            if(newUsername.length < 4){
                newUsernameErrorState = 1;
                inputError = true;
            }
            if(newPassword.length < 4){
                newPasswordErrorState = 1;
                newPasswordErrorTextState = 0;
                inputError = true;
            }else if(newPassword !== confirmedPassword){
                newPasswordErrorState = 1;
                newPasswordErrorTextState = 1;
                inputError = true;
            }
            this.setState({userNameErrorState: newUsernameErrorState, passwordErrorState: newPasswordErrorState, passwordErrorTextState: newPasswordErrorTextState}, () => {
                if(!inputError){
                    var sendData = {
                        'username': newUsername,
                        'password': newPassword,
                    }

                    this.signupUser(sendData)
                    .then(data => {
                        if(!data.success && data.reason === 'duplicate'){
                            // we can't have duplicate users
                            this.setState({userNameErrorState: 1, userNameErrorTextState: 1})
                        }
                        if(data.success){
                            sessionStorage.setItem("user", JSON.stringify(data.user));
                            this.setState({signupState: 1, newUserID: data.id});
                        }
                    })
                }
            })
        })
    }
    async updateProfileImage(sendData){
        const res = await axios.post(this.props.routes.updateprofileimage, sendData);
        return await res.data;
    }
    onProfileImageFinished = (url) => {
        var sendData = {
            'id': this.state.newUserID,
            'newProfileImage': url,
        }
        this.updateProfileImage(sendData)
        .then(data => {
            if(data.success){
                sessionStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = `/`;
            }
        })
    }
    render(){
        return(
            <div id='signup'>
                <p className="diceRollGameRegisterLogo">Dice Roll Game</p>
                <div className={this.state.signupContainerClasses[this.state.signupState]}>
                    <p className="registerTabTitle">Sign Up</p>
                    <div id="loginInputsContainer">
                        <p className={this.state.userNameErrorClasses[this.state.userNameErrorState]}>{this.state.userNameErrorText[this.state.userNameErrorTextState]}</p>
                        <input onKeyPress={(e) => {if(e.key === 'Enter'){this.userSignup()}}} maxLength={24} placeholder="Username" id='usernameInput' className="registerInput"></input>
                        <p className={this.state.passwordErrorClasses[this.state.passwordErrorState]}>{this.state.passwordErrorText[this.state.passwordErrorTextState]}</p>
                        <input onKeyPress={(e) => {if(e.key === 'Enter'){this.userSignup()}}} type={"password"} placeholder="Password" id="userPassword" className="registerInput registerInputPassword"></input>
                        <input onKeyPress={(e) => {if(e.key === 'Enter'){this.userSignup()}}} type={"password"} placeholder="Confim password" id='confirmPassword' className="registerInput registerInputPassword"></input>
                    </div>
                    <a onClick={() => this.userSignup()} className="buttonContainer registerButtonContainer buttonYellow">
                        <p>Sign Up</p>
                    </a>
                    <div className="registerTextContainer">
                        <p className="registerTextTitle">Already Have An Account?</p>
                        <a href="/login" className="registerTextLink">Log In</a>
                    </div>
                    <p className='copyrightText'>dicerollgame.co.uk &copy; 2022</p>
                </div>

                {/* Only to be shown after user signup successful */}
                <div className={this.state.ProfileImageSelectClasses[this.state.signupState]}>
                    <ProfileImageSelect onFinished={this.onProfileImageFinished}/>
                </div>
            </div>
        )
    }
}

export default Signup;