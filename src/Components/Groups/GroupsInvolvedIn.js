import React from 'react';
import './Groups.css';
import axios from 'axios';
import auth from '../../helpers/auth';
import $ from 'jquery';
import { Link } from 'react-router-dom';

export default class GroupsInvolvedIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            quizzes: [],
            users: [],
            showQuizzes: true
        }
    }

    componentDidMount(){
        this.getGroups();
    }

    getGroups = () => {
        if(!auth('get')) return;
        axios.post('http://localhost:9000/quiz/get-involved-quizzes', {_id: auth('get').user._id}).then(res => {
            if(res.data.message === 'success') {
                this.setState({groups: res.data.data})
            }
        })
    }

    getQuizzes = (idx) => {
        let idsArr = this.state.groups[idx].quizzes;
        axios.post('http://localhost:9000/quiz/get-quizzes', {ids: idsArr}).then(res => {
            if(res.data.message === 'success') {
                this.setState({
                    quizzes: res.data.data
                })
            }
        })
    }

    getUsers = (idx) => {
        let idsArr = this.state.groups[idx].users;
        axios.post('http://localhost:9000/users/get-users', {ids: idsArr}).then(res => {
            if(res.data.message === 'success') {
                this.setState({
                    users: res.data.data
                })
            }
        })
    }

    togglePanel = async (idx) => {
        if ($(`#hidden${idx}`).hasClass('show-gr')) {
            $(`#hidden${idx}`).slideUp(350);
            $(`#hidden${idx}`).removeClass('show-gr');
            return;
        }
        this.state.groups.forEach((Group, idx) => {
            $(`#hidden${idx}`).removeClass('show-gr')
            $(`#hidden${idx}`).slideUp();
        });
        await this.getQuizzes(idx);
        await this.getUsers(idx);
        this.getGroups();
        $(`#hidden${idx}`).slideDown(350);
        $(`#hidden${idx}`).addClass('show-gr');
    }

    takeQuiz = (id) => {
        this.props.history.push(`/quiz-page/${id}`);
    }

    render(){
        return (
            <div className="groups-involved-wrapper">
                <h1 style={{fontWeight: 500}}>Groups Involved In</h1>
                <div className="body">
                    <div className="groups">
                        {this.state.groups.map((group, idx) => (
                            <div className="group" key={idx}>
                                <p>Name: <span>{group.name}</span></p>
                                {/* <p>Created by: <span>{group.createdByName}</span></p> */}
                                <div onClick={() => this.togglePanel(idx)} className="toggle">Toggle Quizzes</div>
                                <div id={`hidden${idx}`} className="hidden-gr">
                                    <div className="content">
                                        <div className="header">
                                            <div onClick={() => this.setState({showQuizzes: true})} className={!this.state.showQuizzes ? 'inactive' : ''}>Quizzes</div>
                                            <div onClick={() => this.setState({showQuizzes: false})} className={this.state.showQuizzes ? 'inactive' : ''}>Users</div>
                                        </div>
                                        {this.state.showQuizzes ? <div className="left"> 
                                            {this.state.quizzes.map((quiz, idx) => (
                                                <div className="quiz" key={idx}>
                                                    <div>{quiz.quizName}</div>
                                                    <div>No score recorded</div>
                                                    <Link style={{textAlign: 'center'}} className="button" to={`/quiz-page/${quiz._id}`}>Take Quiz</Link>
                                                    {/* <button onClick={() => this.takeQuiz(quiz._id)}>Take quiz</button> */}
                                                </div>
                                            ))}
                                        </div>
                                        :
                                        <div className="right">
                                            {this.state.users.map((user, idx) => (
                                                <div className="user" key={idx}>
                                                    <div style={{marginTop: '12px'}}>{user.firstName} {user.lastName}</div>
                                                </div>
                                            ))}
                                        </div> }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>  
            </div>
        )
    }
}