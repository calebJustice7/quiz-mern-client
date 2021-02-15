import { createStore, combineReducers } from 'redux';
import firstReducer from './reducers/first';
import quizReducer from './reducers/quiz';

export let initState = {
    user: {},
    signedIn: false,
    userQuizzes: [],
    selectedQuizEdit: false
}

const reducer = combineReducers({
    userReducer: firstReducer,
    quizReducer: quizReducer
})

const store = createStore(reducer);
export default store;