import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducers from '../redux/reducer';
import sagas from '../redux/saga';

export const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(reducers, composeWithDevTools(applyMiddleware(sagaMiddleware)));
    sagaMiddleware.run(sagas);
    return store;
}