import React from 'react';
import store from '../store/index';
import { Spring } from 'react-spring/renderprops';
import $ from 'jquery';
import NewQuizModal from './NewQuizModal';
import axios from 'axios';
import auth from '../helpers/auth';
import health from '../assets/health.jpg';
import food from '../assets/food.jpg';
import math from '../assets/math.jpg';
import other from '../assets/other.jpg';
import tech from '../assets/tech.jpg';
import science from '../assets/science.jpg'
import dateFormat from '../helpers/dateFormat';
import getQuizStats from '../helpers/getQuizStats';

export default class CreateQuiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stats: {
                mostLiked: '',
                mostViewed: '',
                totalLikes: 0,
                totalQuizzes: 0,
                totalViews: 0,
                avgLikes: 0,
            },
            groups: [],
            selectedQuiz: {},
            quizzes: [],
            quizzesToDisplay: [],
            inputVal: ''
        }
    }

    componentDidMount(){
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
        if(!auth('get')) return;
        this.getQuizzes();
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    showModal = () => {
        if(!auth('get')) return;
        $('#quiz-modal').fadeIn(300);
    }

    getImg(cat) {
        let img;
        switch(cat){
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

    getQuizzes = () => {
        let userId = auth('get').user._id;
        let body = {_id: userId}
        if(!auth('auth')) return;
        // http://localhost:9000
        axios.post('/quiz/get-users-quizzes', body).then(res => {
            if(res.data.message === 'success') {
                this.setState({
                    stats: getQuizStats(res.data.data),
                    quizzes: res.data.data,
                    quizzesToDisplay: res.data.data
                });
            }
        })
    }

    goToMyQuiz = (id, e) => {
        if($(e.target).hasClass('fas')) return;
        this.props.history.push(`/quiz-page/${id}`);
    }

    share = async (quiz) => {
        await this.setState({selectedQuiz: quiz});
        this.getMyGroups();
    }

    getMyGroups = () => {
        if (!auth('get')) return;
        // http://localhost:9000
        axios.post('/quiz/my-groups', { _id: auth('get').user._id }).then(res => {
            if (res.data.message === 'success') {
                this.setState({
                    groups: res.data.data
                })
            }
        })
    }

    shareQuiz = (group) => {
        // http://localhost:9000
        axios.post('/quiz/share-quiz', {groupId: group._id, quizId: this.state.selectedQuiz._id}).then(res => {
            if(res.data.message === 'success') {
                this.getMyGroups();
            }
        })
    }

    unShare = (group, idx) => {
        // http://localhost:9000
        axios.post('/quiz/unshare-quiz', {groupId: group._id, quizId: this.state.selectedQuiz._id}).then(res => {
            if(res.data.message === 'success') {
                this.getMyGroups();
            }
        })
    }

    hideFooter = () => {
        this.setState({selectedQuiz: {}})
    }

    searchMyQuizzes = () => {
        let newQuizzes = [];
        this.state.quizzes.map(quiz => {
            if(quiz.quizName.toLowerCase().includes(this.state.inputVal.toLowerCase())) {
                newQuizzes.push(quiz);
            } else if(quiz.description.toLowerCase().includes(this.state.inputVal.toLowerCase())) {
                newQuizzes.push(quiz);
            }
        })
        this.setState({quizzesToDisplay: newQuizzes})
    }

    resetQuizzes = () => {
        this.setState({quizzesToDisplay: this.state.quizzes, inputVal: ''});
    }

    showScores = (id) => {
        this.props.history.push(`/scores/${id}`);
    }

    render() {
        return (
            <Spring config={{ duration: 400 }}
                from={{ opacity: 0 }}
                to={{ opacity: 1 }} >
                {props => (
                    <>
                        <NewQuizModal />
                        <div style={props} className="create-quiz-wrapper">
                            <div className="main">
                                <div className="body">
                                    <div className="left">
                                        <div className="heading">
                                            <span className="search-body">
                                                <input type="text" placeholder="Search my quizzes" value={this.state.inputVal} onChange={e => this.setState({inputVal: e.target.value})} />
                                                <i onClick={this.searchMyQuizzes} className="fas fa-search"></i>
                                            </span>
                                            <span onClick={this.resetQuizzes}><i className="fas fa-sync"></i></span>
                                        </div>
                                        <div className="content">
                                            {this.state.quizzesToDisplay.map((quiz, idx) => (
                                                <div alt={quiz.category} key={idx} className="quiz">
                                                    <img height="140" alt={quiz.quizName} src={this.getImg(quiz.category)} className="header" />
                                                    <div className={quiz.makePrivate ? 'private' : 'public'}>{quiz.makePrivate ? 'Private' : 'Public'}</div>
                                                    <div className="quiz-name">{quiz.quizName}</div>
                                                    <div className="buttons-wrapper">
                                                        <button onClick={(e) => this.goToMyQuiz(quiz._id, e)}>View Quiz</button>
                                                        <button onClick={() => this.showScores(quiz._id)}>Scores</button>
                                                    </div>
                                                    <div className="quiz-date">Created on {dateFormat(quiz.Date)}</div>
                                                    <div className="bottom">
                                                        <div>
                                                            <i className="far fa-heart"></i>
                                                            <span style={{marginLeft: 10, fontSize: '0.7em'}}>{quiz.likes} likes</span>
                                                        </div>
                                                        <div>
                                                            <i style={{zIndex: 1}} onClick={() => this.share(quiz)} className="fas fa-share-square"></i>
                                                            <span style={{fontSize: '0.7em', marginLeft: '10px'}}>Share</span>
                                                        </div>
                                                    </div>
                                                    <div style={{fontSize: '.8em', width: '90%', margin: '0 auto'}}>{quiz.description}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="heading">Stats</div>
                                        <div style={{fontWeight: '600'}} className="content">
                                            <div className="stat">
                                                <span>Total Quizzes: </span>
                                                <span>{this.state.stats.totalQuizzes}</span>
                                            </div>
                                            <div className="stat">
                                                <span>Total Likes: </span>
                                                <span>{this.state.stats.totalLikes}</span>
                                            </div>
                                            <div className="stat">
                                                <span>Total views: </span>
                                                <span>{this.state.stats.totalViews}</span>
                                            </div>
                                            <div className="stat">
                                                <span>Most Viewed: </span>
                                                <span>{this.state.stats.mostViewed}</span>
                                            </div>
                                            <div className="stat">
                                                <span>Most Liked: </span>
                                                <span>{this.state.stats.mostLiked}</span>
                                            </div>
                                            <div className="stat">
                                                <span>Average likes: </span>
                                                <span>{this.state.stats.avgLikes.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div onClick={this.showModal} className="footer">
                                            <i className="fas fa-plus"></i>
                                            <span>New Quiz</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.selectedQuiz.hasOwnProperty('_id') ? <div className="footer">
                                <div className="header">
                                    <h2>Share {this.state.selectedQuiz.quizName} with my groups</h2>
                                    <div onClick={this.hideFooter}>x</div>
                                </div>
                                <div className="groups">
                                    {this.state.groups.map((group, index) => (
                                        <div key={index} className="group">
                                            <span>{group.name}</span>
                                            <span>{group.users.length} users</span>
                                            <span>{group.quizzes.length} quizzes</span>
                                            {group.quizzes.includes(this.state.selectedQuiz._id) ? <button onClick={() => this.unShare(group, index)} className="unshare">Unshare</button> : <button onClick={() => this.shareQuiz(group)}>share</button>}
                                        </div>
                                    ))}
                                </div>
                            </div> : ''}
                        </div>
                    </>
                )}
            </Spring>
        )
    }
}