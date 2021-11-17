import React, { useState }from 'react';
// ============================== Notes ==============================
// https://reactjs.org/docs/context.html - react context
// React.createContext - Creates a Context object When React renders a component that subscribes to this Context object 
//  it will read the current context value from the closest matching Provider ( AuthContextProvider ) above it in the tree.
// Context.Provider - will provide our context to components that need it ( props.children allows us to wrap Provider around consuming components)
// AuthContextProvider - a component used overall as a wrapper to provide access to its context
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
  const [token, setToken] = useState(null);
  const userIsLoggedIn = !!token; // this simply converts this truthy or falsy value to a true or false Boolean value.

// functions/actions for changing context state
  const loginHandler = (token) => {
    setToken(token);
  }

  const logOutHandler = () => {
    setToken(null);
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