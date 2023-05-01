import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import StopwatchView from "./features/stopwatch-view"
import TimerView from "./features/timer-view"
import Homepage from "./Homepage"
import './App.css';

function App() {
  return (
    <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/stopwatch' element={<StopwatchView/>}/>
        <Route path='/timer' element={<TimerView/>}/>
        <Route path="*" element={<Navigate to="/"/>}/> 
    </Routes>
  );
}

export default App;
