import React from 'react';
import './ViewQuiz.css';
import auth from '../../helpers/auth';
import axios from 'axios';

export default class ViewQuiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            statusMessage: '',
            isAuthorized: false,
            groups: [],
            quiz: {},
            inputVal: ''
        }
    }

    componentDidMount(){
        axios.post(`http://localhost:9000/quiz/get-quiz`, {_id: this.props.match.params.id}).then(res => {
            if(res.data.message === 'success') {
                this.setState({quiz: res.data.data});
                res.data.data.makePrivate ? this.getGroups() : this.checkAuth(res.data.data);
            }
        })
    }

    getGroups = () => {
        if(!auth('get')){
            this.setState({statusMessage: 'Not Signed in'});
            return;
        };
        if(this.state.quiz.id === auth('get').user._id) {
            this.setState({isAuthorized: true});
            return;
        }
        axios.post('http://localhost:9000/quiz/get-involved-quizzes', {_id: auth('get').user._id}).then(res => {
            if(res.data.message === 'success') {
                res.data.data.forEach(group => {
                    if(group.quizzes.includes(this.props.match.params.id)) {
                        this.setState({isAuthorized: true})
                    }
                })
                if(!this.state.isAuthorized) {
                    this.setState({statusMessage: 'Not authorized to take'})
                }
            }
        })
    }

    checkAuth = (quiz) => {
        if((quiz.mustBeAuth && auth('get')) || !quiz.mustBeAuth) {
            this.setState({isAuthorized: true})
        } else {
            this.setState({statusMessage: 'Not Signed in'})
        }
    }

    addComment = () => {
        if(!auth('get')) return;
        if(this.state.inputVal.length < 2) return;
        axios.post('http://localhost:9000/quiz/add-comment', {
            sentFromId: auth('get').user._id,
            sentFromName: auth('get').user.firstName + ' ' + auth('get').user.lastName,
            sentFromPicture: auth('get').user.profilePicture,
            quizId: this.state.quiz._id,
            date: Date.now(),
            comment: this.state.inputVal
        }).then(res => {
            if(res.data.message === 'success') {
                this.setState({quiz: res.data.data, inputVal: ''});
            }
        })
    }

    startQuiz = () => {
        this.props.history.push({
            pathname: `/take-quiz/${this.state.quiz._id}`,
            state: {
                quiz: this.state.quiz
            }
        })
    }

    render() {
        return (
            <div className="view-quiz">
                {!this.state.isAuthorized ? <div className="not-auth">{this.state.statusMessage}</div> : 
                <div className="content">
                    <div className="header">
                        {this.state.quiz.quizName}
                    </div>
                    <div className="body">
                        <div className="left">
                            <div className="description">{this.state.quiz.description}</div>
                            <div className="comments">
                                {this.state.quiz.comments.map((com, idx) => (
                                    <div className={auth('get') ? auth('get').user._id === com.sentFromId ? 'comment' : 'comment' : 'comment'} key={idx}>
                                        <img style={{borderRadius: '100%'}} className={auth('get') ? auth('get').user._id === com.sentFromId ? 'img' : 'img' : 'img'} src={com.sentFromPicture ? com.sentFromPicture : "https://img.pngio.com/png-avatar-108-images-in-collection-page-3-png-avatar-300_300.png"} />
                                        <div>{com.comment}</div>
                                        <div>{com.sentFromName}</div>
                                    </div>
                                ))}
                                <div className="input-field">
                                    <input value={this.state.inputVal} onChange={e => this.setState({inputVal: e.target.value})} type="text" placeholder="Add a new comment" />
                                    <button onClick={this.addComment}>Send</button>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <div className="questions-num">{this.state.quiz.questions.length} Questions</div>
                            <div className={this.state.quiz.id === auth('get').user._id ? 'questions-wrapper' : 'questions-wrapper no-scroll'}>
                                {this.state.quiz.questions.map((question, idx) => (
                                    <div className="question" key={idx}>
                                        <div>{this.state.quiz.id === auth('get').user._id ? question.questionName : 'question name'}</div>
                                        <div>{this.state.quiz.id === auth('get').user._id ? question.correctAnswer : 'answer'}</div>
                                    </div>
                                ))}
                                {this.state.quiz.id !== auth('get').user._id ? <div className="hidden"><div>Must be creator to look at questions</div></div> : ''}
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="buttons-wrapper">
                            <button onClick={() => this.props.history.goBack()}>Go Back</button>
                            <button onClick={this.startQuiz}>Take Quiz</button>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}