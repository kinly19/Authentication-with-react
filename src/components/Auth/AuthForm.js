import { useState, useRef } from 'react';

import classes from './AuthForm.module.css';

// ============================== Notes ==============================
//  firebase rest api - https://firebase.google.com/docs/reference/rest/auth
//  firebase signup with email and password  - https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
//  firebase authenticaton end point 
//    https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
//    [API_KEY] should be replace with an apikey
// ===================================================================

const AuthForm = () => {

  //storing inputs with useRef
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);

  //switch state 
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1> {/*ternary operator*/}
      <form>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
