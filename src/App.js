import React from 'react';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import auth from './helpers/auth';
import Sidebar from './Components/Sidebar';
import SignIn from './Components/SignIn';
import Home from './Components/Home';
import './Components/styles.css';
import SignUp from './Components/SignUp';
import CreateQuiz from './Components/MyQuizzes';
import EditQuiz from './Components/EditQuiz';
import CommunityQuizzes from './Components/CommunityQuizzes/CommunityQuizzes';
import ViewQuiz from './Components/ViewQuiz/ViewQuiz';
import Groups from './Components/Groups/Groups';
import TakeQuiz from './Components/TakeQuiz/TakeQuiz';
import Scores from './Components/Scores/Scores';
import Settings from './Components/Settings/Settings';

export default class App extends React.Component {

  componentDidMount(){
    auth('load');
  }
  
  render(){
    return (
      <div className="App">
        <Router>
          <Sidebar />
          <div className="body">
              <Switch>
                <Route exact path="/">
                  <Redirect to="/home"></Redirect>
                </Route>
                <Route path="/home" component={Home} />
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/myquizzes" component={CreateQuiz} />
                <Route path="/edit-quiz" component={EditQuiz} />
                <Route path="/quizzes" component={CommunityQuizzes}/>
                <Route path="/quiz-page/:id" component={ViewQuiz}/>
                <Route path="/groups" component={Groups} />
                <Route path="/take-quiz/:id" component={TakeQuiz} />
                <Route path="/scores/:id" component={Scores} />
                <Route path="/settings" component={Settings} />
              </Switch>
          </div>
        </Router>
      </div>
    )
  }
}