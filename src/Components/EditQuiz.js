import React from 'react';
import $ from 'jquery';
import NewQuizModal from './NewQuizModal';
import { Spring } from 'react-spring/renderprops';
import store from '../store/index';
import axios from 'axios';
import dateFormat from '../helpers/dateFormat';
import auth from '../helpers/auth';
import ModalDeleteQuiz from './ModalDeleteQuiz';

export default class EditQuiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            question: '',
            answers: [],
            correctAnswer: '',
            addQuestion: false,
            answer: '',
            quizToDelete: {}
        }
    }

    startQuestion = () => {
        if (!auth('get')) return;
        if(!store.getState().quizReducer.selectedQuizEdit) return;
        $('#add-question').slideDown(300);
    }

    cancelQuestion = () => {
        $('#add-question').slideUp(300);
    }

    onAnswerChange = (e) => {
        this.setState({ answer: e.target.value });
    }

    onQuestionChange = (e) => {
        this.setState({ question: e.target.value })
    }

    selectCorrectAnswer = (e) => {
        this.setState({ correctAnswer: e.target.value })
    }

    onAddAnswer = (e) => {
        let continueD = true;
        this.state.answers.forEach(ans => {
            if (ans.name === this.state.answer) {
                continueD = false;
            }
        })
        if (continueD === false || this.state.answers.length === 5 || !this.state.answer) return;
        this.setState({
            answers: this.state.answers.concat({
                name: this.state.answer,
                selected: false,
            }),
            answer: ''
        })
    }

    selectQuiz = (quiz) => {
        store.dispatch({
            type: "SELECT_QUIZ_EDIT",
            quiz: quiz
        })
    }

    onDeleteAnswer = (name) => {
        this.setState({
            answers: this.state.answers.filter(ans => ans.name !== name)
        })
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
        if (!auth("get")) return;
        let userId = auth('get').user._id;
        let body = { _id: userId }
        if (!auth('auth')) return;
        // http://localhost:9000
        axios.post('/quiz/get-users-quizzes', body).then(res => {
            if (res.data.message === 'success') {
                store.dispatch({
                    type: 'SET_USER_QUIZZES',
                    quizzes: res.data.data
                })
            }
        })
    }



    componentWillUnmount() {
        this.unsubscribe();
    }

    showModal = () => {
        if (!auth("get")) return;
        $('#quiz-modal').fadeIn(300);
    }

    formSubmit = (e) => {
        e.preventDefault();
        if (this.state.answers.length < 2 || !this.state.question || !this.state.correctAnswer || !store.getState().quizReducer.selectedQuizEdit) return;
        // http://localhost:9000
        axios.post('/quiz/add-question', {
            questionName: this.state.question,
            answers: this.state.answers,
            correctAnswer: this.state.correctAnswer,
            _id: store.getState().quizReducer.selectedQuizEdit._id
        }).then(res => {
            this.setState({ message: res.data.message })
            if (res.data.message === 'Question added!') {
                store.dispatch({
                    type: "ADD_QUESTION",
                    question: res.data.data
                })
            }
            this.setState({
                message: '',
                question: '',
                answers: [],
                correctAnswer: '',
                answer: ''
            });
        })
    }

    changePublicity = (quiz, idx) => {
        // http://localhost:9000
        axios.post('/quiz/change-publicity', { publicity: quiz.makePrivate, _id: quiz._id }).then(res => {
            if (res.data.message === 'success') {
                store.dispatch({
                    type: 'CHANGE_PUBLICITY',
                    quiz: res.data.data,
                    idx: idx
                })
            }
        })
    }

    showModalDelete = (quiz) => {
        if (!auth("get")) return;
        this.setState({quizToDelete: quiz})
        $('#delete-modal').fadeIn(300);
    }

    deleteQuestion = (ques) => {
        let quiz = store.getState().quizReducer.selectedQuizEdit;
        // http://localhost:9000
        axios.post('/quiz/delete-question', {_id: quiz._id, question: ques}).then(res => {
            if(res.data.message === 'success') {
                store.dispatch({
                    type: "SELECT_QUIZ_EDIT",
                    quiz: res.data.data
                })
            }
        })
    }

    render() {
        return (
            <Spring config={{ duration: 400 }}
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
            >
                {props => (
                    <>
                        <NewQuizModal />
                        <ModalDeleteQuiz quiz={this.state.quizToDelete}/>
                        <div style={props} className="edit-quiz-wrapper">
                            <div className="top">
                                <div className="left">
                                    <div className="top-section">
                                        <div className="header quiz-row">
                                            <div>Created Date</div>
                                            <div>Quiz Name</div>
                                            <div>questions</div>
                                            <div># of likes</div>
                                            <div>Actions</div>
                                        </div>
                                        <div className="quiz-row-edit">
                                            {store.getState().quizReducer.userQuizzes.map((quiz, idx) => (
                                                <div key={idx} className="quiz-edit">
                                                    <div>{dateFormat(quiz.Date)}</div>
                                                    <div>{quiz.quizName}</div>
                                                    <div>{quiz.questions.length}</div>
                                                    <div>{quiz.likes}</div>
                                                    <div>
                                                    </div>
                                                    <button onClick={() => this.selectQuiz(quiz)} className="first-btn">Select</button>
                                                    <button onClick={() => this.changePublicity(quiz, idx)} className={quiz.makePrivate ? 'make-public' : 'make-private'}>{quiz.makePrivate ? 'Make Public' : 'Make Private'}</button>
                                                    <button onClick={() => this.showModalDelete(quiz)}>Delete</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="buttons-wrapper">
                                        <button onClick={this.startQuestion} className="new-quiz">
                                            <div>Add Question</div>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                        <button onClick={this.showModal} className="new-quiz">
                                            <div>New Quiz</div>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <form id="add-question" style={{ display: 'none' }} onSubmit={this.formSubmit} >
                                        <div className="add-question">
                                            <input className="text-input" type="text" onChange={this.onQuestionChange} placeholder="Question" value={this.state.question} />
                                            <input className="text-input" type="text" onChange={this.onAnswerChange} value={this.state.answer} placeholder="Answer" />
                                            <br></br>
                                            <div className="buttons-wrapper-answer">
                                                <button type="button" onClick={this.cancelQuestion}>Cancel</button>
                                                <button onClick={this.onAddAnswer} type="button">Add Answer</button>
                                            </div>
                                            <div className="which-answer">Which answer is correct</div>
                                            <div className="answers-wrapper">
                                                {this.state.answers.map((ans, idx) => (
                                                    <div onChange={this.selectCorrectAnswer} className="answer-a" key={idx}>
                                                        <input name="answer" className="answer" key={idx} type="radio" value={ans.name} />
                                                        <div className="name">{ans.name}</div>
                                                        <button onClick={() => this.onDeleteAnswer(ans.name)} type="button">Delete</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {this.state.correctAnswer ? <button style={{ marginTop: 15 }} type="submit">Add Question</button> : ''}
                                    </form>
                                </div>
                            </div>
                            <div className="bottom-section">
                                <div className="header-wrapper">
                                    <div className="header">{store.getState().quizReducer.selectedQuizEdit ? `Questions for ${store.getState().quizReducer.selectedQuizEdit.quizName}` : 'No quiz selected'}</div>
                                    <div className="sub-header">{store.getState().quizReducer.selectedQuizEdit ? `${store.getState().quizReducer.selectedQuizEdit.questions.length} Questions` : 'No quiz selected'}</div>
                                </div>
                                <div className="questions">
                                    {store.getState().quizReducer.selectedQuizEdit ? store.getState().quizReducer.selectedQuizEdit.questions.map((itm, idx) => (
                                        <div key={idx} className="question">
                                            <div>{itm.questionName}</div>
                                            <div>Answers: {itm.answers.length}</div>
                                            <div>Correct Ans: {itm.correctAnswer}</div>
                                            <button className="first-btn">Edit</button>
                                            <button onClick={() => this.deleteQuestion(itm)}>Delete</button>
                                        </div>
                                    )) : ''}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Spring>
        )
    }
}