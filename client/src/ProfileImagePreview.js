import React, { Component } from "react";

class ProfileImagePreview extends Component{
    render(){
        return(
            <div onClick={() => this.props.clickHandler(this.props.imageIndex-1)} className={this.props.class}>
                <img src={`/ProfileImages/${this.props.imageIndex}.png`} className="profileImagePreview profileImagePreviewSelected"></img>
            </div>
        )
    }
}

export default ProfileImagePreview;