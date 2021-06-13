import React, { useState, useReducer, useEffect, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';
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
  const [formIsValid, setFormIsValid] = useState(false);
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value:'', isValid:null})
  const [emailState, dispatchEmail] = useReducer(emailReducer, {value:'', isValid: null}); 
  
  const authCtx = useContext(AuthContext); 
  const {isValid: emailIsValid} = emailState; 
  const {isValid: passwordIsValid} = passwordState; 

  const emailInputRef = useRef(); 
  const passwordInputRef = useRef(); 
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
    dispatchEmail({type: 'USER_INPUT', val: event.target.value}); 
 
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: ACTIONS.USER_PASSWORD, payload: {value: event.target.value }})

  };

  const validateEmailHandler = () => {
    dispatchEmail({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: ACTIONS.INPUT_BLUR}); 
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid){
      authCtx.onLogin(emailState.value, passwordState.value);
    }else if(!emailIsValid){
      emailInputRef.current.focus(); 
    }else{
      passwordInputRef.current.focus(); 
      
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
          ref={emailInputRef} 
          isValid={emailState.isValid}
          label={'E-mail'} 
          id='email' 
          type='email' 
          value={emailState.value} 
          onChange={emailChangeHandler} 
          onBlur={validateEmailHandler}  
        />
        <Input  
          ref={passwordInputRef}
          isValid={passwordState.isValid}
          label={'Password'} 
          id='password' 
          type='password' 
          value={passwordState.value} 
          onChange={passwordChangeHandler} 
          onBlur={validatePasswordHandler}  
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
