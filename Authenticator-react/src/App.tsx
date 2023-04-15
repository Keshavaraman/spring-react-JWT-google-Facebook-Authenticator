import React,{Suspense, useEffect}from 'react';
import {redirect, Route,Routes} from 'react-router-dom';
import './App.css';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from './resources/configureStore';
const LoginPage=React.lazy(()=>import('./components/login/index'));
const LandingPage=React.lazy(()=>import('./components/LandingPage/index'));
const store = configureStore();

export function returnStore() : any{
    return {
        storeComponent: store,
        storeStates: store.getState()
    };
}
function App() {


  return (
    <Provider store={store}>
    <Suspense fallback={<div>loading....</div>}>
    <div className="App">
    <Routes>
      <Route
      path="/"
      element={<Suspense fallback={<div>loading....</div>}>
      <LoginPage/>
      </Suspense>}
      />

      <Route
      path="/LandingPage"
      element={<Suspense fallback={<div>loading....</div>}>
      <LandingPage/>
      </Suspense>}
      />



    </Routes>

    </div>
    </Suspense>
    </Provider>
  );
}

export default App;
