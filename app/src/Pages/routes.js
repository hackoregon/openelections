import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Navigation from '../components/Navigation/Navigation'
import HomePage from './Home/Home'
import SignupPage from './Signup/Signup'
import Portal from './Portal/Portal';
const Routes = (props) => {
  
  return (
    <Route render={ ({location}) => (
      <>
        <Navigation />
        <TransitionGroup className="smooth-container">
          <CSSTransition
            key={location.pathname}
            timeout={{enter: 500, exit: 300}}
            classNames="page"
            appear
            >
            <Switch location={location}>
              <Route
                exact
                path="/"
                component={HomePage}/>
              <Route
                exact
                path="/signup"
                component={SignupPage}/>
              <Route
                component={Portal}/>
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </>
    )} />
  )
}
export default Routes