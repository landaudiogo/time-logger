import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import StopwatchView from "./features/stopwatch-view"
import TimerView from "./features/timer-view"
import Homepage from "./Homepage"
import './App.css';
import { Provider } from "react-redux";
import { store } from "store";

function App() {
  return (
    <Provider store={store}>
        <Routes>
            <Route path='/' element={<Homepage/>}/>
            <Route path='/stopwatch' element={<StopwatchView/>}/>
            <Route path='/timer' element={<TimerView/>}/>
            <Route path="*" element={<Navigate to="/"/>}/> 
        </Routes>
    </Provider>
  );
}

export default App;
