import React from 'react';
import './CommunityQuizzes.css';
import store from '../../store/index';
import health from '../../assets/health.jpg';
import food from '../../assets/food.jpg';
import math from '../../assets/math.jpg';
import other from '../../assets/other.jpg';
import auth from '../../helpers/auth';
import tech from '../../assets/tech.jpg';
import science from '../../assets/science.jpg'
import dateFormat from '../../helpers/dateFormat';
import axios from 'axios';
import $ from 'jquery';

class CommunityQuizzes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quizzes: [],
            quizzesToDisplay: [],
            inputVal: ''
        }
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
        axios.post('http://localhost:9000/quiz/get-all-quizzes').then(res => {
            this.setState({ quizzes: res.data, quizzesToDisplay: res.data })
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    likeQuiz = (id, idx) => {
        if (store.getState().userReducer.user.likedQuizzes.includes(id)) return;
        axios.post('http://localhost:9000/quiz/like-quiz', {
            quizId: id,
            userId: auth('get').user._id
        }).then(res => {
            if (res.data.message === 'success') {
                let quizzes = this.state.quizzes;
                quizzes[idx].likes++;
                this.setState({
                    quizzes: quizzes
                });
                store.dispatch({
                    type: "ADD_LIKE",
                    id: res.data.data.likedQuizzes
                })
                let el = document.getElementById(`unlike${idx}`);
                el.disabled = true;
                setTimeout(() => {el.disabled = false}, 2000);
            }
        })
    }

    unLike(id, idx) {
        if (store.getState().userReducer.user.likedQuizzes.includes(id) && auth('get')) {
            axios.post('http://localhost:9000/quiz/unlike', { userId: auth('get').user._id, quizId: id }).then(res => {
                if (res.data.message === 'success') {
                    let quizzes = this.state.quizzes;
                    quizzes[idx].likes--;
                    this.setState({
                        quizzes: quizzes
                    });
                    store.dispatch({
                        type: "REMOVE_LIKE",
                        id: id
                    })
                    let el = document.getElementById(`like${idx}`);
                    el.disabled = true;
                    setTimeout(() => {el.disabled = false}, 2000);
                }
            })
        }
    }

    goToMyQuiz = (id) => {
        this.props.history.push(`/quiz-page/${id}`);
    }


    getImg(cat) {
        let img;
        switch (cat) {
            case 'tech':
                img = tech;
                break;
            case 'other':
                img = other;
                break;
            case 'health':
                img = health;
                break;
            case 'math':
                img = math;
                break;
            case 'food':
                img = food;
                break;
            case 'science':
                img = science;
                break;
            default:
                img = other;
                break;
        }
        return img;
    }

    searchForQuizzes = () => {
        axios.post('http://localhost:9000/quiz/search-for-quizzes', {quizName: this.state.inputVal}).then(res => {
            if(res.data.message === 'success') {
                this.setState({quizzesToDisplay: res.data.data});
            }
        })
    }

    resetQuizzes = () => {
        this.setState({inputVal: '', quizzesToDisplay: this.state.quizzes});
    }

    render() {
        return (
            <div className="com-quizzes">
                <div className="top-section">
                    <div className="left">
                        <div className="search-body">
                            <input value={this.state.inputVal} onChange={e => this.setState({inputVal: e.target.value})} type="text" placeholder="Search for quizzes" />
                            <i onClick={this.searchForQuizzes} className="fas fa-search"></i>
                        </div>
                    </div>
                    <div onClick={this.resetQuizzes} className="right">
                        <span style={{marginRight: '8px'}}>Reset  </span>
                        <i className="fas fa-sync-alt"></i>
                    </div>
                </div>
                <div className="bottom-section">
                    {this.state.quizzesToDisplay.map((quiz, idx) => (
                        <div className="quiz" key={idx}>
                            <img alt={idx} src={this.getImg(quiz.category)} />
                            <div className="quiz-name">{quiz.quizName}</div>
                            <div style={{ marginBottom: '5px' }}>created {dateFormat(quiz.Date)}</div>
                            {store.getState().userReducer.signedIn ? store.getState().userReducer.user.likedQuizzes.includes(quiz._id) ?
                                <i style={{zIndex: 0}} style={{ color: 'red' }} className="fas fa-heart"><button style={{marginLeft: '-25px', height: '23px', background: 'none'}} id={`unlike${idx}`} onClick={() => this.unLike(quiz._id, idx)}></button></i>: 
                                <i style={{zIndex: 0}} style={{ color: 'red' }} className="far fa-heart"><button style={{marginLeft: '-25px', height: '23px', background: 'none'}} id={`like${idx}`} onClick={() => this.likeQuiz(quiz._id, idx)}></button></i>: ''}
                            <span style={{ marginLeft: 10, fontSize: '0.9em' }}>{quiz.likes > 1 || quiz.likes === 0 ? `${quiz.likes} likes` : `${quiz.likes} like`}</span>
                            <span style={{marginLeft: '20px'}}><i style={{fontSize: '1.2em'}} className="fas fa-share-square"></i></span>
                            <br></br>
                            <button style={{marginTop: '-23px'}} onClick={() => this.goToMyQuiz(quiz._id)}>Take Quiz</button>
                            <i className="fas fa-ellipsis-v"></i>
                            <div className="details">
                                <div><span>Creator:</span> {quiz.createdBy}</div>
                                <div><span>Category:</span> {quiz.category}</div>
                                <div><span>{quiz.questions.length}</span> questions</div>
                                <div><span>Description</span> {quiz.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default CommunityQuizzes;