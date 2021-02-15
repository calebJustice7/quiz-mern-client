import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import auth from '../helpers/auth';
import store from '../store/index';

class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    inputChange = (e) => {
        this.setState({
            [e.target.placeholder]: e.target.value
        })
    }

    onSignIn = (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        if (email.length === 0 || password.length === 0) {
            this.setState({ message: 'Cannot leave fields empty' });
            setTimeout(() => { this.setState({ message: '' }) }, 2000);
            return;
        }
        // http://localhost:9000
        axios.post('/users/login', this.state).then(res => {
            if (res.data.message === 'Signed in successfully!') {
                this.setState({ email: '', password: '' });
                auth('save', res);
                this.props.history.push('/home')
            } else {
                this.setState({ message: res.data.message });
                setTimeout(() => { this.setState({ message: '' }) }, 2000);
            }
        })
    }

    render() {
        if (!store.getState().userReducer.signedIn) {
            return (
                <div className="signin-wrapper">
                    <div className="content">
                        <form onSubmit={this.onSignIn} className="user-form">
                            <h3>Sign in</h3>
                            <div className="form-body">
                                <i className="fas fa-user"></i>
                                <input onChange={this.inputChange} value={this.state.email} type="text" placeholder="email" />
                            </div>
                            <div className="form-body">
                                <i className="fas fa-key"></i>
                                <input onChange={this.inputChange} value={this.state.password} type="password" placeholder="password" />
                            </div>
                            <div className="message">{this.state.message}</div>
                            <button type="submit">Sign in</button>
                            <br></br>
                            <span>
                                Dont have an account? <Link to="/signup">Create one</Link>
                            </span>
                        </form>
                    </div>
                </div>
            )
        } else {
            return <div>already signed in</div>
        }
    }
}

export default SignIn;