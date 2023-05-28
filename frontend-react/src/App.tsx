import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import StopwatchView from "./features/stopwatch-view"
import TimerView from "./features/timer-view"
import Header from "./features/header"
import Homepage from "./Homepage"
import './App.css';
import { Provider } from "react-redux";
import { store } from "store";

function App() {
  return (
    <Provider store={store}>
        <Header />
        <Routes>
            <Route path='/' element={<Navigate to="/timer"/>}/>
            <Route path='/stopwatch' element={<StopwatchView/>}/>
            <Route path='/timer' element={<TimerView/>}/>
            <Route path="*" element={<Navigate to="/"/>}/> 
        </Routes>
    </Provider>
  );
}

export default App;
