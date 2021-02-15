import { initState } from '../index';

const firstReducer = (state = initState, action) => {
    if (action.type === "ADD_USER_DATA") {
        return {
            ...state,
            user: action.user,
            signedIn: true
        }
    } else if(action.type === 'REMOVE_USER_DATA') {
        return {
            ...state,
            user: {
                firstName: '',
                lastName: ''
            },
            signedIn: false
        }
    } else if(action.type === 'ADD_LIKE') {
        return {
            ...state,
            user: {
                ...state.user,
                likedQuizzes: state.user.likedQuizzes.concat(action.id)
            }
        }
    } else if(action.type === 'REMOVE_LIKE') {
        return {
            ...state,
            user: {
                ...state.user,
                likedQuizzes: state.user.likedQuizzes.filter(quiz => quiz !== action.id)
            }
        }
    } 
    else {
        return state;
    }
}

export default firstReducer;