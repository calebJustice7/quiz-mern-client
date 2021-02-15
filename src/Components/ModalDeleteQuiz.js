import React from 'react';
import $ from 'jquery';
import auth from '../helpers/auth';
import axios from 'axios';
import store from '../store/index';

export default class ModalDeleteQuiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: 'Confirm delete'
        }
    }

    componentDidMount() {

    }

    searchGroups = (groups) => {
        let id = this.props.quiz._id;
        let contains = false;
        groups.forEach(group => {
            if(group.quizzes.includes(id)) {
                contains = true;
            }
        });
        if(contains){
            this.setState({message: "Remove this quiz from your group / groups before deleting!"});
            setTimeout(() => {this.setState({message: 'Confirm Delete'})},3000)
        } else {
            this.deleteQuizEnd();
        }
    }

    deleteQuizEnd = () => {
        // http://localhost:9000
        axios.post('/quiz/delete-quiz', {_id: this.props.quiz._id, createdById: auth('get').user._id}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth('get').token
            }
        }).then(res => {
            if(res.data.message === 'success') {
                store.dispatch({
                    type: "DELETE_QUIZ",
                    _id: this.props.quiz._id
                })
                this.hideModal();
            }
        })
    }

    deleteQuiz = () => {
        if (!auth('get')) return;
        // http://localhost:9000
        axios.post('/quiz/my-groups', { _id: auth('get').user._id }).then(res => {
            if (res.data.message === 'success') {
                this.searchGroups(res.data.data)
            }
        })
    }

hideModal = () => {
    $('#delete-modal').fadeOut(300);
}

render() {
    return (
        <div id="delete-modal" className="modal-delete-quiz">
            <div className="content">
                <div className="header">{this.state.message}</div>
                <div className="buttons-wrapper">
                    <button onClick={this.hideModal}>Cancel</button>
                    <button onClick={this.deleteQuiz}>Yes</button>
                </div>
            </div>
        </div>
    )
    }
}
