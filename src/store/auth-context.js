import React, { useState }from 'react';
// ============================== Notes ==============================
// https://reactjs.org/docs/context.html - react context
// React.createContext - Creates a Context object When React renders a component that subscribes to this Context object 
//  it will read the current context value from the closest matching Provider ( AuthContextProvider ) above it in the tree.
// Context.Provider - will provide our context to components that need it ( props.children allows us to wrap Provider around consuming components)
// AuthContextProvider - a component used overall as a wrapper to provide access to its context

// localStorage() - read-only property of the window interface allows you to access a Storage object
// setItem() - allows us to store a key value pair to the given storage object
// we can then store a token inside out localstorage and have our state check inside of local storage first before setting a new token
// ===================================================================

//initial state
const AuthContext = React.createContext({
//initialize context with initial data, define general shape of context and get better auto completion when used
  token: '',
  isLoggedIn: false,

  login: (token) => {},
  logout: () => {}
});


//context state
// a component which we will use as a wrapper around other components to provide access to its context
//manage state
export const AuthContextProvider = (props) => {
  //states
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token; // this simply converts this truthy or falsy value to a true or false Boolean value.

// functions/actions for changing context state
  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logOutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logOutHandler,
  };

  //context provier 
  return <AuthContext.Provider value={contextValue}>
    {props.children}
  </AuthContext.Provider>
};

export default AuthContext;