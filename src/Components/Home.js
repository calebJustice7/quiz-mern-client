import React from 'react';
import store from '../store/index';
import { Spring } from 'react-spring/renderprops';

export default class Home extends React.Component {

    getStarted = () => {
        if (store.getState().userReducer.signedIn) {
            this.props.history.push('/edit-quiz')
        } else {
            this.props.history.push('/signup')
        }
    }

    render() {
        return (
            <Spring config={{ duration: 600 }}
                from={{ opacity: 0, marginLeft: -1000 }}
                to={{ opacity: 1, marginLeft: 24 }}
            >
                {props => (
                    <div style={props} className="home-wrapper">
                        <div className="main">
                            <h1 className="header">Create Free Quizzes In Just Minutes! The simplest quiz creator out there</h1>
                            <div className="sub-header">Get your results back instantly, see who took your quiz!</div>
                            <div className="button">
                                <button onClick={this.getStarted}>Get started</button>
                            </div>
                        </div>
                        <div className="footer">
                            Editing and creating quizzes done easier then before!
                        </div>
                        <div className="body">
                            <div className="square">
                                <i className="fas fa-users"></i>
                                <h4>Track users</h4>
                                <div>Managing quizzes is now easier then ever, simply check who viewed your quiz and read their comments</div>
                            </div>
                            <div className="square">
                                <i className="far fa-comment-alt"></i>
                                <h4>Get feedback</h4>
                                <div>Like rating and comment section is added into all quizzes by default</div>
                            </div>
                            <div className="square">
                                <i className="fas fa-mobile"></i>
                                <h4>Any device</h4>
                                <div>Mobile and computer friendly, you can take quizzes anywhere!</div>
                            </div>
                        </div>
                    </div>
                )}
            </Spring>
        )
    }
}