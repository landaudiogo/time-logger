import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles.css"

export default function Header() {
    const location = useLocation();
    var locationText: string;
    if (location.pathname === "/timer") {
        locationText = "Timer";
    } else if (location.pathname === "/stopwatch") {
        locationText = "Stopwatch";
    } else if (location.pathname === "/statistics") {
        locationText = "Statistics";
    } else {
        locationText = "";
    }

    const [active, setActive] = useState<boolean>();

    useEffect(() => {
        window.addEventListener('keydown', (e: KeyboardEvent)=>{
            if (e.key === "Escape") {
                setActive(false);
            }
        });
    }, [])

    function handleOutClick() { 
        setActive(false);
    }

    return (
        <div className="header-container">
            <div className="header-title-container">
                <h1 
                    className="active-title" 
                    onClick={() => setActive(true)}
                >
                    {locationText}
                    <p className="options-indicator">
                        &#9660;
                    </p>
                </h1>
            </div>
            <div 
                className={`element-cover-page ${active && "element-cover-page-active"}`} 
                onClick={handleOutClick}
            />
            {active &&
                <div 
                    className={`page-options ${active && "page-options-active"}`}
                    onClick={handleOutClick}
                >
                    <Link to="/stopwatch" className="page-option">
                        <h2 className="page-option-text page-option-first">Stopwatch</h2>
                    </Link>
                    <Link to="/timer" className="page-option">
                        <h2 className="page-option-text page-option-last">Timer</h2>
                    </Link>
                    <Link to="/statistics" className="page-option">
                        <h2 className="page-option-text page-option-last">Statistics</h2>
                    </Link>
                </div>
            }
        </div>

    )
}
