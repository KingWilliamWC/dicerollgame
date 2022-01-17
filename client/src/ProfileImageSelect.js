import React, { Component } from "react";

import ProfileImagePreview from "./ProfileImagePreview";

class ProfileImageSelect extends Component{
    constructor(props){
        super(props);

        this.state = {
            imagePreviewImages: [],
            imagePreviewClasses: [],
            currentImageActive: 0,
        }
    }

    onPreviewImageSelect = (index) => {
        // console.log(index);
        var currentimagePreviewClasses = this.state.imagePreviewClasses;
        currentimagePreviewClasses[index] = 'profileImagePreviewContainerActive';
        currentimagePreviewClasses[this.state.currentImageActive] = 'profileImagePreviewContainer';

        this.setState({imagePreviewClasses: currentimagePreviewClasses, currentImageActive: index})
    }
    componentDidMount(){
        var newPreviewImageClasses= [];
        newPreviewImageClasses.push('profileImagePreviewContainerActive')
        for(var i = 0; i < 14; i++){
            newPreviewImageClasses.push('profileImagePreviewContainer')
        }
        this.setState({
            imagePreviewClasses: newPreviewImageClasses
        })
    }
    render(){
        this.state.imagePreviewImages = []
        for(var i = 0; i < 15; i++){
            this.state.imagePreviewImages.push(
                <ProfileImagePreview class={this.state.imagePreviewClasses[i]} imageIndex={i + 1} key={i} clickHandler = {this.onPreviewImageSelect}/>
            )
        }
        return(
            <div id='profileImageSelect'>
                <p id='currentlySelectedText'>Currently Selected</p>
                <img id='profileImageActive' src={`/ProfileImages/${this.state.currentImageActive + 1}.png`}></img>
                <a onClick={() => this.props.onFinished(`/ProfileImages/${this.state.currentImageActive + 1}.png`)} className="buttonContainer registerButtonFinishedContainer buttonGreen">
                    <p>Finished</p>
                </a>
                <div id='profileImagesDisplayContainer'>
                    {/* <div className="profileImagePreviewContainer">
                        <img src='/ProfileImages/0.png' className="profileImagePreview profileImagePreviewSelected"></img>
                    </div>
                    <div className="profileImagePreviewContainer">
                    </div>
                    <div className="profileImagePreviewContainer">
                    </div>
                    <div className="profileImagePreviewContainer">
                    </div>
                    <div className="profileImagePreviewContainer">
                    </div> */}
                    {this.state.imagePreviewImages ? this.state.imagePreviewImages : ''}
                </div>
            </div>
        )
    }
}

export default ProfileImageSelect;