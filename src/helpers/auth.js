import store from '../store/index';
import axios from 'axios';

export default function auth(type, data) {
    if(type === 'save') {
        localStorage.setItem('user', JSON.stringify({user: data.data.user, token: data.data.token}));
        store.dispatch({
            type: 'ADD_USER_DATA',
            user: data.data.user
        })
    } else if(type === 'get') {
        return localStorage.getItem('user') === null ? false : JSON.parse(localStorage.getItem('user'));
    } else if(type === 'logOut') {
        localStorage.removeItem('user');
        store.dispatch({
            type: 'REMOVE_USER_DATA'
        })
        store.dispatch({
            type: 'REMOVE_QUIZ_DATA'
        })
    } else if(type === 'load') {
        let user = localStorage.getItem('user') === null ? false : JSON.parse(localStorage.getItem('user'));
        if(!user) return;
        // http://localhost:9000
        axios.post('/users/get-user', {_id: user.user._id}).then(res => {
            if(res.data.message === 'success'){
                let storage = JSON.parse(localStorage.getItem('user'));
                storage.user = res.data.data;
                localStorage.setItem("user", JSON.stringify(storage));
                store.dispatch({
                    type: "ADD_USER_DATA",
                    user: res.data.data
                })
            } else {
                localStorage.clear();
            }
        })
    } else if(type === 'auth'){
        let user = localStorage.getItem('user') === null ? false : true;
        return user;
    }
}