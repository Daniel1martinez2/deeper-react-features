import React, { useState, useReducer, useEffect } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const ACTIONS = {
  USER_PASSWORD: 'password',
  INPUT_BLUR: 'input-blur'
}
const emailReducer = (state, action) =>{
  if(action.type === 'USER_INPUT'){
    return{
      value: action.val,
      isValid: action.val.includes('@')
    }
  }
  if(action.type === 'INPUT_BLUR'){
    return{
      //...state,
      value: state.value, //lat value entered by email
      isValid:  state.value.includes('@')
    }
  }
  return{
    value: '',
    isValid: false
  }
}

const passwordReducer = (currentPasswordState, action) => {
  switch (action.type) {
    case ACTIONS.USER_PASSWORD:
      
      return {
        value: action.payload.value, 
        isValid: action.payload.value.trim().length > 6 
      }; 
      
      case ACTIONS.INPUT_BLUR:
        
        return{ 
          // ...currentPasswordState, 
          value: currentPasswordState.value,
          isValid: currentPasswordState.value.trim().length > 6 
        
      }; 
  
    default:
      return {
        value: '',
        isValid: false
      }
      
  }
}
const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value:'', isValid:null})
  const [emailState, dispatchEmail] = useReducer(emailReducer, {value:'', isValid: null}); 
  
  const {isValid: emailIsValid} = emailState; 
  const {isValid: passwordIsValid} = passwordState; 
  useEffect(()=>{
    //debouncing -> cuando espero x segundos para revisar lo que escribio el user
    const identifier = setTimeout(() => {   
      console.log('checking form validity');
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);
    return ()=>{
      console.log('CleanUp');
      clearTimeout(identifier)
    };
    //se re ejecuta con cualquier cambio
    //lo cual no too good porque si ya esta valido y se agrega un caracter más, entonces lo vuelve a validar
    //muchas validaciones extras
    //en lugar de [passwordState, passwordState] -> [emailState.isValid, passwordState.isValid]
  }, [emailIsValid, passwordIsValid]); 

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    //dispatching the value ----> action
    dispatchEmail({type: 'USER_INPUT', val: event.target.value}); 
    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // ); 
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: ACTIONS.USER_PASSWORD, payload: {value: event.target.value }})
    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // ); 
  };

  const validateEmailHandler = () => {
    dispatchEmail({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: ACTIONS.INPUT_BLUR}); 
  };

  const submitHandler = (event) => {
    event.preventDefault();
   props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : '' 
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
