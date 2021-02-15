import React from 'react';
import './Settings.css';
import auth from '../../helpers/auth';
import axios from 'axios';

export default class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileInput: '',
            previewSource: '',
            message: ''
        }
    }

    handleFileInputChange = (e) => {
        const file = e.target.files[0];
        this.previewFile(file);
    }

    previewFile = (file) => {
        if(file.size > 50000) {
            this.setState({message: 'File size too big!'});
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.setState({ previewSource: reader.result })
        }
    }

    handleSubmitFile = (e) => {
        e.preventDefault();
        if (!this.state.previewSource) return;
        this.uploadImage(this.state.previewSource);
    }

    uploadImage = (base64EncodedImage) => {
        if (!auth("get")) return;

        axios.post('http://localhost:9000/users/upload-image', JSON.stringify({
            data: base64EncodedImage, _id: auth('get').user._id
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            let storage = JSON.parse(localStorage.getItem('user'));
            storage.user.profilePicture = res.data.data;
            localStorage.setItem('user', JSON.stringify(storage));
            window.location.reload(false);
        })
    }

    render() {
        return (
            <div className="settings-wrapper">
                <div className="header">Upload Profile Picture</div>
                <form onSubmit={this.handleSubmitFile}>
                    <input type="file" name="image" value={this.state.fileInput} onChange={this.handleFileInputChange} />
                    <button type="submit">Submit</button>
                </form>
                <img src={this.state.previewSource} width="500" />
                <div>{this.state.message}</div>
            </div>
        )
    }
}