import React, { Component } from "react";

import ProfileImagePreview from "./ProfileImagePreview";

class SettingsProfileImageSelect extends Component{
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
        if(this.state.currentImageActive !== index){
            var currentimagePreviewClasses = this.state.imagePreviewClasses;
            currentimagePreviewClasses[index] = 'profileImagePreviewContainerActive';
            currentimagePreviewClasses[this.state.currentImageActive] = 'profileImagePreviewContainer';
    
            this.setState({imagePreviewClasses: currentimagePreviewClasses, currentImageActive: index})
        }
    }

    componentDidMount(){
        var currentImageIndex = this.props.currentImage.toLowerCase().replace('/profileimages/', '').replace('.png', '') - 1;
        console.log(currentImageIndex);
        var newPreviewImageClasses= [];
        // newPreviewImageClasses.push('profileImagePreviewContainerActive')
        for(var i = 0; i < 15; i++){
            newPreviewImageClasses.push('profileImagePreviewContainer')
        }
        newPreviewImageClasses[currentImageIndex] = 'profileImagePreviewContainerActive';
        this.setState({
            imagePreviewClasses: newPreviewImageClasses,
            currentImageActive: currentImageIndex,
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
            <div id='settingsProfileImageSelect'>
                <p id='currentlySelectedText'>Currently Selected</p>
                <img id='profileImageActive' src={`/ProfileImages/${this.state.currentImageActive + 1}.png`}></img>
                <a onClick={() => this.props.onFinished(`/ProfileImages/${this.state.currentImageActive + 1}.png`)} className="buttonContainer registerButtonFinishedContainer buttonGreen">
                    <p>Finished</p>
                </a>
                <div className="profileImagesDisplayContainerSettings" id='profileImagesDisplayContainer'>
                    {this.state.imagePreviewImages ? this.state.imagePreviewImages : ''}
                </div>
            </div>
        )
    }
}

export default SettingsProfileImageSelect;