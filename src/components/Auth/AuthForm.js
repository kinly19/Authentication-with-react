import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

// ============================== Notes ==============================
//  firebase rest api - https://firebase.google.com/docs/reference/rest/auth
//  firebase signup with email and password  - https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
//  firebase authenticaton end point (sign up)
//    https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
//    [API_KEY] should be replace with an apikey
// firebase sign in
//    https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
// ===================================================================

const AuthForm = () => {

  //storing inputs with useRef
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext); 
  //apikey, use helper const or do inline with fetch
  const fireBaseKey = 'AIzaSyDXQZiKmN9NITd8O6cnXccudiKDrftom4k';
  
  //login state
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsloading ] = useState(false);

  //switch state 
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  //submit form
  const submitHandler = (e) => {
    e.preventDefault();
    // console.log( 'Email:' + emailInputRef.current.value + ' Password:' + passwordInputRef.current.value);
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    //optional validate input here
    setIsloading(true);
    let url;
    //change url endpoint for either login or signup
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${fireBaseKey}`
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${fireBaseKey}` 
    }

    fetch(url, {
      method: "POST",
      //data to send, JSON.stringify()
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      //ensures REST api knows we have JSON data coming in
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        setIsloading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            // generic/default message if below check fails
            // or just show a custom error modal etc
            let errorMessage = "Authentication failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
        authCtx.login(data.idToken);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1> {/*ternary operator*/}
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          {isLoading && <button>Sending Request...</button>}
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
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
