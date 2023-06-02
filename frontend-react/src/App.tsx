import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import StopwatchView from "./features/stopwatch-view";
import TimerView from "./features/timer-view";
import Header from "./features/header";
import Footer from "./features/footer";
import Statistics from "./features/statistics-view"
import './App.css';
import { Provider } from "react-redux";
import { store } from "store";

function App() {
  return (
    <Provider store={store}>
        <div className="view-container">
        <Header />
        <Routes>
            <Route path='/' element={<Navigate to="/timer"/>}/>
            <Route path='/stopwatch' element={<StopwatchView/>}/>
            <Route path='/timer' element={<TimerView/>}/>
            <Route path='/statistics' element={<Statistics/>}/>
            <Route path="*" element={<Navigate to="/"/>}/> 
        </Routes>
        <Footer />
        </div>
    </Provider>
  );
}

export default App;
