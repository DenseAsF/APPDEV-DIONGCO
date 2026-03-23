import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import rootSaga from './saga';

const sagaMiddleware = createSagaMiddleware();
const logger = createLogger({
  collapsed: true,
  diff: true,
  predicate: (getState, action) => 
    action.type !== 'SCROLL_TO_SECTION' && 
    action.type !== 'SET_CURRENT_SLIDE'
});

const middleware = [sagaMiddleware, logger];

const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

sagaMiddleware.run(rootSaga);

export default store;
