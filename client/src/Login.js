import axios from "axios";
import React, { Component } from "react";

import './Login.css';

class Login extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            errorTextClasses: ['errorHide', 'errorText erroTextCenter'],
            errorTextState: 0,
            errorTextMessage: ['Username or Password Incorrect', `Username Doesn't exist`],
            errorTextMessageState: 0,
            userNameErrorClasses: ['errorHide', 'errorText'],
            userNameErrorText: ["Username must be at least 4 characters", "Username can't be longer than 24 characters"],
            userNameErrorTextState: 0,
            userNameErrorState: 0,
            passwordErrorClasses: ['errorHide', 'errorText'],
            passwordErrorClasses: ['errorHide', 'errorText'],
            passwordErrorText: ['Password must be at least 4 characters', `Passwords don't match`],
            passwordErrorTextState: 1,
            passwordErrorState: 0,
        }
    }
    async loginUser(sendData){
        const res = await axios.post(this.props.routes.login, sendData)
        return await res.data;
    }
    userLogin = () => {
        this.setState({errorTextState: 0, userNameErrorState: 0, passwordErrorState: 0});
        var username = document.getElementById("userPassword").value;
        var password = document.getElementById("loginPassword").value;
        if(username.trim().length >= 4 && username.trim().length <= 24 && password.length >=4){
            var sendData = {
                'username': username,
                'password': password,
            }

            this.loginUser(sendData)
            .then(data => {
                if(data.success){
                    // succesfully signed in
                    localStorage.setItem("user", JSON.stringify(data.user));
                    window.location.href = `/`;
                }else if(!data.success && data.reason === "invpassword"){
                    // invalid password
                    this.setState({errorTextState: 1, errorTextMessageState: 0});
                }else{
                    // user account doesn't exist
                    this.setState({errorTextState: 1, errorTextMessageState: 1});
                }
            })
        }else{
            if(username.trim().length < 4){
                this.setState({userNameErrorState: 1})
            }
            if (username.trim().length > 24){
                this.setState({userNameErrorState: 1, userNameErrorTextState: 1});
            }
            if (password.length < 4){
                this.setState({passwordErrorState: 1, passwordErrorTextState: 0});
            }
        }
    }
    render(){
        return(
            <div id='login'>
                <p className="diceRollGameRegisterLogo">Dice Roll Game</p>
                <div className="registrationContainer">
                    <p className="registerTabTitle">Log In</p>
                    <p className={this.state.errorTextClasses[this.state.errorTextState]}>{this.state.errorTextMessage[this.state.errorTextMessageState]}</p>
                    <div id="loginInputsContainer">
                        <p className={this.state.userNameErrorClasses[this.state.userNameErrorState]}>{this.state.userNameErrorText[this.state.userNameErrorTextState]}</p>
                        <input onKeyPress={(e) => {if(e.key === 'Enter'){this.userLogin()}}} maxLength={24} placeholder="Username" id='userPassword' className="registerInput"></input>
                        <p className={this.state.passwordErrorClasses[this.state.passwordErrorState]}>{this.state.passwordErrorText[this.state.passwordErrorTextState]}</p>
                        <input onKeyPress={(e) => {if(e.key === 'Enter'){this.userLogin()}}} id='loginPassword' type={"password"} placeholder="Password" className="registerInput registerInputPassword"></input>
                    </div>
                    <a onClick={() => this.userLogin()} className="buttonContainer registerButtonContainer buttonYellow">
                        <p>Login</p>
                    </a>
                    <div className="registerTextContainer">
                        <p className="registerTextTitle">Haven't got an account?</p>
                        <a href="/signup" className="registerTextLink">Sign Up</a>
                    </div>
                    <p className='copyrightText'>dicerollgame.co.uk &copy; 2022</p>
                </div>
            </div>
        )
    }
}

export default Login;