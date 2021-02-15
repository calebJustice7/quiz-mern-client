import React from 'react';
import './Groups.css';
import axios from 'axios';

import $ from 'jquery';
import auth from '../../helpers/auth';
import GroupsInvolvedIn from './GroupsInvolvedIn';

export default class Groups extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputVal: '',
            myGroups: [],
            group: {},
            users: [],
            usersToDisplay: [],
            groupUsers: [],
            groupQuizzes: [],
            showDeleteWrapper: false,
            groupToDelete: {},
            inputValUsers: '',
            inputValDelete: ''
        }
    }

    componentDidMount() {
        this.getMyGroups();
        this.getUsers();
    }

    hideModal = () => {
        $('#group-modal').fadeOut(300);
    }

    getUsers = () => {
        if (!auth('auth')) return;
        axios.post('/users/get-all-users', { email: auth('get').user.email }).then(res => {
            if (res.data.message === 'success') {
                this.setState({ usersToDisplay: res.data.data, users: res.data.data })
            }
        })
    }

    getMyGroups = (getUsers, idx) => {
        if (!auth('get')) return;
        axios.post('/quiz/my-groups', { _id: auth('get').user._id }).then(res => {
            if (res.data.message === 'success') {
                this.setState({
                    myGroups: res.data.data
                });
                if(getUsers) {
                    this.getMyUsers(idx);
                    this.getMyQuizzes(idx);
                }
            }
        })
    }

    showDelete = (group) => {
        this.setState({showDeleteWrapper: true, groupToDelete: group})
    }

    getMyUsers = async (idx) => {
        let users = this.state.myGroups[idx];
        this.setState({ groupUsers: [] });
        // 11 Different http://localhost:9000
        axios.post('/users/get-users', { ids: users.users }).then(res => {
            if (res.data.message === 'success') {
                this.setState({
                    groupUsers: res.data.data
                })
            }
        })
    }

    getMyQuizzes = (idx) => {
        let quizzes = this.state.myGroups[idx].quizzes;
        this.setState({groupQuizzes: []});
        axios.post('/quiz/get-quizzes', { ids: quizzes }).then(res => {
            if (res.data.message === 'success') {
                this.setState({ groupQuizzes: res.data.data })
            }
        })
    }

    showModal = (id) => {
        axios.post('/quiz/get-group', { _id: id._id }).then(res => {
            if (res.data.message === 'success') {
                this.setState({ group: res.data.data })
            }
        })
        $('#group-modal').fadeIn(300);
    }

    createGroup = () => {
        if (!this.state.inputVal || !auth('get')) return;
        let returnVal = false;
        this.state.myGroups.forEach(group => {
            if (group.name === this.state.inputVal) returnVal = true;
        })
        if (returnVal) return;
        axios.post('/quiz/new-group', {
            createdById: auth('get').user._id,
            createdByName: auth('get').user.firstName + ' ' + auth('get').user.lastName,
            name: this.state.inputVal
        }).then(res => {
            if (res.data.message === 'success') {
                this.setState({
                    inputVal: '',
                    myGroups: this.state.myGroups.concat(res.data.data)
                })
            }
        })
    }

    showPanel = (idx, group) => {
        if ($(`#group${idx}`).hasClass('show')) {
            $(`#group${idx}`).slideUp(350);
            $(`#group${idx}`).removeClass('show');
            return;
        }
        this.state.myGroups.forEach((Group, idx) => {
            $(`#group${idx}`).removeClass('show')
            $(`#group${idx}`).slideUp();
        })
        this.getMyGroups(true, idx);
        $(`#group${idx}`).slideDown(350);
        $(`#group${idx}`).addClass('show');
    }

    addToGroup = (user) => {
        if (this.state.group.users.includes(user)) return;
        axios.post('/quiz/add-user-to-group', { _id: user, groupId: this.state.group._id }).then(res => {
            if (res.data.message === 'success') {
                this.setState({ group: res.data.data });
            }
        })
    }

    unAdd = (user, group) => {
        axios.post('/quiz/unadd-from-group', { _id: user._id, groupId: group }).then(res => {
            if (res.data.message === 'success') {
                this.setState({
                    group: res.data.data,
                    groupUsers: this.state.groupUsers.filter(userr => {
                        return userr._id !== user._id
                    })
                });
            }
        })
    }

    refresh = (idx) => {
        this.getMyGroups(true, idx);
    }

    deleteGroup = () => {
        if(this.state.inputValDelete !== this.state.groupToDelete.name) return;
        axios.post('/quiz/delete-group', {_id: this.state.groupToDelete._id}).then(res => {
            this.setState({inputValDelete: ''});
            if(res.data.message === 'success') {
                this.getMyGroups();
                this.setState({groupToDelete: {}, showDeleteWrapper: false})
            }
        })
    }

    removeQuiz = (quiz, group) => {
        axios.post('/quiz/unadd-quiz-from-group', { _id: quiz._id, groupId: group._id }).then(res => {
            if (res.data.message === 'success') {
                console.log(res.data.data);
                this.setState({
                    group: res.data.data,
                    groupQuizzes: this.state.groupQuizzes.filter(quizz => {
                        return quiz._id !== quizz._id
                    })
                })
            }
        })
    }

    searchForUsers = () => {
        if(!auth('get')) return;
        axios.post('/users/search-for-users', {name: this.state.inputValUsers, email: auth('get').user.email}).then(res => {
            if(res.data.message === 'success') {
                console.log(res.data.data);
                this.setState({usersToDisplay: res.data.data})
            }
        })
    }

    render() {
        return (
            <>
                <div id="group-modal" className="groups-modal-wrapper">
                    <div className="content">
                        <div className="header">
                            <div>Add users to {this.state.group.name ? this.state.group.name : ''}</div>
                            <div onClick={this.hideModal}>x</div>
                        </div>
                        <div className="body">
                            <div className="search-body">
                                <input value={this.state.inputValUsers} onChange={e => this.setState({inputValUsers:e.target.value})} type="text" placeholder="Search for Users" />
                                <i onClick={this.searchForUsers} className="fas fa-search"></i>
                            </div>
                            {this.state.users.length > 0 ? this.state.usersToDisplay.map((usr, idx) => (
                                <div style={this.state.group.users && this.state.group.users.includes(usr._id) ? {backgroundColor: 'rgba(50, 255, 50, 0.5)'} : {}} className="user" key={idx}>
                                    <span>{usr.firstName}</span>
                                    <span>{usr.email}</span>
                                    {this.state.group.users && !this.state.group.users.includes(usr._id) ? <button onClick={() => this.addToGroup(usr._id)}>Add</button> : ''}
                                </div>
                            )) : ''}
                        </div>
                    </div>
                </div>

                <div className="groups-wrapper">
                    <div className="left">
                        <div className="header">My Groups</div>
                        <div className="groups">
                            {this.state.myGroups.map((group, idx) => (
                                <div key={idx} className="group">
                                    <span className="first-span">{group.name}</span>
                                    <span className="group-hide-status" onClick={() => this.showPanel(idx)}>Toggle data</span>
                                    <span onClick={() => this.showModal(group)} className="group-add-user">Add users</span>
                                    <i onClick={() => this.refresh(idx)} className="fas fa-sync"></i>
                                    <i onClick={() => this.showDelete(group)} className="far fa-trash-alt"></i>
                                    <div className="hidden" id={`group${idx}`}>
                                        <div className="content">
                                            <span className="left">
                                                <h2>Users</h2>
                                                <div className="users">
                                                    {this.state.groupUsers.map((user, indexUsr) => (
                                                        <div className="user" key={indexUsr}>
                                                            <span>{`${user.firstName} ${user.lastName}`}</span>
                                                            <button onClick={() => this.unAdd(user, group)}>Remove</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </span>
                                            <span className="right">
                                                <h2>Quizzes</h2>
                                                {this.state.groupQuizzes.map((quiz, indexQuiz) => (
                                                    <div key={indexQuiz} className="quiz">
                                                        <span>{quiz.quizName}</span>
                                                        <button onClick={() => this.removeQuiz(quiz, group)}>Remove</button>
                                                    </div>
                                                ))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {this.state.showDeleteWrapper ? 
                        <div className="confirm-delete-wrapper">
                            <h1>Confirm delete {this.state.groupToDelete.name}</h1>
                            <input type="text" value={this.state.inputValDelete} onChange={e => this.setState({inputValDelete: e.target.value})} placeholder={`Type in ${this.state.groupToDelete.name}`} />
                            <div className="buttons-wrapper">
                                <button onClick={this.deleteGroup}>Yes</button>
                                <button onClick={() => this.setState({showDeleteWrapper: false, groupToDelete: {}})}>No</button>
                            </div>
                        </div>
                        : ''}
                        <div className="new-group-wrapper">
                            <input type="text" placeholder="Create new group" value={this.state.inputVal} onChange={e => this.setState({ inputVal: e.target.value })} />
                            <button type="text" onClick={this.createGroup}>Create</button>
                        </div>
                    </div>
                    <div className="right">
                        <GroupsInvolvedIn props={this.props}/>
                    </div>
                </div>
            </>
        )
    }
}