import {all} from "redux-saga/effects";
import { watchLoginSaga,watchFbLoginSaga,watchGLoginSaga} from "./LoginSaga";
export default function* rootSaga(){
    yield all([
        watchLoginSaga(),
        watchFbLoginSaga(),
        watchGLoginSaga()
    ]);
}