import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import accountReducer from '../reducers/account';
import authReducer from '../reducers/auth'
import errorsReducer from '../reducers/errors';
import profileReducer from '../reducers/profile';
import transactionsReducer from '../reducers/transaction'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    combineReducers({
        auth: authReducer,
        errors: errorsReducer,
        profile: profileReducer,
        account: accountReducer, 
        transactions: transactionsReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
);

export default store