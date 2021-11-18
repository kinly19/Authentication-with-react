import React, { useState, useEffect, useCallback }from 'react';
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

let logoutTimer;

//initial state
const AuthContext = React.createContext({
//initialize context with initial data, define general shape of context and get better auto completion when used
  token: '',
  isLoggedIn: false,

  login: (token) => {},
  logout: () => {}
});

//calculate remaining Time
const calRemainingTime = (expirationTime) => {
  //current time
  const currentTime = new Date().getTime();
  //adjusted time
  const adjExpirationTime = new Date(expirationTime).getTime();
  //remaining 
  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

//retrive token from local storage 
const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const remainingTime = calRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

//context state
// a component which we will use as a wrapper around other components to provide access to its context
//manage state
export const AuthContextProvider = (props) => {
  //states
  const tokenData = retrieveStoredToken();
  let initialToken; 
  if (tokenData) {
    initialToken = tokenData.token;
  }
  
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token; // this simply converts this truthy or falsy value to a true or false Boolean value.

  const logOutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    //clearing time if set
    if(logoutTimer){
      clearTimeout(logoutTimer);
    };
  },[]);

  // functions/actions for changing context state, handle auto logout
  const loginHandler = (token, expirationTime) => {
    setToken(token);

    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calRemainingTime(expirationTime);
    logoutTimer = setTimeout(logOutHandler, remainingTime);
  };

  //set logout handler if we automatically logged in the user
  useEffect(() => {
    if (tokenData){
      console.log(tokenData.duration)
      logoutTimer = setTimeout(logOutHandler, tokenData.duration);
    }
  },[tokenData, logOutHandler])

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