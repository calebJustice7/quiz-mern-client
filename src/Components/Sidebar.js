import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import auth from '../helpers/auth';
import store from '../store/index';

export default class Sidebar extends React.Component {

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    hideMenu = () => {
        $('#sidebar').slideUp(300);
    }

    logout = () => {
        auth('logOut');
    }

    render() {
        return (
                <div className="sidebar-wrapper" id="sidebar">
                    {/* <i onClick={this.hideMenu} className="fas fa-bars"></i> */}
                    <div className="header">
                        <div className="content">
                            {!auth('get') ? <img alt="avatar" src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png" />
                            : <img alt="avatar" src={auth('get').user.profilePicture ? auth('get').user.profilePicture : "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"}/>}
                            <div onClick={this.test}>{store.getState().userReducer.signedIn === false ? 'not signed in' : store.getState().userReducer.user.firstName + ' ' + store.getState().userReducer.user.lastName}</div>
                        </div>
                    </div>
                    <div className="body">
                        <Link onClick={this.logout} to="/signin" className="link">
                            <i className="far fa-user"></i>
                            <div>{store.getState().userReducer.signedIn === false ? 'Sign in or create account' : 'Logout'}</div>
                        </Link>
                        <Link to="/home" className="link">
                            <i className="fas fa-home"></i>
                            <div>Home</div>
                        </Link>
                        <Link to="/myquizzes" className="link">
                            <i className="fas fa-pencil-alt"></i>
                            <div>My quizzes</div>
                        </Link>
                        <Link to="/edit-quiz" className="link">
                            <i className="far fa-plus-square"></i>
                            <div>Edit quizzes</div>
                        </Link>
                        <Link to="/quizzes" className="link">
                            <i className="fas fa-satellite-dish"></i>
                            <div>Community quizzes</div>
                        </Link>
                        <Link to="/groups" className="link">
                            <i className="fas fa-users"></i>
                            <div>Groups</div>
                        </Link>
                        <Link to="/settings" className="link">
                            <i className="fas fa-cog"></i>
                            <div>Settings</div>
                        </Link>
                    </div>
                </div>
        )
    }
}