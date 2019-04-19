import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import HomePage from './components/Home/Home'
// import Doohicky from './components/Doohicky'
import './App.css';


class App extends React.Component {


  public render() {

    let app = <Route render={ ({location}) => (
      <>
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
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </>
    )} />

    return (
      <BrowserRouter> 
          { app }
      </BrowserRouter>
    );

  }
  
  // public render() {
  //   return (
  //     <div className="App">
  //       <header className="App-header">
  //         <img src={logo} className="App-logo" alt="logo" />
  //         <h1 className="App-title">Welcome to React</h1>
  //       </header>
  //       <Doohicky />
  //       <p className="App-intro">
  //         To get started, edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //     </div>
  //   );
  // }
}



export default App;
