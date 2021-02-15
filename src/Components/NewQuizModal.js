import React from 'react';
import $ from 'jquery';
import store from '../store/index';
import axios from 'axios';
import auth from '../helpers/auth';

export default class NewQuizModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quizName: '',
            description: '',
            category: '',
            mustBeAuth: false,
            message: '',
            customOption: false,
            makePrivate: false
        }
    }

    inputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    selectChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    selectPrivate = (e) => {
        if(e.target.checked === true) {
            this.setState({
                makePrivate: e.target.checked,
                mustBeAuth: e.target.checked
            });
        } else {
            this.setState({makePrivate: false})
        }
    }

    selectCategoryChange = (e) => {
        if(e.target.value === 'other') {
            this.setState({customOption: true})
        } else {
            this.setState({customOption: false});
            this.setState({category: e.target.value})
        }
    }

    toggleChange = (e) => {
        this.setState({mustBeAuth: e.target.checked})
    }

    hideModal = () => {
        $('#quiz-modal').fadeOut(300);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(!auth('auth')) {
            this.setState({message: 'not signed in'});
            return;
        }
        axios.post('http://localhost:9000/quiz/create-quiz', JSON.stringify({
            name: `${auth('get').user.firstName} ${auth('get').user.lastName}`,
            _id: auth('get').user._id,
            quizName: this.state.quizName,
            questionType: 'any',
            description: this.state.description,
            category: this.state.category,
            mustBeAuth: this.state.mustBeAuth,
            makePrivate: this.state.makePrivate
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth('get').token
            }
        }).then(res => {
            this.setState({message: res.data.message})
            this.getQuizzes();
            setTimeout(() => {
                this.setState({
                    quizName: '',
                    description: '',
                    category: '',
                    mustBeAuth: false,
                    message: '',
                    customOption: false,
                    makePrivate: false
                });
                this.hideModal();
            }, 2000)
        })
    }

    getQuizzes = () => {
        let userId = auth('get').user._id;
        let body = {_id: userId}
        if(!auth('auth')) return;
        axios.post('http://localhost:9000/quiz/get-users-quizzes', body).then(res => {
            if(res.data.message === 'success') {
                store.dispatch({
                    type: 'SET_USER_QUIZZES',
                    quizzes: res.data.data
                })
            }
        })
    }

    render() {
        return (
            <div id="quiz-modal" className="new-quiz-modal">
                <div className="content">
                    <div className="header">
                        <div>Create a new quiz</div>
                        <div onClick={this.hideModal}>x</div>
                    </div>
                    <form onSubmit={this.handleSubmit} className="form-body">
                        <div className="body">
                            <div className="left">
                                <div className="input-body">
                                    <label>Name of quiz</label>
                                    <input value={this.state.quizName} id="quizName" onChange={this.inputChange} type="text" />
                                </div>
                                <div className="input-body">
                                    <label>Quick description</label>
                                    <input value={this.state.description} id="description" onChange={this.inputChange} type="text" />
                                </div>
                                <div className="input-body">
                                    <label className="form-switch">
                                        <input checked={this.state.makePrivate} onChange={this.selectPrivate} type="checkbox" />
                                        <i></i>
                                        Make private (can make public later)
                                    </label>
                                </div>
                            </div>
                            <div className="right">
                                <div className="input-body">
                                    <label>Select a Category</label>
                                    <select value={this.state.category} id="category" onChange={this.selectCategoryChange}>
                                        <option>Select a value</option>
                                        <option value="science">Science</option>
                                        <option value="tech">Tech</option>
                                        <option value="health">Health</option>
                                        <option value="food">Food</option>
                                        <option value="math">Math</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className={this.state.customOption ? 'input-body' : 'input-body low-opacity'}>
                                    <label>Other</label>
                                    <input value={this.state.category} disabled={this.state.customOption ? false : true} id="category" onChange={this.inputChange} type="text" placeholder="Other category" />
                                </div>
                                <div className="input-body">
                                    <label className="form-switch">
                                        <input disabled={this.state.makePrivate ? true : false} checked={this.state.mustBeAuth} onChange={this.toggleChange} type="checkbox" />
                                        <i></i>
                                        User must be signed in to take
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="message">{this.state.message}</div>
                        <div className="buttons-wrapper">
                            <button type="submit">Submit</button>
                            <button type="button" onClick={this.hideModal}>Close</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}