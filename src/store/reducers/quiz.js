import { initState } from '../index';

const quizReducer = (state = initState, action) => {
    if(action.type === 'SET_USER_QUIZZES') {
        return {
            ...state,
            userQuizzes: action.quizzes
        }
    } else if(action.type === 'SELECT_QUIZ_EDIT') {
        return {
            ...state,
            selectedQuizEdit: action.quiz,
        }
    } else if(action.type === 'ADD_QUESTION') {
        return {
            ...state,
            selectedQuizEdit: {
                ...state.selectedQuizEdit,
                questions: state.selectedQuizEdit.questions.concat(action.question)
            }
        }
    } else if(action.type === 'CHANGE_PUBLICITY') {
        let quizzes = state.userQuizzes;
        quizzes[action.idx] = action.quiz;
        return {
            ...state,
            userQuizzes: quizzes
        }
    } else if(action.type === 'REMOVE_QUIZ_DATA') {
        return {
            ...state,
            userQuizzes: [],
            selectedQuizEdit: false
        }
    } else if(action.type === 'DELETE_QUIZ') {
        return {
            ...state,
            userQuizzes: state.userQuizzes.filter(quiz => {
                return quiz._id !== action._id
            })
        }
    }
    else {
        return state;
    }
}

export default quizReducer;