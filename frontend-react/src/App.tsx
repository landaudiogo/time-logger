import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import StopwatchView from "./features/stopwatch-view"
import './App.css';

function App() {
  return (
    <Routes>
        <Route path='/' element={<StopwatchView/>}/>
        <Route path='/stopwatch' element={<StopwatchView/>}/>
        <Route path='/timer' element={<StopwatchView/>}/>
        <Route path="*" element={<Navigate to="/"/>}/> 
    </Routes>
  );
}

export default App;
