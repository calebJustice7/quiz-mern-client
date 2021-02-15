import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import store from '../store';

export default class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            message: ''
        }
    }

    updateInput = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    createUser = (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password } = this.state;
        if(firstName.length === 0 || lastName.length === 0 || email.length === 0 || password.length === 0) {
            this.setState({message: 'Cannot leave fields empty'});
            setTimeout(() => {this.setState({message: ''})}, 2000)
            return;
        }
        axios.post('http://localhost:9000/users/register', this.state).then(res => {
            this.setState({message: res.data.message})
            if(res.data.message) {
                this.setState({
                    firstName: '',
                    lastName: '',
                    password: '',
                    email: ''
                })
            }
            setTimeout(() => {this.setState({message: ''})}, 2000)
        })
    }

    navBack = () => {
        this.props.history.push('/')
    }

    render() {
        if(!store.getState().userReducer.signedIn) {
            return (
                <div className="signup-wrapper">
                    <form onSubmit={this.createUser} className="user-form">
                        <h3>Create an account</h3>
                        <div className="form-body">
                            <i className="fas fa-user"></i>
                            <input id="firstName" onChange={this.updateInput} value={this.state.firstName} type="text" placeholder="First Name" />
                        </div>
                        <div className="form-body">
                            <i className="fas fa-user"></i>
                            <input id="lastName" onChange={this.updateInput} value={this.state.lastName} type="text" placeholder="Last Name" />
                        </div>
                        <div className="form-body">
                            <i className="fas fa-user"></i>
                            <input id="email" onChange={this.updateInput} value={this.state.email} type="text" placeholder="Email" />
                        </div>
                        <div className="form-body">
                            <i className="fas fa-key"></i>
                            <input id="password" onChange={this.updateInput} value={this.state.password} type="password" placeholder="Password" />
                        </div>
                        <div className="message">{this.state.message}</div>
                        <button type="submit">Sign up</button>
                        <br></br>
                        <span>
                            Already have an account? <Link to="/signin">Sign In</Link>
                        </span>
                    </form>
                </div>
            )
        } else {
            return <div onClick={this.navBack()}>Signed in</div>
        }
    }
}