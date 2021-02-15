import React from 'react';
import './Scores.css';
import auth from '../../helpers/auth';
import axios from 'axios';

export default class Scores extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            message: '',
            quiz: {},
            isVerified: false
        }
    }

    componentDidMount() {
        // http://localhost:9000
        axios.post(`/quiz/get-quiz`, { _id: this.props.match.params.id }).then(res => {
            if (res.data.message === 'success') {
                this.setState({ quiz: res.data.data });
                this.checkAuth();
            }
        })
    }

    checkAuth = () => {
        if (this.state.quiz.id === auth('get').user._id) {
            this.setState({ isVerified: true });
        } else {
            this.setState({ message: 'You are not verified to view this page' })
        }
    }

    render() {
        return (
            <div className="scores-wrapper">
                {this.state.isVerified ? 

                <div className="content">
                    Verified
                </div> : <div>{this.state.message}</div>}
            </div>
        )
    }
}