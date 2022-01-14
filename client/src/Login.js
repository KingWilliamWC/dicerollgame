import axios from "axios";
import React, { Component } from "react";

import './Login.css';

class Login extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            errorTextClasses: ['errorHide', 'errorText erroTextCenter'],
            errorTextState: 0,
        }
    }
    async loginUser(sendData){
        const res = await axios.post(`http://192.168.2.37:81/api/login`, sendData)
        return await res.data;
    }
    userLogin = () => {
        var username = document.getElementById("loginUsername").value;
        var password = document.getElementById("loginPassword").value;
        if(username.trim().length >= 4 && password.length >=4){
            var sendData = {
                'username': username,
                'password': password,
            }

            this.loginUser(sendData)
            .then(data => {
                if(data.success){
                    // succesfully signed in
                    sessionStorage.setItem("user", JSON.stringify(data.user));
                    window.location.href = `/`;
                }else if(!data.success && data.reason === "invpassword"){
                    this.setState({errorTextState: 1});
                }
            })
        }
    }
    render(){
        return(
            <div id='login'>
                <p className="diceRollGameRegisterLogo">Dice Roll Game</p>
                <div className="registrationContainer">
                    <p className="registerTabTitle">Log In</p>
                    <p className={this.state.errorTextClasses[this.state.errorTextState]}>Username or Password Incorrect</p>
                    <div id="loginInputsContainer">
                        <input onKeyPress={(e) => {if(e.key === 'Enter'){this.userLogin()}}} maxLength={24} placeholder="Username" id='loginUsername' className="registerInput"></input>
                        <input onKeyPress={(e) => {if(e.key === 'Enter'){this.userLogin()}}} id='loginPassword' type={"password"} placeholder="Password" className="registerInput registerInputPassword"></input>
                    </div>
                    <a onClick={() => this.userLogin()} className="buttonContainer registerButtonContainer buttonYellow">
                        <p>Login</p>
                    </a>
                    <div className="registerTextContainer">
                        <p className="registerTextTitle">Haven't got an account?</p>
                        <a href="/signup" className="registerTextLink">Sign Up</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;