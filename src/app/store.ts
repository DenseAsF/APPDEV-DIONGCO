import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './saga';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// @ts-ignore
const composeEnhancers = (typeof globalThis !== 'undefined' && (globalThis as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

sagaMiddleware.run(rootSaga);

export default store;
