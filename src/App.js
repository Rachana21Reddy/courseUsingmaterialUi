// import logo from './logo.svg';
import './App.css';
import Syllabus from './Syllabus';
import Login from './Login';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

export default function App() {
  return (
    <Router>
        <Switch>
          <Route path="/syllabus">
            <Syllabus />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
    </Router>
  );
}
