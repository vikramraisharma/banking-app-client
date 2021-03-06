import jwt_decode from 'jwt-decode';
import { initiateGetProfile } from '../actions/profile';
import store from '../store/store';
import {signIn} from '../actions/auth';
import {history} from '../router/AppRouter';
import Axios from 'axios';

export const validateFields = (fieldsToValidate) => {
    return fieldsToValidate.every((field) => Object.values(field)[0] !== '');
};

export const maintainSession = () => {
  const user_token = localStorage.getitem('user_token');
  if(user_token){
    const currentPath = window.location.pathname;
    if(currentPath === '/' || currentPath === '/register'){
      history.push('/profile');
    }
    const decoded = jwt_decode(user_token);
    updateStore(decoded)
  } else {
    history.push('/')
  }
};

export const updateStore = (user) => {
  const { userid, email } = user;
  store.dispatch(
    signIn({
      userid,
      email,
      token: localStorage.getItem('user_token')
    })
  );
  store.dispatch(initiateGetProfile(email))
}

export const setAuthHeader = () => {
  const token = localStorage.getItem('user_token');
  if(token){
    Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
};

export const removeAuthHeader = () => {
  delete Axios.defaults.headers.common['Authorization'];
}