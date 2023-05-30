import React from "react";
import "./styles.css";

const commit_hash = process.env.REACT_APP_COMMIT_HASH;

export default function Footer() {

    return (
        <a 
            className="footer" 
            href={`https://www.github.com/landaudiogo/time-logger/commit/${commit_hash}`}
            target="_blank"
        >
            {commit_hash}
        </a>
    );
}
