import React, { Component } from "react";

class NoUser extends Component{
    render(){
        return(
            <div className="noUserContainer">
                <p className="noUserText">No User Currently Connected</p>
            </div>
        )
    }
}

export default NoUser;