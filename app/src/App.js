import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import HomePage from './Pages/Home/Home'
import Portal from './Pages/Portal/Portal';
import Navigation from './components/Navigation/Navigation';


class App extends React.Component {


  render() {
    return (
      <BrowserRouter> 
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
                    component={Portal}/>
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </>
        )} />
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
